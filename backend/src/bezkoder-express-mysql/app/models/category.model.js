const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define('Category', {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'categories',
    timestamps: false,
  })
}
