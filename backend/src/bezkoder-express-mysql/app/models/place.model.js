module.exports = (sequelize, Sequelize) => {
  const Place = sequelize.define("place", {
    place_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    place_key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    map_label: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    }
  }, {
    timestamps: false // Keeps Sequelize from looking for createdAt/updatedAt
  });

  return Place;
};
