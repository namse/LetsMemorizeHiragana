/* global hiraganaArray */
/* global keyHiraganaValueKoreanDictionary */
/* global dcodeIO */

var ProtoBuf = dcodeIO.ProtoBuf;
var ProtoBuilder = ProtoBuf.loadProtoFile("/proto/packet.proto");
var ProtoPacket = ProtoBuilder.build("Packet");
var ProtoStroke = ProtoPacket.Stroke;
var ProtoPosition = ProtoStroke.Position;
var testCharacterArray = [];
var testCharacterQueue = [];
var scoringSheet; // "yet", "incorrect", "correct"
var lineWidth = 5;
var isLoadingSuccess = false;

$(document).on("pagebeforeshow", '#page-test-loading', function() {
    JQUERY_OBJECT.init();
    initTestCharacterArray();
    initTestCharacterQueue(testCharacterArray);
    initScoringSheet(testCharacterArray);
    CANVAS.init();
    
    isLoadingSuccess = true;
    
    OnNext();
});

$(document).on("pageshow", '#page-test-writing', function() {
    // check it is strange approach
    if(isLoadingSuccess == false){
        $.mobile.changePage("#page-test-loading");
        return;
    }
    resize();
});

$(window).on("resize orientationchange", '#page-test-writing', function() {
    resize();
});

function initTestCharacterArray() {
    var queryString = function() {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            }
            else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            }
            else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }();
    
    for (var key in queryString) {
        if (key.indexOf("checkbox-") == 0 && queryString[key] === 'on') {
            var rowString = key.substring("checkbox-".length);
            var rowInt = parseInt(rowString);
            var rowData = hiraganaArray[rowInt];
            if (rowData) {
                testCharacterArray = testCharacterArray.concat(rowData);
            }
        }
    }
}

function initTestCharacterQueue(testCharacterArray) {
    var clonedArray = testCharacterArray.slice(0);
    testCharacterQueue = [];
    while (clonedArray.length > 0) {
        var index = Math.floor((Math.random() * clonedArray.length));
        testCharacterQueue.push(testCharacterArray[index]);
        clonedArray.splice(index, 1);
    }
}

function initScoringSheet(testCharacterArray) {
    scoringSheet = {};
    for (var key in testCharacterArray) {
        scoringSheet[key] = "yet";
    }
}

function OnNext() {
    if (true) { //Math.random() < 0.5){
        // 쓰기
        onWritingPageInitAndOpen();
    }
    else {
        // 읽기
        onReadingPageInitAndOpen();
    }
}

function onWritingPageInitAndOpen() {
    // 화면 초기화
    JQUERY_OBJECT.writing.koreanCharacter.text(keyHiraganaValueKoreanDictionary[testCharacterQueue[0]]);
    $("#test-writing-submit").click(function(){
        requestRecognizion();
    })
    // 화면 전환
    $.mobile.changePage("#page-test-writing");
}

function requestRecognizion() {
    //STROKE_DATA.compress();
    var data = STROKE_DATA.getProtoPacket().encode64();
    $.post('recognize', {
        'data': data
        }, function(data){
        STROKE_DATA.reset();
        console.log(data);
    });
}

function onReadingPageInitAndOpen() {
    // 화면 초기화

    // 화면 전환
    $.mobile.changePage("#page-test-reading");
}

var JQUERY_OBJECT = {
    writing: {
        page: null,
        canvas: null,
        koreanCharacter: null,
        cavnasConatiner: null,
        
        init: function(){
            JQUERY_OBJECT.writing.page = $('#page-test-writing');
            JQUERY_OBJECT.writing.koreanCharacter = JQUERY_OBJECT.writing.page.find('#test-writing-korean');
            JQUERY_OBJECT.writing.cavnasConatiner = JQUERY_OBJECT.writing.page.find("#test-writing-canvas-container");
            JQUERY_OBJECT.writing.canvas = JQUERY_OBJECT.writing.cavnasConatiner.find("#test-writing-canvas");
        }
    },


    init: function() {
        JQUERY_OBJECT.writing.init();
        
    }
}

var CANVAS = {
    canvasCTX: null,
    writingData: {},
    init: function() {

        JQUERY_OBJECT.writing.canvas.drawTouch();
        JQUERY_OBJECT.writing.canvas.drawPointer();
        JQUERY_OBJECT.writing.canvas.drawMouse();

        CANVAS.canvasCTX = JQUERY_OBJECT.writing.canvas[0].getContext("2d");

        CANVAS.clear();
    },
    clear: function() {
        CANVAS.canvasCTX.clearRect(0, 0, JQUERY_OBJECT.writing.canvas.width(), JQUERY_OBJECT.writing.canvas.height());
        CANVAS.writingData = {};
    },
    resizeCanvas: function() {
        JQUERY_OBJECT.writing.canvas[0].width = JQUERY_OBJECT.writing.cavnasConatiner.width();
        JQUERY_OBJECT.writing.canvas[0].height = JQUERY_OBJECT.writing.cavnasConatiner.height();
    }

}
function Position(x, y) {
    this.x = x;
    this.y = y;
}
var STROKE_DATA = {
    data: [],
    add: function(position, isNewStroke) {
        if(isNewStroke || STROKE_DATA.data.length == 0){
            STROKE_DATA.data.push([]);
        }
        STROKE_DATA.data[STROKE_DATA.data.length - 1].push(position);
    },
    compress: function() {
        for(var strokeIndex = 0; strokeIndex < STROKE_DATA.data.length; strokeIndex++){
            var stroke = STROKE_DATA.data[strokeIndex];
            if(stroke.length > 3){
                var stroke = STROKE_DATA.data[strokeIndex];
                var firstPosition = stroke[0];
                var centerPosition = stroke[Math.floor(stroke.length/2)];
                var lastPosition = stroke[stroke.length - 1];
                
                stroke.splice(0, stroke.length);
                stroke.push(firstPosition);
                stroke.push(centerPosition);
                stroke.push(lastPosition);
            }
        }
    },
    // [strokeIndex, x, y strokeIndex, x, y, ...]
    getProtoPacket: function() {
        var protoStrokes = [];
        for(var strokeIndex = 0; strokeIndex < STROKE_DATA.data.length; strokeIndex++){
            var stroke = STROKE_DATA.data[strokeIndex];
            var protoPositions = [];
            for(var positionIndex = 0; positionIndex < stroke.length; positionIndex++){
                var position = stroke[positionIndex];
                var protoPosition = new ProtoPosition(position.x, position.y);
                protoPositions.push(protoPosition);
            }
            protoStrokes.push(new ProtoStroke(protoPositions));
        }
        return new ProtoPacket(JQUERY_OBJECT.writing.canvas[0].width, JQUERY_OBJECT.writing.canvas[0].height, protoStrokes);
    },
    reset: function(){
        STROKE_DATA.data = [];
    }
}

