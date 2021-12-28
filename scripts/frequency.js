const { update } = require("immutable");
const { Op } = require("sequelize");
const { CLASSIFICATION_KEYWORDS_LOOKUP, STOP_WORDS_OBJECT } = require('../configs/constants');
const db = require('../models');
const { trainingAll } = require('../training/training-all');
const { csvToArray } = require("../utils/helpers");
// const cvsResult = require("../results/results.cvs");

const generateFrequencyData = async ({ limit, offset }) => {
  const tweetIdList = [];

  const tweets = await db.tweet.findAll({ 
    include: db.user,
    limit, 
    offset, 
    where: { 
      workedFrequency: {
        [Op.is]: null
      }
    },
    order: [['createTime', 'DESC']], 
  });
  // dataValues
  await tweets.forEach( async (tweetItem) => {
    const { tweetId, user, favoriteCount, retweetCount, fullText } = tweetItem.dataValues;
    const tweetDate = tweetItem.dataValues.createTime;
    const { userId, verified, gender, followersCount, friendsCount, statusCount,  } = user;
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
  
}

const generateFrequencyAllData = async ({ limit, offset }) => {
  const res = await generateFrequencyData({ limit, offset}); 
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
}

// keyList [1,2,3,4,5,6,] etc
// just want to update keyword ids  
const frequencyCounter = (fullText, keyList) => {
  const tempCountsForFrequency = {};

  // const fullTextWordList = fullText.split(' '); 
  const splitRegex = /[.,\/ -_#]/; // 
  const fullTextWordList = fullText.split(' ');
  let filteredLookupList = CLASSIFICATION_KEYWORDS_LOOKUP;

  if (keyList && keyList.length > 0) {
    filteredLookupList = CLASSIFICATION_KEYWORDS_LOOKUP.filter(item => keyList.indexOf(item.id) !== -1);
  }
  
  filteredLookupList.forEach(({ value }) => {
    tempCountsForFrequency[value + 'Count'] = 0;

    fullTextWordList.forEach(fullTextWord => {
      if(fullTextWord && fullTextWord.toLowerCase().indexOf(value) !== -1) {
        tempCountsForFrequency[value + 'Count'] += 1;
      }
    })
  });

  return tempCountsForFrequency;
}

const composeTrainingData = async () => {
  // json datayı okuyup frequency icinde tweet idnin eslestigi satırda isTraining satırını update edecek 
  const updatedTweetIdList = [];
  await trainingAll.forEach(async (item) => {
    await db.frequency.update({ isTraining: 1, isViolence: item.isViolence }, { where: { tweetId: item.tweetId }}).then(result => console.log(result + '-----------------'));
    updatedTweetIdList.push(item.tweetId);
  });

  return {tweetIds: updatedTweetIdList, result: 'succes' };
}

const composeResultData = async () => {
  // json datayı okuyup frequency icinde tweet idnin eslestigi satırda isTraining satırını update edecek 
  // const updatedTweetIdList = [];
  // const resultArray = csvToArray(cvsResult) // txt olarak okumak gerek sanrısam ama du bakalım 

  // await resultArray.forEach(async (item) => {
  //   await db.frequency.update({ isViolence: item.isViolence }, { where: { id: item.id }}).then(result => console.log(result + '-----------------'));
  //   updatedTweetIdList.push(item.tweetId);
  // });

  // return {tweetIds: updatedTweetIdList, result: 'succes' };
}

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
    order: [['createTime', 'DESC']], 
  });
  // dataValues
  await tweets.forEach(async (tweetItem) => {
    const { tweetId, fullText } = tweetItem.dataValues;

    const countsForFrequency = await frequencyCounter(fullText, keyList);
    await db.frequency.update({
      ...countsForFrequency
    }, { where: { tweetId } });
  });

  // 0 ,  20  1
  // 20 , 20  2
  // 40 , 20  3
  return { 
    nextLimit: limit,
    nextOffset: offset + limit,
    nextDataCount: tweets.length,
  };
  
}

const updateFrequencyAllData = async ({ limit, offset, keyList }) => {
  const res = await updateFrequencyData({ limit, offset, keyList}); 
  const { nextLimit, nextOffset, nextDataCount } = res;
  if (nextDataCount < nextLimit) {
    return {
      limit,
      offset,
      nextDataCount,
    };
  } else {
    await updateFrequencyAllData({ limit: nextLimit, offset: nextOffset, keyList });
  }
  
}


// _______________________________________

const clearFullText = (fullTextArray) => {
  const filteredList = fullTextArray.filter(item => {
    const clearRegex = /(\W)/g;
    const tempItem = item.trim().replace(clearRegex, '').toLowerCase();
    if(tempItem && tempItem.length > 1 && !STOP_WORDS_OBJECT[tempItem]) {
      return true;
    }
    return false;
  })
  return filteredList;
}

const splitFullText = (fullText) => {
  const splitRegex = /(\W+|[_]+)/g; // split tweet full text with special karakters and _ then returnt splited text array 
  
  return fullText.split(splitRegex);
}
// _______________________________________


module.exports = {
  generateFrequencyData,
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
