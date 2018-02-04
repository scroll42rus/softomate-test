var config = {
    dataUrl: 'http://www.softomate.net/ext/employees/list.json',
    updateDelay: 3600
}

function saveUrls(resp) {
    var nextUpdate = new Date();
    nextUpdate.setSeconds(nextUpdate.getSeconds() + config.updateDelay);

    chrome.storage.sync.set({
        data: resp,
        nextUpdate: nextUpdate.getTime()
    });
}

function loadUrls() {
    $.ajax({
        dataType: 'json',
        url: config.dataUrl,
        success: saveUrls
    });
}

(function getProfileUserInfo(callback) {
    chrome.identity.getProfileUserInfo(info => {
        callback(info)
    });
})(info => {
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        sendResponse({info: info})
    });
});

chrome.tabs.onUpdated.addListener(function() {
    chrome.storage.sync.get('nextUpdate', (items) => {
        if ('nextUpdate' in items) {
            if (new Date().getTime() >= items.nextUpdate) {
                loadUrls();
            }
        } else {
            loadUrls();
        }
    });
});
