var GETRequest;

window.addEventListener("load", function(event) {
  var pwdInputs = [];
  var inputs = document.getElementsByTagName("input");
  for (var i=0; i < inputs.length; i++) {
    if (inputs[i].getAttribute("type") === "password") {
      inputs[i].setAttribute("autocomplete", "off");
      inputs[i].setAttribute("disabled", "true");
      /*

        disabled
          This Boolean attribute indicates that the form control is not available for interaction.
          In particular, the click event will not be dispatched on disabled controls.
          Also, a disabled control's value isn't submitted with the form.

          => "login"-submit will fail unless the input will be anabled again
      */
      pwdInputs.push(inputs[i]);
    }
  }

  if(pwdInputs.length >= 1) {
    self.port.emit("verify");
  }

}, false);

// API/REST Call
function makeApiRequest(url) {
  if(!GETRequest) {
    GETRequest = new XMLHttpRequest();
  }
  if(GETRequest) {
    console.log("[API Request] - url: " + url);
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

      if(GETRequest.getResponseHeader("foundBT") == "true") {
        console.log("foundBT = true");

        // var forms = [];
        var inputs = document.getElementsByTagName("input");
        for(var i = 0; i < inputs.length; i++) {
          if(inputs[i].getAttribute("type") === "password" && inputs[i].getAttribute("disabled") == "true") {
            inputs[i].setAttribute("autocomplete", "on");
            inputs[i].removeAttribute("disabled");
            // var closestForm = inputs[i].closest('form');
            // forms.push(closestForm)
          }
        }
        // self.port.emit("success", forms);

      } else if(GETRequest.getResponseHeader("foundBT") == "false") {
        console.log("foundBT = false");
        self.port.on("failed", "NO Auth. BT Token found!");
      } else {
        console.log("foundBT = wtf?!");
        self.port.on("failed", "NO Auth. BT Token found!");
      }

    } else {
        // response not 200
        console.log("not 'OK - 200'");
        self.port.on("failed", "Connection to Daemon failed!\nStatus: " + GETRequest.status);
      }
    } else {
      console.log("...ups sth. went wrong");
      console.log("error code: " + GETRequest.status);
      self.port.on("failed", "...sth. went wrong");
    }
};

self.port.on("make-API-request", function(url) {
  makeApiRequest(url);
});
