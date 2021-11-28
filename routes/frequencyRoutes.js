const { generateFrequencyData, generateFrequencyAllData, updateFrequencyData, updateFrequencyAllData, composeTrainingData, composeResultData } = require('../scripts/frequency');
// const db = require('../models');


const calculate_frequency_with_paging = async (req,res) => {

  const { page = 1, pageSize = 20 } = req.body;
  const offset = (page === 0 || page === 1 ) ? 0 :  ((page - 1) * pageSize);

  const result = await generateFrequencyData({ limit: pageSize, offset });
  res.json({
    ...result,
  });

}
const calculate_frequency_all = async (req,res) => {

  const { page = 1, pageSize = 20 } = req.body;
  const offset = (page === 0 || page === 1 ) ? 0 :  ((page - 1) * pageSize);

  const result = await generateFrequencyAllData({ limit: pageSize, offset });
  res.json({
    ...result,
  });

}
const update_frequency_with_paging = async (req,res) => {

  const { page = 1, pageSize = 20, keyList } = req.body;
  const offset = (page === 0 || page === 1 ) ? 0 :  ((page - 1) * pageSize);

  const result = await updateFrequencyData({ limit: pageSize, offset, keyList });
  res.json({
    ...result,
  });

}
const update_frequency_all = async (req,res) => {

  const { page = 1, pageSize = 20, keyList } = req.body;
  const offset = (page === 0 || page === 1 ) ? 0 :  ((page - 1) * pageSize);

  const result = await updateFrequencyAllData({ limit: pageSize, offset, keyList });
  res.json({
    ...result,
  });

}

const compose_training_data = async (req, res) => {
  const tweetIdList = await composeTrainingData();
  res.json({
    tweetIdList,
    msg: 'Training data composed with frequencyModel data',
    composeCase: true,
  });
}

const compose_result_data = async (req, res) => {
  const tweetIdList = await composeResultData();
  res.json({
    tweetIdList,
    msg: 'Training data composed with frequencyModel data',
    composeCase: true,
  });
}

module.exports = {
  calculate_frequency_with_paging,
  calculate_frequency_all,
  update_frequency_with_paging,
  update_frequency_all,
  compose_training_data,
  compose_result_data,
};

