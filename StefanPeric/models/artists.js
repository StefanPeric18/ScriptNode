'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Artworks }) {
      this.hasMany(Artworks, { foreignKey: 'artistsId', as: 'artwork', onDelete: 'cascade', hooks: true });
    }
  };
  Artists.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Artists',
  });
  return Artists;
};