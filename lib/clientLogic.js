var { Cc } = require("chrome"); // throws error
var GETRequest;

var URL;
var successful;

// Taken from: https://developer.mozilla.org/en-US/Add-ons/Code_snippets/On_page_load
var clientLogic = {
  init: function() {
    if(gBrowser) {
      gBrowser.addEventListener("DOMContentLoaded", this.onPageLoad, false);
    }
  },
  onPageLoad: function(event) {
    // addObeserver to lookout for forms
    os.addObserver(FormObserver, "passwordmgr-found-form", false);
  }
};

window.addEventListener("load", function load(event) {
  window.removeEventListener("load", load, false); // remove EventListener, no longer needed
  clientLogic.init();
}, false);

// Observer Service and Observer for login-form
var os = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
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

// TODO TEST (semi-tested)
var onErrorHandlerAPI = function() {
  console.log("[ERROR API REQUEST]");
  console.log("responseText: " + GETRequest.statusText + " - errorType: " + GETRequest.errorType);
  successful = false;
  alert("ERROR API REQUST");
};

// TODO TEST (semi-tested)
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

// API URL and Info validation - (TESTED)
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

// secure inputs - TODO TEST
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

// TODO TEST
function enableInput() {
  for(element in document.getElementsByTagName("*")) {
    if(element instanceof input) {
      element.disable = false;
      console.log("element enabled!");
    }
  }
}

// Login manager
function getLoginManager() {
  return Components.classes['@mozilla.org/login-manager;1'].getService(Components.interfaces.nsILoginManager);
}
