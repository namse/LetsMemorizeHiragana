var HiraganaArray = [
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

var KeyHiraganaValueKoreanDictionary = {
    "あ": "아",
    "い": "이",
    "う": "우",
    "え": "에",
    "お": "오",
    "か": "카",
    "き": "키",
    "く": "쿠",
    "け": "케",
    "こ": "코",
    "さ": "사",
    "し": "시",
    "す": "스",
    "せ": "세",
    "そ": "소",
    "た": "타",
    "ち": "치",
    "つ": "쓰(쯔)",
    "て": "테",
    "と": "토",
    "な": "나",
    "に": "니",
    "ぬ": "누",
    "ね": "네",
    "の": "노",
    "は": "하",
    "ひ": "히",
    "ふ": "후",
    "へ": "헤",
    "ほ": "호",
    "ま": "마",
    "み": "미",
    "む": "무",
    "め": "메",
    "も": "모",
    "や": "야",
    "ゆ": "유",
    "よ": "요",
    "ら": "라",
    "り": "리",
    "る": "루",
    "れ": "레",
    "ろ": "로",
    "わ": "와",
    "ゐ": "이",
    "ゑ": "에",
    "を": "오",
    "ん": "-ㄴ"
};

var JqueryObject = {
    writing: {
        page: null,
        canvas: null,
        koreanCharacter: null,
        cavnasConatiner: null,
        submit: null,
        
        init: function(){
            JqueryObject.writing.page = $('#page-test-writing');
            JqueryObject.writing.koreanCharacter = JqueryObject.writing.page.find('#test-writing-korean');
            JqueryObject.writing.cavnasConatiner = JqueryObject.writing.page.find("#test-writing-canvas-container");
            JqueryObject.writing.canvas = JqueryObject.writing.cavnasConatiner.find("#test-writing-canvas");
            JqueryObject.writing.submit = JqueryObject.writing.page.find("#test-writing-submit");
        }
    },
    ready: {
        fieldset: null,
    
        init: function(){
            JqueryObject.ready.fieldset = $('#page-ready fieldset');
        }
    },


    init: function() {
        JqueryObject.writing.init();
        JqueryObject.ready.init();
        
    }
};

$(document).ready(function() {
    JqueryObject.init();
});