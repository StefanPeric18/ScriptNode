const express = require('express');
const { sequelize, Users} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();

const Joi = require('joi');

const usersSchema = Joi.object().keys({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    admin: Joi.boolean()
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

        if(user.admin === false)
            return res.status(403).json({
                status: 'error',
                message: 'You are not admin'
            });
    
        req.user = user;
    
        next();
    });
}

//USERS
route.get('/users', authToken, (req, res) => {
    Users.findAll()
        .then(allUsers => res.json(allUsers))
        .catch(err => res.status(500).json(err));
});

route.post('/users', authToken, (req, res) => {
    usersSchema.validateAsync(req.body)
        .then(succ => {
            Users.create({name: req.body.name, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10), admin: req.body.admin})
                .then(usr => res.json(usr))
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

route.put('/users/:id', authToken , (req, res) => {
    usersSchema.validateAsync(req.body)
        .then(succ => {
            Users.findOne({where: { id: req.params.id }})
                .then(usr => {
                    if(usr === null)
                        return res.status(400).json({
                            status: 'error',
                            message: 'Bad id',
                        });
                    usr.name = req.body.name;
                    usr.email = req.body.email;
                    usr.password = bcrypt.hashSync(req.body.password, 10);
                    usr.admin = req.body.admin;

                    usr.save()
                        .then(u => res.json(u))
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

route.delete('/users/:id', authToken, (req, res) => {
    Users.findOne({where: { id: req.params.id }})
        .then(usr => {
            usr.destroy()
                .then(u => res.json(u))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json({
            status: 'error',
            message: 'BadId'
        }));
});

module.exports = route;