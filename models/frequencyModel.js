// frequency model

const { CLASSIFICATION_KEYWORDS_LOOKUP } = require('../configs/constants');

module.exports = (sequelize, Sequelize) => {
  const FrequencyModel = sequelize.define("frequencyModel", {
    id: {
      // field: 'id', 
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      // field: 'userId', 
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    tweetId: {
      // field: 'tweetId', 
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    followersCount: {
      // field: 'followersCount', 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValues: 0,
    },
    friendsCount: {
      // field: 'friendsCount', 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValues: 0,
    },
    tweetFavoritesCount: {
      // field: 'userFavoritesCount', 
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValues: 0,
    },
    retweetCount: {
      // field: 'retweetCount', 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValues: 0,
    },
    isRetweet: {
      // field: 'isRetweet', 
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    tweetDate: {
      // field: 'tweetDate',
      type: Sequelize.DATE,
      allowNull: false,
    },
    isViolence: {
      // field: 'isViolence',
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    isTraining: {
      // field: 'isTraining',
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    ...generateKeyWordCol(Sequelize),
  }, {
    tableName: 'frequencyModels',
    timestamps: true,
    defaultValues: 0,
  });
  
  return FrequencyModel;
};

const generateKeyWordCol = (Sequelize) => {
  const colObject = {};
  
  CLASSIFICATION_KEYWORDS_LOOKUP.forEach(item => {
    colObject[`${item.value}Count`] = {
      // field: `${item.value}Count`
      type: Sequelize.INTEGER,
      allowNull: false,
    };
  })
  return colObject;
}