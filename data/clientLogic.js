var GETRequest;
var URL;

window.addEventListener("load", function(event) {
  // makePWDInputCheck
  var ary = [];
  var inputs = document.getElementsByTagName("input");
  for (var i=0; i<inputs.length; i++) {
    if (inputs[i].getAttribute("type") === "password") {
      ary.push(inputs[i]);
    }
  }

  console.log("no. of inputs: " + ary.length);
  if(ary.length >= 1) {
    self.port.emit("pwdinput", ary.length);
  }

}, false);

self.port.on("make-API-request", makeAPIRequest);

// API/REST Call - TESTED
                                                                            // TODO receive info
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
  console.log("...ups sth. went wrong");
  console.log("responseText: " + GETRequest.statusText + " - errorType: " + GETRequest.errorType);

                                                                          // TODO send result
  let result = { success: false, formInput: null };
  self.port.emit("success", result);
};

var onLoadHandlerAPI = function() {
  if(GETRequest.readyState == 4) {
    var result = { success: false, formInput: null };
    if(GETRequest.status == 200) {
      console.log("All response headers: \n\n" + GETRequest.getAllResponseHeaders() + "\n");

      console.log("[CHECK on HTTP Headers]");
      for (var headerName in response.headers) {
                                                                          // TODO read header
        console.log(headerName + " : " + response.headers[headerName]);
        if(headerName == "foundBT") {
          if(headerResponse) {
                                                                          // TODO send result.success = true and input fields
          } else {
                                                                          // TODO send result.success = false
          }
          break;
        }
      }
      self.port.emit("success", result);
    } else {
      console.log("...ups sth. went wrong");
      console.log("error code: " + GETRequest.status + " - request URL: " + URL);
      self.port.emit("success", result);
    }
  }
};

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
