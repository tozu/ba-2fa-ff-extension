import ( validateAPIInfo, getLevel, getHMAC ) from './data/controls';
/*
  TODO:
  [X]  HTTPS GET Request
  [ ]  read response headers
        search for "found BT"
  [ ]  "HOOK" mozilla password/login manager

*/

var { ToggleButton } = require("sdk/ui/button/toggle");
var panels = require("sdk/panel");
var data = require("sdk/self").data;
var tabs = require("sdk/tabs");

var button = ToggleButton({
  id: "toogle-button",
  label: "Bluetooth Proximity",
  icon: {
    "16" : "./icons/icon-16.png",
    "32" : "./icons/icon-32.png",
    "64" : "./icons/icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: data.url("panel.html"),
  onHide: handleHide
})

function handleChange(state) {
  if(state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

var { Cc, Ci } = require('chrome');
var loginManager = Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager);

tabs.on('ready', function (tab) {
  var worker = tab.attach({
    contentScriptFile: data.url("clientLogic.js"),
  });

  // received no. of input
  worker.port.on("pwdinput", function(noInput) {
    if(noInput >= 1) {
      console.log("going to make API request");
      if(validateAPIInfo()) {                                 // TODO call validateAPIInfo
        console.log("could call function/validated");
        let info = {url: createURL(), level: getLevel(), hmac: getHMAC()};
        worker.port.emit("make-API-request", info);
      } else {
        // console.log("validation failed");
        alert("Could NOT validate URL, Port (and HMAC)!");
      }
    }
  });

  // received result and inputs
  worker.port.on("success", function(result) {
    if(result.success) {
      enableInput();                                          // TODO call enableInput
      loginManager.fillForm(result.formInput);
      /*
        boolean fillForm(in nsIDOMHTMLFormElement aForm);
      */
    } else {
      alert("No authenticated BT Token found!\nAccess denied!");
    }
  });
});
