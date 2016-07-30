var GETRequest;

var URL;
var successful;

var os = self.options.obsService;
var loginManager = self.options.loginManager;

// Observer Service and Observer for login-form
var FormObserver = {
  observe: function(subject, topic, data) {

    if(topic == "passwordmgr-found-form") {
      console.log("++++++++++ FOUND FORM! ++++++++++");
      console.log("data: " + data);
      disableInputAutofill();
      if(validateAPIInfo()) {
          makeAPIRequest();
      } else {
        alert("Couldn't validate API URL and required information");
      }

      if(successful) {
        getLoginManager().fillForm(subject);
        console.log("filled form with login info");

        enableInput(); // re-enable Inputs
        alert("filled form with login info and re-enabled Input");
      } else {
        console.log("couldn't fill form with login info");
      }
    }
  }
};

window.addEventListener("load", function load(event) {
  window.removeEventListener("load", load, false); // remove EventListener, no longer needed
  clientLogic.init();
}, false);

var clientLogic = {
  init: function() {
    document.addEventListener("DOMContentLoaded", this.onPageLoad, false);
    console.log("init... - added EventListener");
  },
  onPageLoad: function(event) {
    console.log("added observer");
    os.addObserver(FormObserver, "passwordmgr-found-form", false);
  }
};

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
