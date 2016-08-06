var GETRequest;
var URL;

var pwdInputs;

window.addEventListener("load", function(event) {

  pwdInputs = [];
  var inputs = document.getElementsByTagName("input");
  for (var i=0; i<inputs.length; i++) {
    if (inputs[i].getAttribute("type") === "password") {
      pwdInputs.push(inputs[i]);
    }
  }

  if(pwdInputs.length >= 1) {
    self.port.emit("verify");
  }

}, false);

// API/REST Call - TESTED
function makeApiRequest(url) {
  if(!GETRequest) {
    GETRequest = new XMLHttpRequest();
  }
  if(GETRequest) {
    console.log("[API Request]");
    console.log("url: " + url);
    GETRequest.open('GET', url);
    GETRequest.addEventListener("load", onLoadHandlerAPI);
    GETRequest.addEventListener("error", onErrorHandlerAPI);
    GETRequest.send();
  }
};

var onErrorHandlerAPI = function() {
  console.log("[API Request - ERROR]");
  console.log("- readyState: " + GETRequest.readyState);
  console.log("- status: " + GETRequest.status);
  console.log("- statusText: " + GETRequest.statusText);
  console.log("- responseText: " + GETRequest.responseText);
  console.log("- withCredentials: " + GETRequest.withCredentials);

  self.port.emit("failed", "API Call failed");
};

var onLoadHandlerAPI = function() {
  console.log("[API Request - LOAD]");
  if(GETRequest.readyState == 4) {
    if(GETRequest.status == 200) {

      console.log("[CHECK on HTTP Headers]");
      // read header
      if(GETRequest.getResponseHeader("foundBT") == "true") {
        self.port.emit("success", pwdInputs);
        // TODO forward inputs
      } else if(GETRequest.getResponseHeader("foundBT") == "false") {
        self.port.on("failed", "NO Auth. BT Token found!");
      } else {
        self.port.on("failed", "NO Auth. BT Token found!");
      }

    } else {
        // response not 200
        self.port.on("failed", "Connection to Daemon failed!\nStatus: " + GETRequest.status);
      }
    } else {
      console.log("...ups sth. went wrong");
      console.log("error code: " + GETRequest.status + " - request URL: " + URL);
      self.port.on("failed", "...sth. went wrong");
    }
};

self.port.on("make-API-request", function(url) {
  makeApiRequest(url);
});

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
