const db = require("../models");
const { Op } = require("sequelize");



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

const calculateWordCountersTest = async ({ limit, offset }) => {
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


module.exports = {
	calculateWordCountersTest,
}