var config = require('getconfig'),
    path = require('path'),
    zinnia = require('../zinnia.js/build/Debug/zinnia.js.node'),
    protobuf = require('protobufjs'),
    protoBuilder = protobuf.loadProtoFile('../protoDefines/packet.proto'),
    protoPacket = protoBuilder.build("Packet"),
    protoStroke = protoPacket.Stroke,
    protoPosition = protoStroke.Position;

module.exports = function(app) {

    app.get('/', function(req, res) {
        console.log(req.sessionID);
        res.render('ejs/index.ejs');
    });

    app.post('/recognize', function(req, res) {
        console.log(req.body);
        console.log(JSON.stringify(req.body));
        console.log(req.body.data);
        
        var packet = protoPacket.decode64(req.body.data);
        console.log(packet);
        
        var strokes = [];
        for(var stroke in packet.strokes){
            var positions = [];
            for(var position in stroke){
                positions.push([position.x, position.y]);
            }
            strokes.push(positions);
        }
        
        
        console.log(zinnia.recognize(packet.width, packet.height, strokes, function(isSuccess, result) {
            console.log(isSuccess, result);
        }));
    })
    
}