const express = require('express');
const { sequelize, Artworks } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();
const Joi = require('joi');

const artworksSchema = Joi.object().keys({
    name: Joi.string().trim().required(),
    galleryId: Joi.number().required(),
    artistsId: Joi.number().required()
});

route.use(express.json());
route.use(express.urlencoded({extended: true}));

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({
        status: 'error',
        message: 'No jwt'
    });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({
            status: 'error',
            message: 'Bad jwt'
        });
    
        req.user = user;
    
        next();
    });
}

route.get('/artworks', authToken, (req, res) => {
    Artworks.findAll()
        .then(allArtworks => res.json(allArtworks))
        .catch(err => res.status(500).json(err));
});


route.post('/artworks', authToken, (req, res) => {
    artworksSchema.validateAsync(req.body)
        .then(succ => {
            Artworks.create({name: req.body.name, galleryId: req.body.galleryId, artistsId: req.body.artistsId})
                .then(artw => res.json(artw))
                .catch(err => res.status(400).json({
                    status: 'error',
                    message: `${err.errors[0].message}`,
                }));
        })
        .catch(err => res.status(400).json({
            status: 'error',
            message: `${err.details[0].message}`
        }));

});

route.put('/artworks/:id', authToken, (req, res) => {
    artworksSchema.validateAsync(req.body)
        .then(succ => {
            Artworks.findOne({where: { id: req.params.id }})
                .then(artw => {
                    if(artw == null)
                        return res.status(400).json({
                            status: 'error',
                            message: 'Bad id',
                        });
                    artw.name = req.body.name;
                    artw.galleryId = req.body.galleryId;
                    artw.artistsId = req.body.artistsId;
    
                    artw.save()
                        .then(a => res.json(a))
                        .catch(err => res.status(500).json({
                            status: 'error',
                            message: `${err.errors[0].message}`,
                        }));
                })
                .catch(err => res.status(400).json({
                    status: 'error',
                    message: `${err.errors[0].message}`,
                }));
        })
        .catch(err => res.status(400).json({
            status: 'error',
            message: `${err.details[0].message}`
        }));
});

route.delete('/artworks/:id', authToken, (req, res) => {
    Artworks.findOne({where: { id: req.params.id }})
        .then(artw => {
            artw.destroy()
                .then(a => res.json(a))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json({msg: 'BadId'}));
});

module.exports = route;