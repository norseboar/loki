const URL_TO_INTERCEPT = 'player-api.globalpoker.com'
console.log('does this work??')
chrome.runtime.sendMessage('a message')
chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
    console.log('intercepted')
    if (request.request && request.request.url) {
      console.log('counts as request')
      console.log(request.request.url)
      console.log(URL_TO_INTERCEPT)
      if (request.request.url.includes(URL_TO_INTERCEPT)) {
        console.log(request.request.url)
        console.log(body)
        chrome.runtime.sendMessage({
            response: body
        });
      }
    }
  });
});