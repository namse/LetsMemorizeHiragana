var config = require('getconfig');
module.exports = function(app) {

    app.get('/', function(req, res) {
        console.log(req.sessionID);
        res.render('ejs/index.ejs');
    });
}