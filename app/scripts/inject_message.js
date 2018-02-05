'use strict';

/**
* Search cookie by given parameters
*
* @param {Object} params Params for searching cookie.
* @param {function(Object)} callback Called after receiving cookie.
*/
var getCookie = function getCookie(params, callback) {
    chrome.extension.sendMessage({ cmd: 'getCookie', params: params }, function (response) {
        callback(response.cookie);
    });
};

/**
* Set cookie with given parameters.
*
* @param {Object} params Params to save.
*/
var setCookie = function setCookie(params) {
    chrome.extension.sendMessage({ cmd: 'setCookie', params: params });
};

/**
* Calls after inject and bind onclick handler to close message button.
*/
var postInject = function postInject() {
    $('.message__close').on('click', function (e) {
        $(e.target).parent().remove();

        setCookie({
            url: window.location.origin,
            name: 'displayCount',
            value: 3
        });
    });
};

/**
* Inject message in page.
*
* @param {Object} item Matched url with current location.
*/
var inject = function inject(item) {
    $.ajax({
        url: chrome.extension.getURL('message.html'),
        success: function success(templ) {
            var template = Handlebars.compile(templ);
            chrome.extension.sendMessage({ cmd: 'getUser' }, function (response) {
                $(template(item).replace('%username%', response.email)).appendTo('body');
                postInject();
            });
        }
    });
};

/**
* Calls before inject message in page. Check if message should be shown.
*
* @param {Object} item Matched url with current location.
*/
var preInject = function preInject(item) {
    getCookie({ url: document.URL, name: 'displayCount' }, function (cookie) {
        var displayCount = cookie ? parseInt(cookie.value) : 0;

        if (displayCount > 2) {
            return;
        }

        setCookie({
            url: window.location.origin,
            name: 'displayCount',
            value: !!displayCount ? displayCount + 1 : 1
        });

        inject(item);
    });
};

chrome.storage.sync.get('data', function (items) {
    if ('data' in items) {
        var url = window.location.hostname;
        var item = items.data.find(function (val) {
            return url.indexOf(val.domain) != -1;
        }) || null;

        if (item != null) {
            preInject(item);
        }
    }
});