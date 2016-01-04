var DrawableCanvas = require('./drawable-canvas.js');
var JqueryObject = require('./global.js').JqueryObject;

var TestWritingIncorrectPage = (function() {

    var repeatCanvas;

    $(document).ready(function() {
        repeatCanvas = new DrawableCanvas(JqueryObject.writingIncorrect.repeatCanvas, JqueryObject.writingIncorrect.repeatCanvasContainer);
    });

    $(document).on("pageshow", JqueryObject.writingIncorrect.page, function() {
        resize();
    });

    function resize() {
        repeatCanvas.resizeCanvas();

        JqueryObject.writingIncorrect.myAnswerCanvas[0].width = JqueryObject.writingIncorrect.myAnswerCanvasContainer.width();
        JqueryObject.writingIncorrect.myAnswerCanvas[0].height = JqueryObject.writingIncorrect.myAnswerCanvasContainer.height();

    }


    return {
        /** @param canvasDom, recognizedResult */
        open: function(canvasDom, canvasMinPosition, canvasMaxPosition, recognizedResult) {

            // loading

            var myAnswerCanvasInit = (function() {
                var myAnswerCanvasCTX = JqueryObject.writingIncorrect.myAnswerCanvas[0].getContext('2d');

                // https://developer.mozilla.org/ko/docs/Canvas_tutorial/Using_images
                // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                var image = new Image();
                image.src = canvasDom.toDataURL("image/png");
                var sx = canvasMinPosition.x;
                var sy = canvasMinPosition.y;
                var sWidth = canvasMaxPosition.x - canvasMinPosition.x;
                var sHeight = canvasMaxPosition.y - canvasMinPosition.y;
                var dx, dy, dWidth, dHeight;
                var defaultPadding = 10;

                var returnFunction = function() {
                    if (sWidth > sHeight) {
                        dWidth = JqueryObject.writingIncorrect.myAnswerCanvasContainer.width() - (2 * defaultPadding);
                        dHeight = sHeight * (dWidth / sWidth);
                        dx = defaultPadding;
                        dy = (JqueryObject.writingIncorrect.myAnswerCanvasContainer.height() - dHeight) / 2;
                    }
                    else {
                        dHeight = JqueryObject.writingIncorrect.myAnswerCanvasContainer.height() - (2 * defaultPadding);
                        dWidth = sWidth * (dHeight / sHeight);
                        dy = defaultPadding;
                        dx = (JqueryObject.writingIncorrect.myAnswerCanvasContainer.width() - dWidth) / 2;
                    }

                    myAnswerCanvasCTX.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                    $(document).off("pageshow", JqueryObject.writingIncorrect.page, returnFunction);
                };
                return returnFunction;
            })();

            $(document).on("pageshow", JqueryObject.writingIncorrect.page, myAnswerCanvasInit);



            var recognizedResultKorean = TestManager.getKoreanCharacterWithHiragana(recognizedResult);
            JqueryObject.writingIncorrect.myAnswerRecognizedH1.text(recognizedResultKorean + '(' + recognizedResult + ')');

            var repeatText = TestManager.getCurrentKorean() + ' | ' + TestManager.getCurrentHiragana();
            JqueryObject.writingIncorrect.correctAnswerH1.text(repeatText);



            var repeatCanvasCTX = JqueryObject.writingIncorrect.repeatCanvas[0].getContext("2d");
            repeatCanvasCTX.font = JqueryObject.writingIncorrect.repeatCanvasContainer.height() + "px Arial";
            repeatCanvasCTX.strokeText(repeatText, 10, 50);

            // change page
            $.mobile.changePage(JqueryObject.writingIncorrect.page);

        }
    };
})();

module.exports = TestWritingIncorrectPage;

var TestManager = require('./test-manager.js');