const config = {
    dataUrl: 'http://www.softomate.net/ext/employees/list.json',
    updateDelay: 3600
}

/**
* Save downloaded urls to chrome storage.
*
* @param {Array} resp Array with urls
*/
const saveUrls = resp => {
    let nextUpdate = new Date()
    nextUpdate.setSeconds(nextUpdate.getSeconds() + config.updateDelay)

    chrome.storage.sync.set({
        data: resp,
        nextUpdate: nextUpdate.getTime()
    })
}

/**
* Send request for receiving urls.
*/
const downloadUrls = () => {
    $.ajax({
        dataType: 'json',
        url: config.dataUrl,
        success: saveUrls
    })
}

/**
* Calls every tabs update event. Update urls if needed.
*/
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

/**
* Return chrome authorized user.
*
* @param {function(Object)} callback Called after receiving user info.
*/
const getUser = callback => {
    chrome.identity.getProfileUserInfo(info => {
        callback(info)
    })
}

/**
* Return cookie by given parameters.
*
* @param {Object} params Params for searching cookie.
* @param {function(Object)} callback Called after receiving cookie.
*/
const getCookie = (params, callback) => {
    chrome.cookies.get(params, cookie => {
        callback(cookie)
    })
}

/**
* Set cookie with given parameters.
*
* @param {Object} params Params to save.
*/
const setCookie = (params) => {
    params.value = params.value.toString()
    chrome.cookies.set(params)
}

updateUrls()

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
