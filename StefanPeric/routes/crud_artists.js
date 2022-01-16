const express = require('express');
const { sequelize, Artists} = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();
const Joi = require('joi');

const shema = Joi.object().keys({
    name: Joi.string().trim().required(),
    nationality: Joi.string().trim().required()
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


//ARTISTS
route.get('/artists', authToken, (req, res) => {
    Artists.findAll()
        .then(allArtists => res.json(allArtists))
        .catch(err => res.status(500).json(err));
});


route.post('/artists', authToken, (req, res) => {
    shema.validateAsync(req.body)
        .then(succ => {    
            Artists.create({name: req.body.name, nationality: req.body.nationality})
                .then(arts => res.json(arts))
                .catch(err => res.status(500).json(err))
            })
        .catch(err => res.status(400).json({
            status: 'error',
            message: `${err.details[0].message}`,
        }));
});

route.put('/artists/:id', authToken, (req, res) => {

    shema.validateAsync(req.body)
        .then(succ => {
            Artists.findOne({where: { id: req.params.id }})
                .then(arts => {
                    if(arts === null)
                        return res.status(404).json({
                                                    status: 'error',
                                                    message: 'Bad id',
                                                });
                    arts.name = req.body.name;
                    arts.nationality = req.body.nationality;
            
                arts.save()
                    .then(a => res.json(a))
                    .catch(err => res.status(500).json(err));
                })
        })
        .catch(err => res.status(400).json({
            status: 'error',
            message: `${err.details[0].message}`,
        }));    
});

route.delete('/artists/:id', authToken , (req, res) => {
    Artists.findOne({where: { id: req.params.id }})
        .then(arts => {
            arts.destroy()
                .then(a => res.json(a))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json({msg: 'BadId'}));
});

module.exports = route;