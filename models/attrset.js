// user model

module.exports = (sequelize, Sequelize) => {
  const Attrset = sequelize.define("attrset", {
    id: {
      // field: 'id', 
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    yearList: { // string olarak , ile ayırıp tutulacak tek bi
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    violenceMaxCount: {
      // field: 'gender', 
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    womenMaxCount: {
      // field: 'followersCount', 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValues: 0,
    },
    womanMaxCount: {
      // field: 'friendsCount', 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValues: 0,
    },
    abuseMaxCount: {
      // field: 'userFavoritesCount', 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValues: 0,
    },
    assaultMaxCount: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValues: 0,
    },
    rapeMaxCount: {
      // field: 'retweetCount', 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValues: 0,
    },
    harrasmentMaxCount: {
      // field: 'isRetweet', 
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'attrsets',
    timestamps: true,
  });

  return Attrset;
};

// tablonun tek bi satır degeri olacak 
