var config = require('getconfig');
module.exports = function(io) {
    
    io.on('connection', function(socket){
       
       socket.on('echo', function(packet){
           packet.yourSocketID = socket.id;
           packet.yourSessionID = socket.handshake.sessionID;
           socket.emit('echo', packet);
       }); 
       
    });
    
}