// user model

module.exports = (sequelize, Sequelize) => {
  const FreqWords = sequelize.define(
    "freqWords",
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
      totalCount: {
        // field: 'totalCount',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "freqWords",
      timestamps: true,
    }
  );

  return FreqWords;
};

// bütün kelimeleri kucuk harf olarak kaydetmemiz gerek
// id key totalCount
