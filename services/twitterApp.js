// twitterApi

const { ADAPTIVE_JSON, ACTIVATE_JSON, OAUTH2_TOKEN } = require('./paths');

const { BAERER_TOKEN_3, ORIGIN, USER_AGENT, QUERY_STRING_CONSTANTS, TOKEN_QUERY_STRINGS_CONSTANTS, BASIC_AUTH } = require('../configs/constants');

const { get, post } = require('../utils/request');  
const { insertTweets, insertUsersBatch, newInsertTweetsBatch } = require('../dbOperations'); // güncellenecek 
const { createQueryString, isEmptyObject } = require('../utils/helpers');
const db = require('../models');
const resultArray = []; 

let guestTokenGlobal = null;
let bearerTokenGlobal = null;


// iterable twitter request recursive with cursor value  
const getFullTwitterData = async ({ searchQuery, searchMode, pageCursor, rowCount}) => {
  const localResult = await getTwitterData({ searchQuery, searchMode, pageCursor, rowCount});
  localResult.tweetCounts = (!isEmptyObject(localResult.tweets)) ? Object.keys(localResult.tweets).length : 0;
  resultArray.push({ cursor: localResult.newCursor, count: localResult.tweetCounts });
  
  if (localResult.newCursor !== -1 && localResult.newCursor !== null && !isEmptyObject(localResult.tweets)) {
    await getFullTwitterData({ searchQuery, searchMode, rowCount, pageCursor: localResult.newCursor });
  }

  if(isEmptyObject(localResult.tweets)) {
    console.log('------------------------------------------ \n');
    console.log('tweets alanı bos hepsi cekild :D ')
  }

  return resultArray;
}

// single request
const getTwitterData = async ({ searchQuery, searchMode, pageCursor, rowCount}) => {
  let resultData = {};
  const url = createQueryString({
    url: ADAPTIVE_JSON, 
    params: {
      q: searchQuery, //
      tweet_search_mode: searchMode, //
      count: rowCount, // 
      cursor: pageCursor, // sayfalama icin degistirilerek devam etmesi gerek 

      ...QUERY_STRING_CONSTANTS
    }
  });
  // await getBearerToken(bearerTokenGlobal);
  await getTwitterGuestToken(guestTokenGlobal);
  // console.log('url', url);
  var config = {
    headers: { 
      'User-Agent': USER_AGENT, 
      'Origin': ORIGIN,
      'Referer': ADAPTIVE_JSON, 
      'x-guest-token': guestTokenGlobal, 
      'Authorization': `${BAERER_TOKEN_3}`, 
    }
  };  
  
  await get(url, { ...config })
  .then(async (response) => {
    // console.log('->');
    // const opResults = await insertTweets(response.data.globalObjects.tweets);
    
    const tweetOpResult = await newInsertTweetsBatch(response.data.globalObjects.tweets, response.data.globalObjects.users);
    const userOpResult = await insertUsersBatch(response.data.globalObjects.users);
    // return degeleri kontrol edilecek 
    resultData = {
      tweets: response.data.globalObjects.tweets,
      newCursor: findNewCursor(response.data.timeline),
      tweetOpResult,
      userOpResult,
    };
  })
  .catch(async (error) => {
    console.log(error);
    // status code 429 geldiginde bearer ve guest tokenları yenilemek gerek ! 
    if (error.response.status === 429 || error.response.status === '429') {
      // await getBearerToken();
      await getTwitterGuestToken();
      // tokenları yeniledikten sonra hata alınan requesti tekrar cagırmak gerek ! gibi kontrol edip denenilecek hadi bakalım hayırlısı 
      await getTwitterData({ searchMode, searchQuery, pageCursor, rowCount });
    }
  });

  return resultData;
}

// just for gust token
const getTwitterGuestToken = async (currentGuestToken) => {
  let newGuestToken = currentGuestToken;
  if (!currentGuestToken) {
    await post(ACTIVATE_JSON, {} ,{
      headers: {
        'Authorization': `${BAERER_TOKEN_3}`, 
      }
    }).then(res => {
      newGuestToken = res.data.guest_token;
    }).catch(function (error) {
      console.log(error);
    });
  }
  // return newGuestToken;
  guestTokenGlobal = newGuestToken;
}

// find new cursor for paging on twit data 
const findNewCursor = (timeline) => {
  let newCursor = null; // burda yeni cursor degerini tekrar sıfır dondugumuzde yada -1 falan donunce akısı kesmesi gerek 
  // const imTimeline = fromJs(timeline);
  timeline.instructions.forEach(instruction => {
    let entries = [];
    if (instruction.addEntries) {
      entries = instruction.addEntries.entries;
    } else if (instruction.replaceEntry) {
      entries = instruction.replaceEntry.entry; // burda tek obje geliyor olabilir kontrol edilmesi gerek !! 
    }

    if (entries.length > 0 ) { // tek yada liste seklindeyse kontrolü 
      entries.forEach(entry => {
        if (entry.entryId.indexOf('bottom') !== -1) { // 'sq-cursor-bottom' yada cursor-bottom ile baslayan olabilr denilmis 
          newCursor = entry.content.operation.cursor.value; // bir tane deger olmaz sa patladık arkadas 
          if (entry.content.operation.cursor.stopOnEmptyResponse) {
            newCursor = -1;
            // baska deger olmadıgında boyle bi param geliyor anladıgım kadaryla devamında akısı kesmemiz gerekiyor 
          }
        }
      })
    } else if (entries.content) {
      if (entries.entryId.indexOf('bottom') !== -1) { // 'sq-cursor-bottom' yada cursor-bottom ile baslayan olabilr denilmis 
          newCursor = entries.content.operation.cursor.value; // bir tane deger olmaz sa patladık arkadas 
          if (entries.content.operation.cursor.stopOnEmptyResponse) {
            newCursor = -1;
            // baska deger olmadıgında boyle bi param geliyor anladıgım kadaryla devamında akısı kesmemiz gerekiyor 
          }
        }
    }
  })
  return newCursor;
}

const getBearerToken = async (currentBearerToken) => {
  let newBearerToken = currentBearerToken;

  if (!currentBearerToken) {
    const url = createQueryString({
      url: OAUTH2_TOKEN,
      params: {
        ...TOKEN_QUERY_STRINGS_CONSTANTS
      }
    })
    await post(url, {}, {
      auth: BASIC_AUTH,
    })
    .then((res) => {
      newBearerToken = res.data.access_token;
    }).catch(function (error) {
      console.log(error);
    });
  }

  bearerTokenGlobal = newBearerToken;
}

module.exports = {
  getTwitterData, 
  getFullTwitterData,
  getTwitterGuestToken,
};

