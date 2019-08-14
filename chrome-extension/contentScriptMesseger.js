console.log('loaded!');
chrome.runtime.onMessage.addListener(function(request) {
  console.log('Got message!');
  console.log(request);
})