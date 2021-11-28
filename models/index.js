const Sequelize = require("sequelize");
const { DB_CONFIGS } = require("../configs/constants");

const sequelize = new Sequelize(
  DB_CONFIGS.database,
  DB_CONFIGS.user, 
  DB_CONFIGS.password, 
  {
    host: DB_CONFIGS.host,
    dialect: DB_CONFIGS.dialect,
    operatorsAliases: DB_CONFIGS.operatorAliases,
    dialectOptions: DB_CONFIGS.dialectOptions,
    pool: DB_CONFIGS.pool
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tweet = require("./tweetModel.js")(sequelize, Sequelize);
db.user = require("./userModel.js")(sequelize, Sequelize);
db.log = require("./logModel.js")(sequelize, Sequelize);
// db.log = require("./attrset_ignore.js")(sequelize, Sequelize);
db.frequency = require("./frequencyModel.js")(sequelize, Sequelize);


db.tweet.belongsTo(db.user, { foreignKey: 'userId', targetKey: 'userId' });
// db.user.hasMany(db.tweet, { foreignKey: 'userId', as: 'tweet' });

module.exports = db;
