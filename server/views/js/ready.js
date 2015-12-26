/*global hiraganaArray */

$(document).on('pagebeforeshow', '#page-ready', function() {
    var fieldset = $('#page-ready fieldset');
    for (var rowIndex = 0; rowIndex < hiraganaArray.length; rowIndex++) {

        var checkboxRow = '<input type="checkbox" name="checkbox-' + rowIndex + '" id="checkbox-' + rowIndex + '">'
                        + '<label for="checkbox-' + rowIndex + '">' + hiraganaArray[rowIndex][0] + '행 - (';
        
        
        for(var columnIndex = 0; columnIndex < hiraganaArray[rowIndex].length; columnIndex++){
            if (columnIndex > 0) {
                checkboxRow += ', ';
            }
            checkboxRow += '' + hiraganaArray[rowIndex][columnIndex];
        }
        checkboxRow += ')</label>';
        
        $(checkboxRow).appendTo(fieldset);
    }
    fieldset.trigger('create');
});