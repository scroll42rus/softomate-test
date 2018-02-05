const config = {
    dataUrl: 'http://www.softomate.net/ext/employees/list.json',
    updateDelay: 3600
}

const saveUrls = resp => {
    let nextUpdate = new Date()
    nextUpdate.setSeconds(nextUpdate.getSeconds() + config.updateDelay)

    chrome.storage.sync.set({
        data: resp,
        nextUpdate: nextUpdate.getTime()
    })
}

const downloadUrls = () => {
    $.ajax({
        dataType: 'json',
        url: config.dataUrl,
        success: saveUrls
    })
}

const updateUrls = () => {
    chrome.storage.sync.get('nextUpdate', items => {
        if ('nextUpdate' in items) {
            if (new Date().getTime() >= items.nextUpdate) {
                downloadUrls()
            }
        } else {
            downloadUrls()
        }
    })
}

const getUser = callback => {
    chrome.identity.getProfileUserInfo(info => {
        callback(info)
    })
}

const getCookie = (params, callback) => {
    chrome.cookies.get(params, cookie => {
        callback(cookie)
    })
}

const setCookie = (params, callback) => {
    params.value = params.value.toString()
    chrome.cookies.set(params)
}

chrome.extension.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.cmd == 'getUser') {
            getUser(userInfo => {
                sendResponse(userInfo)
            })
        } else if (request.cmd == 'getCookie') {
            getCookie(request.params, (cookie) => {
                sendResponse({'cookie': cookie})
            })
        } else if (request.cmd == 'setCookie') {
            setCookie(request.params)
            sendResponse()
        } else {
            sendResponse()
        }

        return true
    }
)

chrome.tabs.onUpdated.addListener(updateUrls)
