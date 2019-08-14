console.log('intercepting data O_O')
const urlToIntercept = "https://player-api.globalpoker.com"

function interceptData() {
  var xhrOverrideScript = document.createElement('script');
  xhrOverrideScript.type = 'text/javascript';
  xhrOverrideScript.innerHTML = `
  (function() {
    var XHR = XMLHttpRequest.prototype;
    var send = XHR.send;
    var open = XHR.open;
    XHR.open = function(method, url) {
        this.url = url; // the request url
        return open.apply(this, arguments);
    }
    XHR.send = function() {
        this.addEventListener('load', function() {
            if (this.url.includes('${urlToIntercept}')) {
                var dataDOMElement = document.createElement('div');
                dataDOMElement.id = '__interceptedData';
                dataDOMElement.innerText = this.response;
                dataDOMElement.style.height = 0;
                dataDOMElement.style.overflow = 'hidden';
                document.body.appendChild(dataDOMElement);
            }               
        });
        return send.apply(this, arguments);
    };
  })();
  `
  document.head.prepend(xhrOverrideScript);
}
function checkForDOM() {
  console.log('checking for dom?')
  if (document.body && document.head) {
    interceptData();
  } else {
    requestIdleCallback(checkForDOM);
  }
}
requestIdleCallback(checkForDOM);

function printResponse() {
  console.log('printing response?')
  const responseContainingElement = document.getElementById('__interceptedData');
  if (responseContainingElement) {
    const response = JSON.parse(responseContainingElement.innerHTML);
    console.log(response);
    requestIdleCallback(printResponse);
  } else {
    requestIdleCallback(printResponse);
  }
}
requestIdleCallback(printResponse);