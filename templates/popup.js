function applyContent() {
    chrome.storage.sync.get('data', (items) => {
        if ('data' in items) {
            var template = Handlebars.compile($('#template').html());
            $('#container').html(template(items.data));
        } else {
            $('#container').html("Can't load content. Try again later");
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyContent();
});
