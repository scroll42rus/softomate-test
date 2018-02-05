/**
* Compile template with handlebars extension and load it in popup window.
*/
const applyContent = () => {
    chrome.storage.sync.get('data', items => {
        if ('data' in items) {
            let template = Handlebars.compile($('#template').html())
            $('#container').html(template(items.data))
        } else {
            $('#container').html('Can\'t load content. Try again later')
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    applyContent()
})
