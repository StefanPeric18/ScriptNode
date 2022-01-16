'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artworks extends Model {
    static associate({Galleries, Artists}) {
      this.belongsTo(Galleries, {foreignKey: 'galleryId', as: 'gallery'});
      this.belongsTo(Artists, {foreignKey: 'artistsId', as: 'artists'});
    }
  };
  Artworks.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Artworks',
  });
  return Artworks;
};