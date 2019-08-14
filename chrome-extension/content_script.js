console.log('running contentscript')
function interceptData() {
  var xhrOverrideScript = document.createElement('script');
  xhrOverrideScript.type = 'text/javascript';
  xhrOverrideScript.innerHTML = `
  (function() {
    var OrigWebSocket = window.WebSocket;
    var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);
    var wsAddListener = OrigWebSocket.prototype.addEventListener;
    wsAddListener = wsAddListener.call.bind(wsAddListener);
    window.WebSocket = function WebSocket(url, protocols) {
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
          console.log('in listener');
          console.log(event.data);
        });
        return ws;
    }.bind();
    window.WebSocket.prototype = OrigWebSocket.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;

    var wsSend = OrigWebSocket.prototype.send;
    wsSend = wsSend.apply.bind(wsSend);
    OrigWebSocket.prototype.send = function(data) {
        // TODO: Do something with the sent data if you wish.
        return wsSend(this, arguments);
    };

    // console.log('here is the websocket')
    // console.log(WebSocket);

    // var wsProto = WebSocket.prototype;
    // WebSocket = function() {
    //   console.log('created a websocket');
    //   wsProto.constructor.apply(this, arguments);
    // }
    // WebSocket.prototype = wsProto;

    // var wsSend = ws.send

    // ws.send = function() {
    //   console.log('sending message');
    //   return wsSend.apply(this, arguments);
    // }
    // ws.constructor = function() {
    //   console.log('created a websocket');
    //   return wsConstructor.apply(this, arguments);
    // };
    // var newThing = new WebSocket();

    // var meProto = MessageEvent.prototype;
    // MessageEvent = function() {
    //   console.log('Created a messageEvent');
    //   meProto.constructor.apply(this, arguments);
    // }
    // MessageEvent.prototype = meProto;

  })();
  `
  document.head.prepend(xhrOverrideScript);
}

function checkForDOM() {
  if (document.body && document.head) {
    interceptData();
  } else {
    requestIdleCallback(checkForDOM);
  }
}

requestIdleCallback(checkForDOM);
