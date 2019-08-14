const GLOBAL_POKER_URL = 'https://player-api.globalpoker.com';
chrome.runtime.sendMessage('Devtools started');

chrome.devtools.network.onRequestFinished.addListener(function(request) {
  if (!request) {
    chrome.runtime.sendMessage('no request');
    chrome.runtime.sendMessage(request);

  }
  if (!request.request) {
    chrome.runtime.sendMessage('no request in the request');
    chrome.runtime.sendMessage(request.request);

  }
  if (!request.request.url) {
    chrome.runtime.sendMessage('no url');
    chrome.runtime.sendMessage(request.request);

  }
  chrome.runtime.sendMessage('globalpoker request finished')
  chrome.runtime.sendMessage(request);
})
