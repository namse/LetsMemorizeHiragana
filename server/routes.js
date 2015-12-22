var config = require('getconfig');
module.exports = function(app) {
    var hiraganaArray = [
        ["あ", "い", "う", "え", "お"],
        ["か", "き", "く", "け", "こ"],
        ["さ", "し", "す", "せ", "そ"],
        ["た", "ち", "つ", "て", "と"],
        ["な", "に", "ぬ", "ね", "の"],
        ["は", "ひ", "ふ", "へ", "ほ"],
        ["ま", "み", "む", "め", "も"],
        ["や", "ゆ", "よ"],
        ["ら", "り", "る", "れ", "ろ"],
        ["わ", "を"],
        ["ん"]
    ];
    app.get('/', function(req, res) {
        console.log(req.sessionID);
        res.render('ejs/index.ejs');
    });

    app.get('/ready', function(req, res) {
        res.render('ejs/ready.ejs', {
            hiraganaArray: hiraganaArray
        });
    });
    
    app.get('/start', function(req, res){
        
    });
}