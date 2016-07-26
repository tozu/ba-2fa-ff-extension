var GETRequest;

var URL;
var successfull;
var foundBT = false;

function doStuff() {
  if(validateInput()) {
    URL = createURL();
    makeRequest();
    if(successfull) {
        alert("YES! ;)"); // act depending on result
    } else {
      alert("NOOOOOPE!"); // alert user on error
    }
  }
}

function makeRequest() {
  if(!GETRequest) {
    GETRequest = new XMLHttpRequest();
  }
  if(GETRequest) {
    console.log("[made Request]");
    GETRequest.open('GET', URL);

    // GETRequest.onerror = errorHandler;
    // GETRequest.onreadystatechange = stateHandler;

    GETRequest.addEventListener("load", stateHandler);
    GETRequest.addEventListener("error", errorHandler);

    // TODO certificate validation

    GETRequest.send();
  }
}

function completed(response) {
  console.log("[onComplete]");

  for (var headerName in response.headers) {
    console.log(headerName + " : " + response.headers[headerName]);
  }
}

var errorHandler = function() {
  console.log("[errorHandler]");
  console.log("responseText: " + GETRequest.statusText + " - errorType: " + GETRequest.errorType);
  successfull = false;
}

var stateHandler = function() {
  console.log("[stateHandler]");
  console.log("readyState: " + GETRequest.readyState);

  if(GETRequest.readyState == 4) {
    console.log(GETRequest.responseText);
    console.log("response headers: \n" + GETRequest.getAllResponseHeaders());

    // TODO read header - check on "btFound" header

    successfull = true;
  }
}

function validateInput() {
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

var getLoginManager = function() {
  return Components.classes['@mozilla.org/login-manager;1']
      .getService(Components.interfaces.nsILoginManager);
}

function checkOnLogins() {
  // TODO hostname, actionURL, httpRealm
  return getLoginManager.countLogins(hostname, actionURL, httpRealm);
}


function init() {
  preventAutofillAndDisable();
  // disable input fields

  // check if site has >saved< logins
  if(checkOnLogins() > 0) {
      makeRequest();  // exec BT Query
      if(successfull) { // check success
        if(foundBT) {  // check on result - TODO set TRUE
          enableInput();
          // TODO fill Login credentials using loginManager
        } else {
          // no BT devices found -> prevent login!
        }
      }
  }
}

// check if is about to Login
// HOOOOW?! -> check on <input type="submit"> ???

function preventAutofillAndDisable() {
  for(element in document.getElementsByTagName("*")) {
    if(element instanceof input) {
      element.setAttribute("autocomplete", "off");
      console.log("set autocomplete OFF! ;)")

      element.disable = true;
      console.log("element disabled :P");
    }
  }

  /*
    Other solution:

    // https://airvpn.org/topic/15769-how-to-harden-firefox-extreme-edition/
    // 0814: disable auto-filling username & password form fields (can leak in cross-site forms AND be spoofed) - http://kb.mozillazine.org/Signon.autofillForms
    // password will still be set after the user name is manually entered - SECURITY

    // HOW TO SET ??? needs to be set in "user.js"
    user_pref("signon.autofillForms", false);
    lockPref("signon.rememberSignons", false);

    // OR !
    // iterate through all html fields, search for input and forms -> set autocomplete = false == somewhat eligible...
  */
}

function enableInput() {
  for(element in document.getElementsByTagName("*")) {
    if(element instanceof input) {
      element.disable = false;
      console.log("element enabled!");
    }
}

var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
