var ProtoBuf = dcodeIO.ProtoBuf;
var ProtoBuilder = ProtoBuf.loadProtoFile("/proto/packet.proto");
var ProtoPacket = ProtoBuilder.build("Packet");
var ProtoStroke = ProtoPacket.Stroke;
var ProtoPosition = ProtoStroke.Position;

var Position = function(x, y) {
    this.x = x;
    this.y = y;
};

var StrokeData = function() {
    var data = [];

    this.add = function(position, isNewStroke) {
        if (isNewStroke || data.length === 0) {
            data.push([]);
        }
        data[data.length - 1].push(position);
    };

    this.compress = function() {
        for (var strokeIndex = 0; strokeIndex < data.length; strokeIndex++) {
            var stroke = data[strokeIndex];
            if (stroke.length > 3) {
                var firstPosition = stroke[0];
                var centerPosition = stroke[Math.floor(stroke.length / 2)];
                var lastPosition = stroke[stroke.length - 1];

                stroke.splice(0, stroke.length);
                stroke.push(firstPosition);
                stroke.push(centerPosition);
                stroke.push(lastPosition);
            }
        }
    };

    // [strokeIndex, x, y strokeIndex, x, y, ...]
    this.getProtoPacket = function() {
        var protoStrokes = [];
        for (var strokeIndex = 0; strokeIndex < data.length; strokeIndex++) {
            var stroke = data[strokeIndex];
            var protoPositions = [];
            for (var positionIndex = 0; positionIndex < stroke.length; positionIndex++) {
                var position = stroke[positionIndex];
                var protoPosition = new ProtoPosition(position.x, position.y);
                protoPositions.push(protoPosition);
            }
            protoStrokes.push(new ProtoStroke(protoPositions));
        }
        return new ProtoPacket(JqueryObject.writing.canvas[0].width, JqueryObject.writing.canvas[0].height, protoStrokes);
    };

    this.reset = function() {
        data = [];
    };
};

var TestWritingPage = (function() {

    /* global dcodeIO */



    var canvas = null;
    var strokeData = new StrokeData();
    $(document).ready(function() {
        canvas = new DrawableCanvas(JqueryObject.writing.canvas, JqueryObject.writing.cavnasConatiner);
    });


    $(document).on("pageshow", '#page-test-writing', function() {
        // check it is strange approach
        if (TestManager.getIsLoadingSuccess() === false) {
            $.mobile.changePage("#page-test-loading");
            return;
        }
        resize();
    });

    $(window).on("resize orientationchange", '#page-test-writing', function() {
        resize();
    });



    function resize() {
        canvas.resizeCanvas();
        canvas.on('strokeStart', function(x,y){
           strokeData.add(new Position(x,y), true); 
        });
        canvas.on('strokeMove', function(x,y){
           strokeData.add(new Position(x,y), false); 
        });
        JqueryObject.writing.koreanCharacter.css({
            'font-size': Math.min(JqueryObject.writing.koreanCharacter.height(), JqueryObject.writing.koreanCharacter.width())
        });
    }





    function requestRecognizion() {
        //STROKE_DATA.compress();
        var data = strokeData.getProtoPacket().encode64();
        $.post('recognize', {
            'data': data
        }, function(data) {
            // packet (data)
            // isSuccess - recognizer 자체의 error가 있는지 없는지.
            // result - error가 있을 경우(isSuccess = false) 에러메시지, error가 없을 경우 recognization result.

            if (data.isSuccess) {
                onWritingPageScoring(data.result);
            }
            else {
                alert("Recognizer Error : " + data.result);
            }
            strokeData.reset();
        });
    }

    function onWritingPageScoring(recognizedResult) {
        // 1. scoring
        TestManager.scoreForWriting(recognizedResult);

        // 2. show result.
    }


    return {
        open: function() {
            // 화면 초기화
            JqueryObject.writing.koreanCharacter.text(TestManager.getCurrentKorean());
            JqueryObject.writing.submit.click(function() {
                requestRecognizion();
            });
            // 화면 전환
            $.mobile.changePage("#page-test-writing");
        }
    };
})();

module.exports = TestWritingPage;

var TestManager = require('./test-manager.js');
var DrawableCanvas = require('./drawable-canvas.js');
var JqueryObject = require('./global.js').JqueryObject;

