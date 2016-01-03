var TestWritingPage = function() {

    /* global DrawableCanvas */
    /* global JqueryObject */
    /* global dcodeIO */
    /* global TestManager */
    /* global Score */

    var ProtoBuf = dcodeIO.ProtoBuf;
    var ProtoBuilder = ProtoBuf.loadProtoFile("/proto/packet.proto");
    var ProtoPacket = ProtoBuilder.build("Packet");
    var ProtoStroke = ProtoPacket.Stroke;
    var ProtoPosition = ProtoStroke.Position;

    var canvas = null;

    $(document).ready(function() {
        canvas = new DrawableCanvas(JqueryObject.writing.canvas, JqueryObject.writing.cavnasConatiner);
    });


    $(document).on("pageshow", '#page-test-writing', function() {
        // check it is strange approach
        if (TestManager.isLoadingSuccess === false) {
            $.mobile.changePage("#page-test-loading");
            return;
        }
        resize();
    });

    $(window).on("resize orientationchange", '#page-test-writing', function() {
        resize();
    });
    
    function open() {
        // 화면 초기화
        JqueryObject.writing.koreanCharacter.text(TestManager.getCurrentKorean());
        JqueryObject.writing.submit.click(function() {
                requestRecognizion();
            });
            // 화면 전환
        $.mobile.changePage("#page-test-writing");
    }
    
    function resize() {
        canvas.resizeCanvas();
        JqueryObject.writing.koreanCharacter.css({
            'font-size': Math.min(JqueryObject.writing.koreanCharacter.height(), JqueryObject.writing.koreanCharacter.width())
        });
    }


    var StrokeData = function() {
        var data = [];

        function add(position, isNewStroke) {
            if (isNewStroke || data.length === 0) {
                data.push([]);
            }
            data[data.length - 1].push(position);
        }

        function compress() {
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
        }

        // [strokeIndex, x, y strokeIndex, x, y, ...]
        function getProtoPacket() {
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
        }

        function reset() {
            data = [];
        }
    };


    function requestRecognizion() {
        //STROKE_DATA.compress();
        var data = StrokeData.getProtoPacket().encode64();
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
            StrokeData.reset();
        });
    }

    function onWritingPageScoring(recognizedResult) {
        // 1. scoring
        TestManager.scoringSheet[TestManager.getCurrentHiragana()] = recognizedResult === TestManager.getCurrentHiragana() ? Score.CORRECT : Score.INCORRECT;

        // 2. show result.
    }

};