const express = require('express');
const { sequelize, Users, Galleries, Artworks, Artists } = require('../models');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

//USERS
route.get('/users', (req, res) => {
    Users.findAll()
        .then(allUsers => res.json(allUsers))
        .catch(err => res.status(500).json(err));
});

route.post('/users', (req, res) => {
    Users.create({name: req.body.name, email: req.body.email, password: req.body.password, admin: req.body.admin})
        .then(usr => res.json(usr))
        .catch(err => res.status(500).json(err));
});

route.put('/users/:id', (req, res) => {
    Users.findOne({where: { id: req.params.id }})
        .then(usr => {
            usr.name = req.body.name;
            usr.email = req.body.email;
            usr.password = req.body.password;
            usr.admin = req.body.admin;

            usr.save()
                .then(u => res.json(u))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
});

route.delete('/users/:id', (req, res) => {
    Users.findOne({where: { id: req.params.id }})
        .then(usr => {
            usr.destroy()
                .then(u => res.json(u))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
});

//GALLERIES
route.get('/galleries', (req, res) => {
    Galleries.findAll()
        .then(allGalleries => res.json(allGalleries))
        .catch(err => res.status(500).json(err));
});


route.post('/galleries', (req, res) => {
    Galleries.create({name: req.body.name, address: req.body.address, number: req.body.number})
        .then(glry => res.json(glry))
        .catch(err => res.status(500).json(err));
});

route.put('/galleries/:id', (req, res) => {
    Galleries.findOne({where: { id: req.params.id }})
        .then(glry => {
            glry.name = req.body.name;
            glry.address = req.body.address;
            glry.number = req.body.number;
            
            glry.save()
                .then(g => res.json(g))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
});

route.delete('/galleries/:id', (req, res) => {
    Galleries.findOne({where: { id: req.params.id }})
        .then(glry => {
            glry.destroy()
                .then(g => res.json(g))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
});

//ARTISTS
route.get('/artists', (req, res) => {
    Artists.findAll()
        .then(allArtists => res.json(allArtists))
        .catch(err => res.status(500).json(err));
});


route.post('/artists', (req, res) => {
    Artists.create({name: req.body.name, nationality: req.body.nationality})
        .then(arts => res.json(arts))
        .catch(err => res.status(500).json(err));
});

route.put('/artists/:id', (req, res) => {
    Artists.findOne({where: { id: req.params.id }})
        .then(arts => {
            arts.name = req.body.name;
            arts.nationality = req.body.nationality;
            
            arts.save()
                .then(a => res.json(a))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
});

route.delete('/artists/:id', (req, res) => {
    Artists.findOne({where: { id: req.params.id }})
        .then(arts => {
            arts.destroy()
                .then(a => res.json(a))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
});

//ARTWORKS
route.get('/artworks', (req, res) => {
    Artworks.findAll()
        .then(allArtworks => res.json(allArtworks))
        .catch(err => res.status(500).json(err));
});


route.post('/artworks', (req, res) => {
    Artworks.create({name: req.body.name, galleryId: req.body.galleryId, artistsId: req.body.artistsId})
        .then(artw => res.json(artw))
        .catch(err => res.status(500).json(err));
});

route.put('/artworks/:id', (req, res) => {
    Artworks.findOne({where: { id: req.params.id }})
        .then(artw => {
            artw.name = req.body.name;
            artw.artistsId = req.body.artistsId;
            
            artw.save()
                .then(a => res.json(a))
                .catch(err => res.status(500).json({msg: 'err'}));
        })
        .catch(err => res.status(500).json({msg: req.params.id}));
});

route.delete('/artworks/:id', (req, res) => {
    Artworks.findOne({where: { id: req.params.id }})
        .then(artw => {
            artw.destroy()
                .then(a => res.json(a))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
});

module.exports = route;