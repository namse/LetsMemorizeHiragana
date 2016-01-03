var EventListener = require('./event-listener.js');
var DrawableCanvas = function(_jqueryCanvasObject, _jqueryCanvasContainerObject){
    EventListener.call(this);    
    
    
    var jqueryCanvasObject = _jqueryCanvasObject;
    var jqueryCanvasContainerObject = _jqueryCanvasContainerObject;
    var domCanvas = jqueryCanvasObject[0];
    var canvasCTX = domCanvas.getContext("2d");
    var self = this;
    var clicked = false;
    
    this.strokeStyle = "#000";
    this.lineWidth = "5";
    
    this.clear = function() {
        canvasCTX.clearRect(0, 0, jqueryCanvasObject.width(), jqueryCanvasObject.height());
    };
    this.resizeCanvas = function() {
        domCanvas.width = jqueryCanvasContainerObject.width();
        domCanvas.height = jqueryCanvasContainerObject.height();
    };
    
    
    // event
    // 'strokeStart', 'strokeMove'
    
    this.strokeStart = function(pageX, pageY){
        canvasCTX.beginPath();
        var x = pageX - jqueryCanvasObject.offset().left;
        var y = pageY - jqueryCanvasObject.offset().top;
        canvasCTX.strokeStyle = self.strokeStyle;
        canvasCTX.lineWidth = self.lineWidth;
        canvasCTX.moveTo(x, y);
        this.fireEvent('strokeStart', [x, y]);
    };
    
    this.strokeMove = function(pageX, pageY){
        var x = pageX - jqueryCanvasObject.offset().left;
        var y = pageY - jqueryCanvasObject.offset().top;
        canvasCTX.strokeStyle = self.strokeStyle;
        canvasCTX.lineWidth = self.lineWidth;
        canvasCTX.lineTo(x, y);
        canvasCTX.stroke();
        this.fireEvent('strokeMove', [x, y]);
    };
    
    
    
    jqueryCanvasObject.on("touchstart", function(e){
        e = e.originalEvent;
        self.strokeStart(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    });
    
    jqueryCanvasObject.on("touchmove", function(e) {
        e.preventDefault();
        e = e.originalEvent;
        self.strokeMove(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    });
    
    jqueryCanvasObject.on("MSPointerDown", function(e){
        e = e.originalEvent;
        self.strokeStart(e.pageX, e.pageY);
    });
    
    jqueryCanvasObject.on("MSPointerMove", function(e){
        e = e.originalEvent;
        e = e.originalEvent;
        self.strokeMove(e.pageX, e.pageY);
    });
    
    
    
    jqueryCanvasObject.on("mousedown", function(e){
        self.clicked = true;
        self.strokeStart(e.pageX, e.pageY);
    });
    
    
    jqueryCanvasObject.on("mousemove", function(e){
        if(self.clicked){
            self.strokeMove(e.pageX, e.pageY);
        }
    });
    $(window).on("mouseup", function(e){
        self.clicked = false;
    });
    
};

DrawableCanvas.prototype = new EventListener();

module.exports = DrawableCanvas;