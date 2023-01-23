
const config = require("./config.js")
const cors = require('cors');
//const connectBase = require( "./database.js");
const bodyParser = require('body-parser');
const Comment = require( "./database.js");

const express = require('express'),
        app = express();
        app.use(cors());
        app.options('*', cors());
        app.use(express.json());

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use('/api', require('./comments.controller'));
        app.use('/uploads',express.static('uploads'));
//connectBase;
//Comment.create({userName:'sTepan', email:'fddss@dsss.ds', content: 'Ha jaja ha'  })
app.listen(config.app.port, config.app.host, () => console.log(`Server listens http://${config.app.host}:${config.app.port}`));
