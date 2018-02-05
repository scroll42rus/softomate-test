'use strict';

/**
* Compile template with handlebars extension and load it in popup window.
*/
var applyContent = function applyContent() {
    chrome.storage.sync.get('data', function (items) {
        if ('data' in items) {
            var template = Handlebars.compile($('#template').html());
            $('#container').html(template(items.data));
        } else {
            $('#container').html('Can\'t load content. Try again later');
        }
    });
};

document.addEventListener('DOMContentLoaded', function () {
    applyContent();
});