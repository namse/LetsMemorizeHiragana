$(window).on("load", function() {
    var socket = io();
    socket.on("echo", function(packet){
       console.log("received packet : ", packet); 
    });
    socket.on("connect", function(){
        socket.emit("echo", {
            data: "hi"
        });
    })
});