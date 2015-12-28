var express = require('express'),
    app = express(),
    http = require('http'),
    config = require('getconfig'),
    session = require("express-session")({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true
    }),
    compress = require('compression'),
    server = http.createServer(app),
    path = require('path'),
    port = process.env.PORT || config.port,
    bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'views')));
app.use('/proto', express.static(path.join(__dirname, '../protoDefines')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compress()); 
app.use(session);

server.listen(port);


// http handling    
require('./routes.js')(app);
