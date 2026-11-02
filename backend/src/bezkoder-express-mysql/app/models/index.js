const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import all 3NF models
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.floors = require("./floor.model.js")(sequelize, Sequelize);
db.places = require("./place.model.js")(sequelize, Sequelize);
db.directions = require("./direction.model.js")(sequelize, Sequelize);

// Define 3NF Associations / Foreign Key Relations
db.categories.hasMany(db.places, { foreignKey: 'category_id' });
db.places.belongsTo(db.categories, { foreignKey: 'category_id' });

db.floors.hasMany(db.places, { foreignKey: 'floor_id' });
db.places.belongsTo(db.floors, { foreignKey: 'floor_id' });

db.places.hasMany(db.directions, { foreignKey: 'place_id', onDelete: 'CASCADE' });
db.directions.belongsTo(db.places, { foreignKey: 'place_id' });

module.exports = db;
