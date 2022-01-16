const express = require('express');
const { sequelize, Users } = require('./models');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

var corsOptions = {
    origin: 'http://127.0.0.1:8000',
    optionsSuccessStatus: 200
}

const Joi = require('joi');

const registerSchema = Joi.object().keys({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    admin: Joi.boolean()
});

app.use(express.json());
app.use(cors(corsOptions));

//!ovde nisam radio joi iz razloga sto su sve moguce greske ovde obradjene
app.post('/login', (req, res) => {
    Users.findOne({ where: { name: req.body.name } })
        .then( usr => {
            if (bcrypt.compareSync(req.body.password, usr.password)) {
                if(!(usr.name === req.body.name))
                    return  res.status(400).json({
                        status: 'error',
                        message: 'Invalid name'
                    });     
                const usrForToken = {
                    usrId: usr.id,
                    name: usr.name,
                    admin: usr.admin
                };
                const token = jwt.sign(usrForToken, process.env.ACCESS_TOKEN_SECRET);
                res.json({
                    status: 'succ',
                    token: token
                });
            } else {
                res.status(400).json({
                    status: 'error',
                    message: 'Invalid password'
                });
            }
        })
        .catch( err => res.status(500).json({
            status: 'error',
            message: 'Invalid credentials'
        }));
});

app.post('/register', (req, res) => {
    registerSchema.validateAsync(req.body)
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


app.listen({ port: 9090 }, async () => {
    await sequelize.authenticate();
});