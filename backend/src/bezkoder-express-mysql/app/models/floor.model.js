const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('Floor', {
    floor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    floor_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'floors',
    timestamps: false,
  })
}
