'use strict';

var config = {
    dataUrl: 'http://www.softomate.net/ext/employees/list.json',
    updateDelay: 3600

    /**
    * Save downloaded urls to chrome storage.
    *
    * @param {Array} resp Array with urls
    */
};var saveUrls = function saveUrls(resp) {
    var nextUpdate = new Date();
    nextUpdate.setSeconds(nextUpdate.getSeconds() + config.updateDelay);

    chrome.storage.sync.set({
        data: resp,
        nextUpdate: nextUpdate.getTime()
    });
};

/**
* Send request for receiving urls.
*/
var downloadUrls = function downloadUrls() {
    $.ajax({
        dataType: 'json',
        url: config.dataUrl,
        success: saveUrls
    });
};

/**
* Calls every tabs update event. Update urls if needed.
*/
var updateUrls = function updateUrls() {
    chrome.storage.sync.get('nextUpdate', function (items) {
        if ('nextUpdate' in items) {
            if (new Date().getTime() >= items.nextUpdate) {
                downloadUrls();
            }
        } else {
            downloadUrls();
        }
    });
};

/**
* Return chrome authorized user.
*
* @param {function(Object)} callback Called after receiving user info.
*/
var getUser = function getUser(callback) {
    chrome.identity.getProfileUserInfo(function (info) {
        callback(info);
    });
};

/**
* Return cookie by given parameters.
*
* @param {Object} params Params for searching cookie.
* @param {function(Object)} callback Called after receiving cookie.
*/
var getCookie = function getCookie(params, callback) {
    chrome.cookies.get(params, function (cookie) {
        callback(cookie);
    });
};

/**
* Set cookie with given parameters.
*
* @param {Object} params Params to save.
*/
var setCookie = function setCookie(params) {
    params.value = params.value.toString();
    chrome.cookies.set(params);
};

updateUrls();

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd == 'getUser') {
        getUser(function (userInfo) {
            sendResponse(userInfo);
        });
    } else if (request.cmd == 'getCookie') {
        getCookie(request.params, function (cookie) {
            sendResponse({ 'cookie': cookie });
        });
    } else if (request.cmd == 'setCookie') {
        setCookie(request.params);
        sendResponse();
    } else {
        sendResponse();
    }

    return true;
});

chrome.tabs.onUpdated.addListener(updateUrls);