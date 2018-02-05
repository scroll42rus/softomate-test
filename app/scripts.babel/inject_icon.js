const urls = [
    'google',
    'bing'
]

/**
* Compile template with handlebars extension.
*
* @param {string} templ Icon template.
*/
const compileTemplate = templ => {
    let template = Handlebars.compile(templ)
    return template({
        icon: chrome.extension.getURL('images/icon.png')
    })
}

/**
* Inject icons on page near found links.
*
* @param {string} templ Icon template.
* @param {Array} items Urls for search in page.
*/
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

/**
* Search urls in defined array 'urls'. If found, inject icons.
*/
const findHost = () => {
    let hostname = window.location.hostname
    let url = urls.find(
        val => hostname.indexOf(val) != -1) || null

    if (url == null) {return}
    chrome.storage.sync.get('data', items => {
        if ('data' in items) {
            $.ajax({
                url: chrome.extension.getURL('icon.html'),
                success: templ => {
                    injectIcon(templ, items.data)
                }
            })
        }
    })
}

findHost()
