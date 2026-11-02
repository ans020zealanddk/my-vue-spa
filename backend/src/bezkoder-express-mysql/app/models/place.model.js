const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('Place', {
    place_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    place_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    map_label: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categories',
        key: 'category_id',
      },
    },
    floor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'floors',
        key: 'floor_id',
      },
    },
  }, {
    tableName: 'places',
    timestamps: false,
  })
}
