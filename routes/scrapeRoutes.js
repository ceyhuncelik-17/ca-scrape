// 
const { getFullTwitterData, getTwitterData } = require('../services/twitterApp');
const { generateFrequencyData } = require('../scripts/frequency');
const db = require('../models');

const scrape_all_with_query = async (req, res) => {
  const { query = '', mode = 'live', count = 100 } = req.query
  const result = await getFullTwitterData({
    searchQuery: query,
    searchMode: mode,
    pageCursor: 0,
    rowCount: count,
  });
  res.json({
    ...result
  })
}
const scrape_just_one_for_test = async (req, res) => {
  const { query = '', mode = 'live', count = 3, cursor = 0 } = req.query
  const result = await getTwitterData({
    searchQuery: query,
    searchMode: mode,
    pageCursor: cursor,
    rowCount: count,
  });
  res.json({
    ...result
  })
}

const sync_database = (req,res) => {
  db.sequelize.sync({ alter: true }).then(() => {
    res.send({ msg: 'db sync successfull ', syncCase: true });
  })
  .catch((error) => {
    res.send({ msg: error, syncCase: false });
  });
}

const drop_database = (req,res) => {
  db.sequelize.sync({ drop: true }).then(() => {
    res.send({ msg: 'db drop create successfull ', dropCase: true });
  })
  .catch((error) => {
    res.send({ msg: error, dropCase: false });
  });
}

const generate_frequency = async (req,res) => {

  const { page = 1, pageSize = 20 } = req.query 
  const offset = (page === 0 || page === 1 ) ? 0 :  ((page - 1) * pageSize);

  const result = await generateFrequencyData({ limit: pageSize, offset });
  res.json({
    ...result,
  });

}

module.exports = {
  scrape_all_with_query,
  scrape_just_one_for_test,
  sync_database,
  drop_database,
  generate_frequency,
};