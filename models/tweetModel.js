// user model

module.exports = (sequelize, Sequelize) => {
  const Tweet = sequelize.define("tweet", {
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
    userName: {
      // field: 'userName', 
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    userId: {
      // field: 'userId', 
      type: Sequelize.STRING(25),
      allowNull: false,
      // references: {         // User belongsTo Company 1:1
      //   model: 'users',
      //   key: 'userId'
      // }
    },
    fullText: {
      // field: 'fullText', 
      type: Sequelize.STRING(1000),
      allowNull: false,
    },
    createTime: {
      // field: 'createTime', 
      type: Sequelize.DATE,
      allowNull: false,
    },
    displayTextRange: {
      // field: 'displayTextRange', 
      type: Sequelize.STRING(11),
      allowNull: false,
    },
    retweetCount: {
      // field: 'retweetCount', 
      type: Sequelize.INTEGER.UNSIGNED.ZEROFILL,
      allowNull: false,
    },
    favoriteCount: {
      // field: 'favoriteCount', 
      type: Sequelize.INTEGER.UNSIGNED.ZEROFILL,
      allowNull: false,
    },
    mentionCount: {
      // field: 'mentionCount', 
      type: Sequelize.INTEGER.UNSIGNED.ZEROFILL,
      allowNull: true,
    },
    replyCount: {
      // field: 'replyCount', 
      type: Sequelize.INTEGER.UNSIGNED.ZEROFILL,
      allowNull: false,
    },
    lang: {
      // field: 'lang', 
      type: Sequelize.STRING(3),
      allowNull: true,
    },
    pullDate: {
      // field: 'pullDate', 
      type: Sequelize.DATE,
      defaultValues: Sequelize.NOW,
      allowNull: false,
    },
    gender: {
      // field: 'gender', 
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    workedFrequency: {
      // field: 'workedFrequency', 
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValues: false,
    }
  }, {
    tableName: 'tweets',
    timestamps: false,
  });

  return Tweet;
};