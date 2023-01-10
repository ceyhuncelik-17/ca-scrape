const { update } = require("immutable");
const { Op } = require("sequelize");
const {
  CLASSIFICATION_KEYWORDS_LOOKUP,
  STOP_WORDS_OBJECT,
} = require("../configs/constants");
const db = require("../models");
const { trainingAll } = require("../training/training-all");
const { csvToArray } = require("../utils/helpers");
// const cvsResult = require("../results/results.cvs");

// const wordMetasObjectJson = require('../jsonOutputs/wordMetasObject.json'); //!!!
// const termFreqInversDocFreqListJson = require('../jsonOutputs/termFreqInversDocFreqList.json'); //!!!

const generateFrequencyData = async ({ limit, offset }) => {
  const tweetIdList = [];

  const tweets = await db.tweet.findAll({
    include: db.user,
    limit,
    offset,
    where: {
      workedFrequency: {
        [Op.is]: null,
      },
    },
    order: [["createTime", "DESC"]],
  });
  // dataValues
  await tweets.forEach(async (tweetItem) => {
    const { tweetId, user, favoriteCount, retweetCount, fullText } =
      tweetItem.dataValues;
    const tweetDate = tweetItem.dataValues.createTime;
    const {
      userId,
      verified,
      gender,
      followersCount,
      friendsCount,
      statusCount,
    } = user;
    const userFavoritesCount = user.favoriteCount;

    const tempFullTextArray = splitFullText(fullText);
    const fullTextArray = clearFullText(tempFullTextArray);

    // const countsForFrequency = await frequencyCounter(fullText);
    // await db.frequency.create({
    //   userId,
    //   tweetId,
    //   verified,
    //   gender,
    //   followersCount,
    //   friendsCount,
    //   tweetFavoritesCount: favoriteCount,
    //   userFavoritesCount,
    //   statusCount,
    //   retweetCount,
    //   tweetDate,
    //   isViolence: null,
    //   ...countsForFrequency
    // });
    tweetIdList.push(tweetId);
  });

  // 0 ,  20  1
  // 20 , 20  2
  // 40 , 20  3
  return {
    tweets,
    nextLimit: limit,
    nextOffset: offset + limit,
    nextDataCount: tweets.length,
  };
};

const generateFrequencyAllData = async ({ limit, offset }) => {
  const res = await generateFrequencyData({ limit, offset });
  const { nextLimit, nextOffset, nextDataCount } = res;
  if (nextDataCount < nextLimit) {
    return {
      limit,
      offset,
      nextDataCount,
    };
  } else {
    await generateFrequencyAllData({ limit: nextLimit, offset: nextOffset });
  }
};

