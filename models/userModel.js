// user model

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER, 
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    userId: {
      type: Sequelize.STRING(25),
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING(300),
      allowNull: false,
    },
    screenName: {
      type: Sequelize.STRING(300),
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING(1000),
      allowNull: true,
    },
    protected: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    followersCount: {
      type: Sequelize.INTEGER.UNSIGNED.ZEROFILL,
      allowNull: true,
    },
    friendsCount: {
      type: Sequelize.INTEGER.UNSIGNED.ZEROFILL,
      allowNull: true,
    },
    favoritesCount: {
      type: Sequelize.INTEGER.UNSIGNED.ZEROFILL,
      allowNull: true,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    statusCount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    pullDate: {
      type: Sequelize.DATE,
      defaultValues: Sequelize.NOW,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
};
