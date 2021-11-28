// user model

module.exports = (sequelize, Sequelize) => {
  const Log = sequelize.define("log", {
    id: {
      // field: 'id', 
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    cursor: {
      // field: 'cursor', 
      type: Sequelize.STRING(500),
      allowNull: false,
      unique: true,
    },
    count: {
      // field: 'count', 
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    mode: {
      // field: 'mode', 
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    query: {
      // field: 'query', 
      type: Sequelize.STRING(500),
      allowNull: false,
    },
  }, {
    tableName: 'logs',
    timestamps: true,
  });

  return Log;
};