'use strict';

var urls = ['google', 'bing'];

/**
* Compile template with handlebars extension.
*
* @param {string} templ Icon template.
*/
var compileTemplate = function compileTemplate(templ) {
    var template = Handlebars.compile(templ);
    return template({
        icon: chrome.extension.getURL('images/icon.png')
    });
};

/**
* Inject icons on page near found links.
*
* @param {string} templ Icon template.
* @param {Array} items Urls for search in page.
*/
var injectIcon = function injectIcon(templ, items) {
    var template = compileTemplate(templ);

    $('cite').each(function (i, e) {
        var url = $(e).text();
        var item = items.find(function (val) {
            return url.indexOf(val.domain) != -1;
        }) || null;

        if (item != null) {
            $(e).parent().prepend(template);
        }
    });
};

/**
* Search urls in defined array 'urls'. If found, inject icons.
*/
var findHost = function findHost() {
    var hostname = window.location.hostname;
    var url = urls.find(function (val) {
        return hostname.indexOf(val) != -1;
    }) || null;

    if (url == null) {
        return;
    }
    chrome.storage.sync.get('data', function (items) {
        if ('data' in items) {
            $.ajax({
                url: chrome.extension.getURL('icon.html'),
                success: function success(templ) {
                    injectIcon(templ, items.data);
                }
            });
        }
    });
};

findHost();