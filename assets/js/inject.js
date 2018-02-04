let getDomain = url => {
    url = url.replace('http://', '').replace('https://', '').replace('www.', '')
    return url.split('/')[0]
}

let postInject = () => {
    $('.message__close').on('click', e => {
        $(e.target).parent().remove()
        sessionStorage.setItem('displayCount', 3)
    })
}

let injectMessage = (data, item) => {
    let template = Handlebars.compile(data)

    let displayCount = parseInt(sessionStorage.getItem('displayCount'))
    if (displayCount && displayCount > 2) { return }

    sessionStorage.setItem('displayCount', !!displayCount ? displayCount + 1 : 1)

    chrome.extension.sendMessage({}, response => {
        $(template(item).replace('%username%', response.info.email)).appendTo('body')
        postInject()
    })
}

chrome.storage.sync.get('data', items => {
    if ('data' in items) {
        let url = getDomain(document.URL)
        let item = items.data.find(val => url.indexOf(val.domain) != -1) || null

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
