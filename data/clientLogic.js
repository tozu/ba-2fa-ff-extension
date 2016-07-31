var GETRequest;

var URL;
var successful;

window.addEventListener("load", function(event) {
  self.port.emit("init-observer", "bla");
}, false);

self.port.on("make-API-request", makeAPIRequest); // TODO does it work? need to call specifically

// API/REST Call - TESTED
function makeAPIRequest() {
  if(!GETRequest) {
    GETRequest = new XMLHttpRequest();
  }
  if(GETRequest) {
    console.log("[made API Request]");
    GETRequest.open('GET', URL);
    GETRequest.addEventListener("load", onLoadHandlerAPI);
    GETRequest.addEventListener("error", onErrorHandlerAPI);
    GETRequest.send();
  }
}

var onErrorHandlerAPI = function() {
  console.log("[ERROR API REQUEST]");
  console.log("responseText: " + GETRequest.statusText + " - errorType: " + GETRequest.errorType);
  successful = false;
  alert("ERROR API REQUST");
};

var onLoadHandlerAPI = function() {
  console.log("[onLoad API REQEUEST]");
  console.log("readyState: " + GETRequest.readyState);

  if(GETRequest.readyState == 4) {
    console.log(GETRequest.responseText);
    console.log("(1. Try) response headers: \n" + GETRequest.getAllResponseHeaders());

    console.log("[CHECK on HTTP Headers]");
    for (var headerName in response.headers) {
      console.log(headerName + " : " + response.headers[headerName]);
      // TODO read header - check on "btFound" header
    }
    successful = true;
  }
};

function validateAPIInfo() {
  if(getLevel() == "lvl1" || getLevel() == "lvl2") {
    return (checkIP() && checkPort());
  } else if(getLevel() == "lvl3") {
    if(getHMAC().length != 0) {
      return (checkIP() && checkPort());
    } else {
      console.log("HMAC needs to be filled");
      return false;
    }
  } else {
    return false;
  }
}

function disableInputAutofill() {
  for(element in document.getElementsByTagName("*")) {
    if(element instanceof input) {
      element.setAttribute("autocomplete", "off");
      console.log("set autocomplete OFF!");

      element.disable = true;
      console.log("element disabled");
    }
  }
}

function enableInput() {
  for(element in document.getElementsByTagName("*")) {
    if(element instanceof input) {
      element.disable = false;
      console.log("element enabled!");
    }
  }
}

function getLoginManager() {
  return loginManager;
}
