'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Galleries extends Model {
    static associate({ Artworks }) {
      this.hasMany(Artworks, { foreignKey: 'galleryId', as: 'artwork', onDelete: 'cascade', hooks: true });
    }
  };
  Galleries.init({
    name:{ 
      type: DataTypes.STRING,
      allowNull:false,
      unique: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Galleries',
  });
  return Galleries;
};