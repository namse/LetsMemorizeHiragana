var TestManager = (function() {

    var testHiraganaArray = [];
    var testHiraganaQueue = [];
    var scoringSheet = {}; // key : hiragana ---- value :  Score.VALUE
    var isLoadingSuccess = false;
    $(document).on("pagebeforeshow", '#page-test-loading', function() {
        initTestHiraganaArray();
        initTestHiraganaQueue(testHiraganaArray);
        initScoringSheet(testHiraganaArray);

        isLoadingSuccess = true;

        TestManager.onNext();
    });




    function initTestHiraganaArray() {
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
            if (key.indexOf("checkbox-") === 0 && queryString[key] === 'on') {
                var rowString = key.substring("checkbox-".length);
                var rowInt = parseInt(rowString);
                var rowData = HiraganaArray[rowInt];
                if (rowData) {
                    testHiraganaArray = testHiraganaArray.concat(rowData);
                }
            }
        }
    }

    function initTestHiraganaQueue(testHiraganaArray) {
        var clonedArray = testHiraganaArray.slice(0);
        testHiraganaQueue = [];
        while (clonedArray.length > 0) {
            var index = Math.floor((Math.random() * clonedArray.length));
            testHiraganaQueue.push(testHiraganaArray[index]);
            clonedArray.splice(index, 1);
        }
    }

    function initScoringSheet(testHiraganaArray) {
        scoringSheet = {};
        for (var key in testHiraganaArray) {
            scoringSheet[key] = Score.YET;
        }
    }

    return {
        getIsLoadingSuccess: function() {
            return isLoadingSuccess;
        },

        getCurrentHiragana: function() {
            return testHiraganaQueue[0];
        },

        getCurrentKorean: function() {
            return this.getKoreanCharacterWithHiragana(this.getCurrentHiragana());
        },

        getKoreanCharacterWithHiragana: function(hiragana) {
            return KeyHiraganaValueKoreanDictionary[hiragana];
        },

        onNext: function() {
            if (true) { //Math.random() < 0.5){
                // 쓰기
                TestWritingPage.open();
            }
            else {
                // 읽기
                this.onReadingPageInitAndOpen();
            }
        },


        onReadyForNextQuestion: function() {
            // dequeue in here.
            testHiraganaQueue.shift();

            // and call onNext
            this.onNext();
        },


        onReadingPageInitAndOpen: function() {
            // 화면 초기화

            // 화면 전환
            $.mobile.changePage("#page-test-reading");
        },

        scoreForWriting: function(userHiraganaAnswer) {
            scoringSheet[this.getCurrentHiragana()] = userHiraganaAnswer === this.getCurrentHiragana() ? Score.CORRECT : Score.INCORRECT;

        }
    };



})();


module.exports = TestManager;

var TestWritingPage = require('./test-writing.js');
var Global = require('./global.js');
var HiraganaArray = Global.HiraganaArray;
var KeyHiraganaValueKoreanDictionary = Global.KeyHiraganaValueKoreanDictionary;
var JqueryObject = Global.JqueryObject;

/** @enum {string} */
var Score = {
    YET: 'yet',
    CORRECT: 'correct',
    INCORRECT: 'incorrect'
};