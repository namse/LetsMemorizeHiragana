/*global HiraganaArray */
/*global JqueryObject */

$(document).on('pagebeforeshow', '#page-ready', function() {
    for (var rowIndex = 0; rowIndex < HiraganaArray.length; rowIndex++) {

        var checkboxRow = '<input type="checkbox" name="checkbox-' + rowIndex + '" id="checkbox-' + rowIndex+ '">' + '<label for="checkbox-' + rowIndex + '">' + HiraganaArray[rowIndex][0] + '행 - (';

        for(var columnIndex = 0; columnIndex < HiraganaArray[rowIndex].length; columnIndex++){
            if (columnIndex > 0) {
                checkboxRow += ', ';
            }
            checkboxRow += '' + HiraganaArray[rowIndex][columnIndex];
        }
        checkboxRow += ')</label>';
        
        $(checkboxRow).appendTo(JqueryObject.ready.fieldset);
    }
    JqueryObject.ready.fieldset.trigger('create');
});