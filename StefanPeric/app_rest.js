const express = require('express');
const {sequelize} = require('./models');
const cors = require('cors');

const crud_users = require('./routes/crud_users');
const crud_artists = require('./routes/crud_artists');
const crud_galleries = require('./routes/crud_galleries');
const crud_artworks = require('./routes/crud_artworks');

const app = express();
var corsOptions = {
    origin: 'http://127.0.0.1:8000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use('/api', crud_users);
app.use('/api', crud_artists);
app.use('/api', crud_galleries);
app.use('/api', crud_artworks);



app.listen({port: 9000}, async () =>{
    await sequelize.authenticate();
});