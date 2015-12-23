var express = require('express'),
    app = express(),
    http = require('http'),
    config = require('getconfig'),
    sharedSession = require("express-socket.io-session"),
    session = require("express-session")({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true
    }),
    server = http.createServer(app),
    io = require('socket.io')(server),
    path = require('path'),
    port = process.env.PORT || config.port,
    bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(session);
io.use(sharedSession(session, {
    autoSave: true
}));

server.listen(port);


// http handling    
require('./routes.js')(app);

// socket.io handling
require('./io.js')(io);