// keyList [1,2,3,4,5,6,] etc
// just want to update keyword ids
const frequencyCounter = (fullText, keyList) => {
  const tempCountsForFrequency = {};

  // const fullTextWordList = fullText.split(' ');
  const splitRegex = /[.,\/ -_#]/; //
  const fullTextWordList = fullText.split(" ");
  let filteredLookupList = CLASSIFICATION_KEYWORDS_LOOKUP;

  if (keyList && keyList.length > 0) {
    filteredLookupList = CLASSIFICATION_KEYWORDS_LOOKUP.filter(
      (item) => keyList.indexOf(item.id) !== -1
    );
  }

  filteredLookupList.forEach(({ value }) => {
    tempCountsForFrequency[value + "Count"] = 0;

    fullTextWordList.forEach((fullTextWord) => {
      if (fullTextWord && fullTextWord.toLowerCase().indexOf(value) !== -1) {
        tempCountsForFrequency[value + "Count"] += 1;
      }
    });
  });

  return tempCountsForFrequency;
};

const composeTrainingData = async () => {
  // json datayı okuyup frequency icinde tweet idnin eslestigi satırda isTraining satırını update edecek
  const updatedTweetIdList = [];
  await trainingAll.forEach(async (item) => {
    await db.frequency
      .update(
        { isTraining: 1, isViolence: item.isViolence },
        { where: { tweetId: item.tweetId } }
      )
      .then((result) => console.log(result + "-----------------"));
    updatedTweetIdList.push(item.tweetId);
  });

  return { tweetIds: updatedTweetIdList, result: "succes" };
};

const composeResultData = async () => {
  // json datayı okuyup frequency icinde tweet idnin eslestigi satırda isTraining satırını update edecek
  // const updatedTweetIdList = [];
  // const resultArray = csvToArray(cvsResult) // txt olarak okumak gerek sanrısam ama du bakalım
  // await resultArray.forEach(async (item) => {
  //   await db.frequency.update({ isViolence: item.isViolence }, { where: { id: item.id }}).then(result => console.log(result + '-----------------'));
  //   updatedTweetIdList.push(item.tweetId);
  // });
  // return {tweetIds: updatedTweetIdList, result: 'succes' };
};

// _____

const updateFrequencyData = async ({ limit, offset, keyList }) => {
  const tweets = await db.tweet.findAll({
    limit,
    offset,
    // where: {
    //   workedFrequency: {
    //     [Op.is]: null
    //   }
    // },
    order: [["createTime", "DESC"]],
  });
  // dataValues
  await tweets.forEach(async (tweetItem) => {
    const { tweetId, fullText } = tweetItem.dataValues;

    const countsForFrequency = await frequencyCounter(fullText, keyList);
    await db.frequency.update(
      {
        ...countsForFrequency,
      },
      { where: { tweetId } }
    );
  });

  // 0 ,  20  1
  // 20 , 20  2
  // 40 , 20  3
  return {
    nextLimit: limit,
    nextOffset: offset + limit,
    nextDataCount: tweets.length,
  };
};

const updateFrequencyAllData = async ({ limit, offset, keyList }) => {
  const res = await updateFrequencyData({ limit, offset, keyList });
  const { nextLimit, nextOffset, nextDataCount } = res;
  if (nextDataCount < nextLimit) {
    return {
      limit,
      offset,
      nextDataCount,
    };
  } else {
    await updateFrequencyAllData({
      limit: nextLimit,
      offset: nextOffset,
      keyList,
    });
  }
};

// FileStream Event Strem and some helper methods for tf Idf calculate_______________________________________

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
  const splitRegex = /(\W+|[_]+)/g; // split tweet full text with special karakters and _ then returnt splited text array

  return fullText.split(splitRegex);
};

const getTweetsData = async ({ limit, offset }) => {
  // 100 tane getir alanı
  const tweets = await db.tweet.findAll({
    include: db.user,
    limit,
    offset,
    where: {
      workedFrequency: {
        [Op.is]: null,
      },
    },
    order: [["createTime", "DESC"]],
  });
  const keyIndexTotalItem = await db.keyIndexTotals.findOne({
    order: [["colIndex",'DESC']]
  });
  // dataValues
  const localKeyIndexTotal = {};
  const localFrequencies = [];
  let lastColIndex = keyIndexTotalItem ? keyIndexTotalItem.colIndex + 1 : 0;
  if (tweets.length === 0) {
    return {
      finishCase: true,
      limit: 0,
      offset: 0,
      frequencyList: null,
      keyIndexTotalObject: null,
    };
  }
  await tweets.forEach(async (tweetItem) => {
    const { tweetId, user, favoriteCount, retweetCount, fullText } =
      tweetItem.dataValues;
    const tweetDate = tweetItem.dataValues.createTime;
    const {
      userId,
      verified,
      gender,
      followersCount,
      friendsCount,
      statusCount,
    } = user;
    const userFavoritesCount = user.favoriteCount;

    const tempFullTextArray = splitFullText(fullText);
    const fullTextArray = clearFullText(tempFullTextArray);
    const tempTermCountList = [];
    let rowTotalCount = 0;
    await fullTextArray.forEach((item, index) => {
      if (!hasNumeric(item)) {
        const itemToLower = item.toLowerCase();
        if (localKeyIndexTotal[itemToLower]) {
          localKeyIndexTotal[itemToLower].totalCount += 1;
        } else {
          // sayısal deger kontrolü eklenebilir !
          localKeyIndexTotal[itemToLower] = {
            colIndex: lastColIndex,
            totalCount: 1,
          };
          lastColIndex += 1;
        }
        const currentItemColIndex = localKeyIndexTotal[itemToLower].colIndex;
        if (tempTermCountList[currentItemColIndex]) {
          tempTermCountList[currentItemColIndex] += 1;
        } else {
          tempTermCountList[currentItemColIndex] = 1;
        }
        rowTotalCount += 1;
      }
    });

    localFrequencies.push({
      fullText,
      cleanText: fullTextArray.join(","),
      tweetId,
      userId,
      termFreq: calculateTermFrequency(rowTotalCount, tempTermCountList).join(
        ","
      ),
      inversDocFreq: null,
      isTraining: false,
      result: null,
    });
  });

  // 0 ,  20  1
  // 20 , 20  2
  // 40 , 20  3
  // burada iceride eger data yoksa return et denecek
  return {
    nextLimit: limit,
    nextOffset: limit + offset,
    finishCase: false,
    frequencyList: localFrequencies,
    keyIndexTotalObject: localKeyIndexTotal,
  };
};

