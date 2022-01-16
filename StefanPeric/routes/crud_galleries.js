const express = require('express');
const { sequelize, Galleries} = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();

const Joi = require('joi');

const galleriesSchema = Joi.object().keys({
    name: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    number: Joi.number().required()
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

//GALLERIES
route.get('/galleries', authToken, (req, res) => {
    Galleries.findAll()
        .then(allGalleries => res.json(allGalleries))
        .catch(err => res.status(500).json(err));
});


route.post('/galleries', authToken, (req, res) => {
    galleriesSchema.validateAsync(req.body)
        .then(succ => {
            Galleries.create({name: req.body.name, address: req.body.address, number: req.body.number})
                .then(glry => res.json(glry))
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

route.put('/galleries/:id', (req, res) => {
    galleriesSchema.validateAsync(req.body)
        .then(succ => {
            Galleries.findOne({where: { id: req.params.id }})
                .then(glry => {
                    if(glry === null)
                        return res.status(400).json({
                            status: 'error',
                            message: 'Bad id',
                        });
                    glry.name = req.body.name;
                    glry.address = req.body.address;
                    glry.number = req.body.number;
                    
                    glry.save()
                        .then(g => res.json(g))
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

route.delete('/galleries/:id', (req, res) => {
    Galleries.findOne({where: { id: req.params.id }})
        .then(glry => {
            glry.destroy()
                .then(g => res.json(g))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json({msg: 'BadId'}));
});

module.exports = route;