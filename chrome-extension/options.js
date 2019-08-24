// Saves options to chrome.storage
function save_options() {
    var apiKey = document.getElementById('api-key').value;
    chrome.storage.sync.set({
      apiKey: apiKey
    });
}

function restore_options() {
    chrome.storage.sync.get({
        apiKey: ''
    }, function(items) {
        document.getElementById('api-key').value = items.apiKey;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
