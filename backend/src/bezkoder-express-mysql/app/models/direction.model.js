const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('Direction', {
    place_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Part 1 of composite PK
      references: {
        model: 'places',
        key: 'place_id',
      },
    },
    step_order: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Part 2 of composite PK
    },
    direction_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'directions',
    timestamps: false,
  })
}
