// user model

module.exports = (sequelize, Sequelize) => {
  const Frequencies = sequelize.define("frequencies", {
    id: {
      // field: 'id', 
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    tweetId: {
      // field: 'tweetId', 
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
    userId: {
      // field: 'userId', 
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    fullText: {
      // field: 'fullText', 
      type: Sequelize.STRING(1000),
      allowNull: false,
    },
    termFreq: {
      // field: 'fullText', 
      type: Sequelize.TEXT,
      allowNull: true,
    },
    inversDocFreq: {
      // field: 'fullText', 
      type: Sequelize.TEXT,
      allowNull: true,
    },
    isTraining: {
      // field: 'fullText', 
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    result: {
      // field: 'fullText', 
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
  }, {
    tableName: 'frequencies',
    timestamps: true,
  });

  return Frequencies;
};
