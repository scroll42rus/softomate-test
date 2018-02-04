function postInject() {
    $('.message__close').on('click', e => {
        $(e.target).parent().remove()
        sessionStorage.setItem('displayCount', 3)
    });
}

function injectMessage(data, item) {
    var template = Handlebars.compile(data);

    var displayCount = parseInt(sessionStorage.getItem('displayCount'))
    if (displayCount && displayCount > 2) { return }

    sessionStorage.setItem('displayCount', !!displayCount ? displayCount + 1 : 1)

    chrome.extension.sendMessage({}, function(response) {
        $(template(item).replace('%username%', response.info.email)).appendTo('body');
        postInject();
    });
}

function getDomain(url) {
    url = url.replace('http://', '').replace('https://', '').replace('www.', '')
    return url.split('/')[0]
}

(function matchUrl() {
    chrome.storage.sync.get('data', items => {
        if ('data' in items) {
            var url = getDomain(document.URL)
            var item = items.data.find(val => url.indexOf(val.domain) != -1) || null;

            if (item != null) {
                $.ajax({
                    url: chrome.extension.getURL('templates/message.html'),
                    success: data => {
                        injectMessage(data, item)
                    }
                })
            }
        }
    })
})();