const calculateTermFrequency = (totalRowCount, termCountList) => {
  let tempFreq = termCountList.map((item) => item / totalRowCount);
  // for(let i = 0; i < termCountList; i++) {
  //   if (termCountList[i]) {
  //     termFreq[i] = termCountList[i] / totalRowCount;
  //   } else {
  //     termFreq[i] = 0;
  //   }
  // }
  return tempFreq;
};

const generateTermFrequencyTest = async ({ limit, offset }) => {
  // bütün data üzerinde calısacak data bitene kadar
  const {
    nextLimit,
    nextOffset,
    finishCase,
    frequencyList,
    keyIndexTotalObject,
  } = await getTweetsData({ limit, offset });
  await db.frequencies.bulkCreate(frequencyList || []).catch(err => {
    console.warn(err);
  });
  const promises = [];

  Object.entries(keyIndexTotalObject).forEach(async ([key, values]) => {
     promises.push(keyIndexTotalCreateOrUpdate(key, values));
  })
  await Promise.all(promises).then((res) => { 
    console.warn(res);
  }).catch(err => {
    console.warn(err);
  });
  if (!finishCase) {
    return await generateTermFrequencyTest({
      limit: nextLimit,
      offset: nextOffset,
    });
  }
};

const keyIndexTotalCreateOrUpdate = async (key, values) => {
  const { totalCount, colIndex } = values;
  const keyIndexTotalItem = await db.keyIndexTotals.findOne({
    raw: true,
    where: { key },
  });
  if (keyIndexTotalItem) {
    const newTotalCount = keyIndexTotalItem.totalCount + totalCount;
    await db.keyIndexTotals.update({ totalCount: newTotalCount}, { where: { key } });
  } else {
    await db.keyIndexTotals.create({
      colIndex,
      totalCount,
      key,
    });
  }
};

const hasNumeric = (item) => {
  const numericRegex = /\d/;
  return numericRegex.test(item);
};

// '18'
// '1st' gibi degerler olabilliyor direkkelimlerei almak gerek sanırsam saydırsak ne olur arkadas saysın simdilik bi sonucuna bakalım olmaz mı
// _______________________________________



module.exports = {
  generateFrequencyData,
  generateTermFrequencyTest, // !!!
  generateFrequencyAllData,
  composeTrainingData,
  updateFrequencyData,
  updateFrequencyAllData,
  composeResultData,
};

// "0": {
//   "id": 1119025,
//   "tweetId": "1393537295496646660",
//   "userName": "Ogochi___",
//   "userId": "2195745225",
//   "fullText": "@Magg342 I'd like to believe you're intentionally being delusional because what is this sob story? 😂 Okpo! Talk abo… https://t.co/6SS0ZRkMQ2",
//   "createTime": "2021-05-15T12:02:36.000Z",
//   "displayTextRange": "0,141",
//   "retweetCount": 0,
//   "favoriteCount": 0,
//   "mentionCount": null,
//   "replyCount": 0,
//   "lang": "en",
//   "pullDate": "2021-05-15T12:02:50.000Z",
//   "gender": "",
//   "workedFrequency": null,
//   "user": {
//       "id": 1032808,
//       "userId": "2195745225",
//       "name": "Afu Nwa Elota Nna",
//       "screenName": "Ogochi___",
//       "location": "Nigeria",
//       "description": "Lasciate Ogne Speranza Voi Ch'entrate\n♍♍//Arsenal Football Club// Positive Vibes Only",
//       "protected": false,
//       "followersCount": 1608,
//       "friendsCount": 1596,
//       "favoritesCount": null,
//       "verified": false,
//       "statusCount": null,
//       "pullDate": "2021-05-15T12:02:50.000Z"
//   }
// },


// simdi temel olarak yapıalcak ismizi adımlayalım 
