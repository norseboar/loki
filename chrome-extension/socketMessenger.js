
function shouldSendMessage(message) {
  const ACCEPTABLE_MESSAGES = [15, 60, 61, 62, 100];
  // return ACCEPTABLE_MESSAGES.includes(message.classId);
  return true;
}

function patchWebSocket() {
  var OrigWebSocket = window.WebSocket;
  var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);
  var wsAddListener = OrigWebSocket.prototype.addEventListener;
  wsAddListener = wsAddListener.call.bind(wsAddListener);
  window.WebSocket = function WebSocket(url, protocols) {
    alert('Websocket Patched')
    var ws;
    if (!(this instanceof WebSocket)) {
        // Called without 'new' (browsers will throw an error).
        ws = callWebSocket(this, arguments);
    } else if (arguments.length === 1) {
        ws = new OrigWebSocket(url);
    } else if (arguments.length >= 2) {
        ws = new OrigWebSocket(url, protocols);
    } else { // No arguments (browsers will throw an error)
        ws = new OrigWebSocket();
    }

    wsAddListener(ws, 'message', function(event) {
      if (shouldSendMessage(JSON.parse(event.data))) {
        const messageListElem = document.getElementById('__socketData')
        const messageElem = document.createElement("div");
        messageListElem.appendChild(messageElem);
        messageElem.innerText = event.data;
      }
    });
    return ws;
  }.bind();
  window.WebSocket.prototype = OrigWebSocket.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;

  var wsSend = OrigWebSocket.prototype.send;
  wsSend = wsSend.apply.bind(wsSend);
  OrigWebSocket.prototype.send = function(data) {
      // TODO: Do something with the sent data if needed
      return wsSend(this, arguments);
  };

}

function checkForHead() {
  if(!document.head) {
    requestIdleCallback(checkForHead);
  }
  // Insert script that will patch WebSocket
  var patchWebSocketScript = document.createElement('script');
  patchWebSocketScript.type = 'text/javascript';
  patchWebSocket.className = 'fs-block';
  patchWebSocketScript.innerHTML = `
    ${shouldSendMessage.toString()}
    (${patchWebSocket.toString()})();
  `
  document.head.prepend(patchWebSocketScript);
}
requestIdleCallback(checkForHead);


function checkForDOM() {
  if (document.body && document.head) {
    // Create a hidden DOM element to store data from websocket
    var messageListElem = document.createElement('div');
    messageListElem.id = '__socketData';
    messageListElem.className = 'fs-block'  // Stop fullstory from seeing these
    messageListElem.style.display = 'none';
    document.body.appendChild(messageListElem);
  } else {
    requestIdleCallback(checkForDOM);
  }
}
requestIdleCallback(checkForDOM);