// prototype to	start drawing on touch using canvas moveTo and lineTo
$.fn.drawTouch = function() {
    var start = function(e) {
        e = e.originalEvent;
        CANVAS.canvasCTX.beginPath();
        var x = e.changedTouches[0].pageX - JQUERY_OBJECT.writing.canvas.offset().left;
        var y = e.changedTouches[0].pageY - JQUERY_OBJECT.writing.canvas.offset().top;
        CANVAS.canvasCTX.strokeStyle = "#000";
        CANVAS.canvasCTX.lineWidth = lineWidth;
        CANVAS.canvasCTX.moveTo(x, y);
        STROKE_DATA.add(new Position(x,y), true);
    };
    var move = function(e) {
        e.preventDefault();
        e = e.originalEvent;
        var x = e.changedTouches[0].pageX - JQUERY_OBJECT.writing.canvas.offset().left;
        var y = e.changedTouches[0].pageY - JQUERY_OBJECT.writing.canvas.offset().top;
        CANVAS.canvasCTX.strokeStyle = "#000";
        CANVAS.canvasCTX.lineWidth = lineWidth;
        CANVAS.canvasCTX.lineTo(x, y);
        CANVAS.canvasCTX.stroke();
        STROKE_DATA.add(new Position(x,y), false);
    };
    $(this).on("touchstart", start);
    $(this).on("touchmove", move);
};

// prototype to	start drawing on pointer(microsoft ie) using canvas moveTo and lineTo
$.fn.drawPointer = function() {
    var start = function(e) {
        e = e.originalEvent;
        CANVAS.canvasCTX.beginPath();
        var x = e.pageX - JQUERY_OBJECT.writing.canvas.offset().left;
        var y = e.pageY - JQUERY_OBJECT.writing.canvas.offset().top;
        CANVAS.canvasCTX.strokeStyle = "#000";
        CANVAS.canvasCTX.lineWidth = lineWidth;
        CANVAS.canvasCTX.moveTo(x, y);
    };
    var move = function(e) {
        e.preventDefault();
        e = e.originalEvent;
        var x = e.pageX - JQUERY_OBJECT.writing.canvas.offset().left;
        var y = e.pageY - JQUERY_OBJECT.writing.canvas.offset().top;
        CANVAS.canvasCTX.strokeStyle = "#000";
        CANVAS.canvasCTX.lineWidth = lineWidth;
        CANVAS.canvasCTX.lineTo(x, y);
        CANVAS.canvasCTX.stroke();
    };
    $(this).on("MSPointerDown", start);
    $(this).on("MSPointerMove", move);
};

// prototype to	start drawing on mouse using canvas moveTo and lineTo
$.fn.drawMouse = function() {
    var clicked = false;
    var start = function(e) {
        clicked = true;
        CANVAS.canvasCTX.beginPath();
        var x = e.pageX - JQUERY_OBJECT.writing.canvas.offset().left;
        var y = e.pageY - JQUERY_OBJECT.writing.canvas.offset().top;
        CANVAS.canvasCTX.strokeStyle = "#000";
        CANVAS.canvasCTX.lineWidth = lineWidth;
        CANVAS.canvasCTX.moveTo(x, y);
        STROKE_DATA.add(new Position(x,y), true);
    };
    var move = function(e) {
        if (clicked) {
            var x = e.pageX - JQUERY_OBJECT.writing.canvas.offset().left;
            var y = e.pageY - JQUERY_OBJECT.writing.canvas.offset().top;
            CANVAS.canvasCTX.strokeStyle = "#000";
            CANVAS.canvasCTX.lineWidth = lineWidth;
            CANVAS.canvasCTX.lineTo(x, y);
            CANVAS.canvasCTX.stroke();
            STROKE_DATA.add(new Position(x,y), false);
        }
    };
    var stop = function(e) {
        clicked = false;
    };
    $(this).on("mousedown", start);
    $(this).on("mousemove", move);
    $(window).on("mouseup", stop);
};

function resize() {
    CANVAS.resizeCanvas();
    JQUERY_OBJECT.writing.koreanCharacter.css({
        'font-size': Math.min(JQUERY_OBJECT.writing.koreanCharacter.height(), JQUERY_OBJECT.writing.koreanCharacter.width())
    });
}
