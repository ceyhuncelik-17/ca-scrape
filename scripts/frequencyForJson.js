const { update } = require("immutable");
const { Op } = require("sequelize");
const fs = require('fs');
const path = require('path');
const {
  CLASSIFICATION_KEYWORDS_LOOKUP,
  CLASSIFICATION_KEYWORDS_LOOKUP_TR,
  STOP_WORDS_OBJECT,
} = require("../configs/constants");
const db = require("../models");


const clearFullText = (fullTextArray) => {
  const filteredList = fullTextArray.filter((item) => {
    const clearRegex = /(\W)/g;
    const tempItem = item.trim().replace(clearRegex, "").toLowerCase();
    if (tempItem && tempItem.length > 1 && !STOP_WORDS_OBJECT[tempItem]) {
      return true;
    }
    return false;
  });
  return filteredList;
};

const splitFullText = (fullText) => {
  // const splitRegex = /(\W+|[_]+)/g; // split tweet full text with special karakters and _ then returnt splited text array
  return fullText.split(' ');
};

const hasNumeric = (item) => {
  const numericRegex = /\d/;
  return numericRegex.test(item);
};

//// sonradan eklenenler 
const fetchTweetPerKeywords = async (keywordValue) => {
  const tweets = await db.tweet.findAll({
    include: db.user,
    limit: 180,
    offset: 0,
    where: {
      workedFrequency: {
        [Op.is]: null,
      },
      fullText: {
        [Op.substring]: keywordValue,
      }
    },
    order: [["createTime", "DESC"]],
  });
  return tweets;
}
const generateTrainData = async () => {
  debugger;
  // kac tane parametre varsa hepsi icn d
  const tempTrainingJson = {
    tweetList: [],
    rowCount: 0,
  };
  const promises = [];
  const tempTweets = [];
  const tempMetaDatas = {
    // her keyword icin iki 8 tane var zaten diger kelimeleride saydırmamız gerekirmi 
    // [key] : keyContainedRowCount // diyelim o vakit sadece yeterli olacak bizim icin demi ama 
  } 
  const attributeObject = {};
  const initialRowMetaDatas = {
    // [key]: totatCountInRow
  };
  CLASSIFICATION_KEYWORDS_LOOKUP_TR.forEach(async ({ id, key, value }) => {
    promises.push(fetchTweetPerKeywords(value)); // has default limit & offset valus 
    tempMetaDatas[value] = 0; // generate meta object 
    attributeObject[value] = []; // generate meta object 
    initialRowMetaDatas[value] = 0; // generate meta object 
  });

  await Promise.all(promises).then(res => {
    res.forEach(resItem => resItem.forEach(rowItem => tempTweets.push(rowItem.dataValues)));
  }).catch(err => console.warn(err));

  tempTweets.forEach(tweetItem => {
    const tempRowMetaData = { ...initialRowMetaDatas }; 
    const { tweetId, fullText } = tweetItem;
    const tempFullTextArray = splitFullText(fullText);
    const fullTextArray = clearFullText(tempFullTextArray);
    let rowValidWordCount = fullTextArray.length;
    
    // her key icin tempDeger tutmalı o vakit diyelim
    fullTextArray.forEach(word => {
      if (!hasNumeric(word)) {
        const wordToLower = word.toLowerCase();
        // eger key degerimiz bizim hesapladıklarımızdan ise diyelim 
        if (tempRowMetaData[wordToLower] !== null&& tempRowMetaData[wordToLower] !== undefined) {
          tempRowMetaData[wordToLower] += 1;
        }
      } else {
        rowValidWordCount -= 1;
      }
    });

    // her satır icin degerleri olustur 
    const tempTfValues = {};
    Object.entries(tempRowMetaData).forEach(([value,count]) => {
      if (count > 0) {
        tempMetaDatas[value] += 1; 
        if(attributeObject[value]?.indexOf(count) === -1) {
          attributeObject[value].push(count);
        }
        tempTfValues[value] = count / rowValidWordCount;
      } else {
        tempTfValues[value] = 0;
      }
    });

    tempTrainingJson.tweetList.push({
      tweetId, 
      fullText, 
      rowValidWordCount,
      ...tempRowMetaData,
      tfValues: tempTfValues,
    });

  });

  // satır satır saydırma islemi tamamlanıca 
  const tempIdfValues = {};
  Object.entries(tempMetaDatas).forEach(([value, count]) => {
    if (count > 0) {
      tempIdfValues[value] = Math.log10(tempTweets.length / count);
    }
  });
  // 
  tempTrainingJson.lastList = tempTrainingJson.tweetList.map(tweetItem => {
    const tempTfIdfValues = {}
    Object.entries(tempMetaDatas).forEach(([value, count]) => {
      if (tweetItem.tfValues[value] > 0) {
        tempTfIdfValues[value] = tweetItem.tfValues[value] * count;
      } else {
        tempTfIdfValues[value] = 0;
      }
    });
    // ilk hesaplama yaptırırken bi metaya ekleme yaptırabiliriz diyelim deger yoksa ekle varsa dokunma yapılacak sadece 

    return {
      // ...tweetItem, 
      tweetId: tweetItem.tweetId,
      fullText: tweetItem.fullText,
      tfIdfValues: tempTfIdfValues,
      class: 0, // default class 
    }
  });
  const convertedListForArff =  tempTrainingJson.tweetList.map(item => ([
    item['kadın'], 
    item['özürlü'],
    item['türk'],
    item['müslüman'],
    item['yahudi'],
    item['hristiyan'],
    item['ergen'],
    item['mülteci'],
    item['fakir'],
    item['gavur'],
    0,
    item.fullText
  ]));
  const arffFormat = {
    'tweets': {
      relation: 'tweet',
      attributes: { ...attributeObject, class: [0,1] },
      data: convertedListForArff
    }
  };
  fs.writeFile(path.resolve('./') + "/jsonOutputs/arffFormat.json", JSON.stringify(arffFormat, null, 2), { flag: 'w' }, (err) => {
    if (err) {
      console.log(err);
    };
    console.log(tempTrainingJson);
  });
};


module.exports = {
  generateTrainData,
};