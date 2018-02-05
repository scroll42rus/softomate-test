const urls = [
    'google',
    'bing'
]

const compileTemplate = templ => {
    let template = Handlebars.compile(templ)
    return template({
        icon: chrome.extension.getURL('assets/img/icon.png')
    })
}

const injectIcon = (templ, items) => {
    let template = compileTemplate(templ)

    $('cite').each((i, e) => {
        let url = $(e).text()
        let item = items.find(val => url.indexOf(val.domain) != -1) || null

        if (item != null) {
            $(e).parent().prepend(template)
        }
    })
}

const findHost = () => {
    hostname = window.location.hostname
    let url = urls.find(
        val => hostname.indexOf(val) != -1) || null

    if (url == null) {return}
    chrome.storage.sync.get('data', items => {
        $.ajax({
            url: chrome.extension.getURL('templates/icon.html'),
            success: templ => {
                injectIcon(templ, items.data)
            }
        })
    })
}

findHost()
