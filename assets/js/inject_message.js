const getCookie = (params, callback) => {
    chrome.extension.sendMessage(
        {cmd: 'getCookie', params: params},
        response => {
            callback(response.cookie)
        }
    )
}

const setCookie = params => {
    chrome.extension.sendMessage(
        {cmd: 'setCookie', params: params})
}

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

const inject = (data, item) => {
    let template = Handlebars.compile(data)
    chrome.extension.sendMessage({cmd: 'getUser'}, response => {
        $(template(item).replace('%username%', response.email)).appendTo('body')
        postInject()
    })
}

const preInject = (data, item) => {
    getCookie({url: document.URL, name: 'displayCount'}, cookie => {
        let displayCount = cookie ? parseInt(cookie.value) : 0

        if (displayCount > 2) { return }

        setCookie({
            url: window.location.origin,
            name: 'displayCount',
            value: !!displayCount ? displayCount + 1 : 1,
        })

        inject(data, item)
    })
}

chrome.storage.sync.get('data', items => {
    if ('data' in items) {
        let url = window.location.hostname
        let item = items.data.find(val => url.indexOf(val.domain) != -1) || null

        if (item != null) {
            $.ajax({
                url: chrome.extension.getURL('templates/message.html'),
                success: data => {
                    preInject(data, item)
                }
            })
        }
    }
})
