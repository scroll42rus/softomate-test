/**
* Search cookie by given parameters
*
* @param {Object} params Params for searching cookie.
* @param {function(Object)} callback Called after receiving cookie.
*/
const getCookie = (params, callback) => {
    chrome.extension.sendMessage(
        {cmd: 'getCookie', params: params},
        response => {
            callback(response.cookie)
        }
    )
}

/**
* Set cookie with given parameters.
*
* @param {Object} params Params to save.
*/
const setCookie = params => {
    chrome.extension.sendMessage(
        {cmd: 'setCookie', params: params})
}

/**
* Calls after inject and bind onclick handler to close message button.
*/
const postInject = () => {
    $('.message__close').on('click', e => {
        $(e.target).parent().remove()

        setCookie({
            url: window.location.origin,
            name: 'displayCount',
            value: 3,
        })
    })
}

/**
* Inject message in page.
*
* @param {Object} item Matched url with current location.
*/
const inject = (item) => {
    $.ajax({
        url: chrome.extension.getURL('message.html'),
        success: templ => {
            let template = Handlebars.compile(templ)
            chrome.extension.sendMessage({cmd: 'getUser'}, response => {
                $(template(item).replace('%username%', response.email)).appendTo('body')
                postInject()
            })
        }
    })
}

/**
* Calls before inject message in page. Check if message should be shown.
*
* @param {Object} item Matched url with current location.
*/
const preInject = (item) => {
    getCookie({url: document.URL, name: 'displayCount'}, cookie => {
        let displayCount = cookie ? parseInt(cookie.value) : 0

        if (displayCount > 2) { return }

        setCookie({
            url: window.location.origin,
            name: 'displayCount',
            value: !!displayCount ? displayCount + 1 : 1,
        })

        inject(item)
    })
}

chrome.storage.sync.get('data', items => {
    if ('data' in items) {
        let url = window.location.hostname
        let item = items.data.find(val => url.indexOf(val.domain) != -1) || null

        if (item != null) {
            preInject(item)
        }
    }
})
