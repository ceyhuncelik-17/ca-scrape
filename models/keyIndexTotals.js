// user model

module.exports = (sequelize, Sequelize) => {
  const KeyIndexTotals = sequelize.define(
    "keyIndexTotals",
    {
      id: {
        // field: 'id',
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
        // field: 'key',
        type: Sequelize.STRING(500),
        unique: true,
        allowNull: false,
      },
      colIndex: {
        // field: 'colIndex',
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
      },
      totalCount: {
        // field: 'totalCount',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "keyIndexTotals",
      timestamps: true,
    }
  );

  return KeyIndexTotals;
};

// 