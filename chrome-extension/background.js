console.log('background loaded');
chrome.runtime.onMessage.addListener(function(message){
  console.log(message);
});
console.log('listener added');