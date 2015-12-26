var testCharacterArray = []
var testCharacterQueue = [];
var scoringSheet; // "yet", "incorrect", "correct"
var lineWidth = 5;
var isLoadingSuccess = false;
/* global hiraganaArray */
/* global keyHiraganaValueKoreanDictionary */

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
    
    // 화면 전환
    $.mobile.changePage("#page-test-writing");
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
        console.log(x, y);
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
        console.log(x, y);
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
        console.log(x, y);
    };
    var move = function(e) {
        if (clicked) {
            var x = e.pageX - JQUERY_OBJECT.writing.canvas.offset().left;
            var y = e.pageY - JQUERY_OBJECT.writing.canvas.offset().top;
            CANVAS.canvasCTX.strokeStyle = "#000";
            CANVAS.canvasCTX.lineWidth = lineWidth;
            CANVAS.canvasCTX.lineTo(x, y);
            CANVAS.canvasCTX.stroke();
            console.log(x, y);
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
