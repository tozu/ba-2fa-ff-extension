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

var { Cc, Ci } = require("chrome");
var obsService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);


tabs.on('ready', function (tab) {
  var worker = tab.attach({
    contentScriptFile: data.url("clientLogic.js"),
  });
  worker.port.on("init-observer", function(message) {
    console.log("obs for url: " + tab.url);
    initObserver();
  });
});

var Observer;

function initObserver() {
  Observer = new myObserver();
}

// Observer Service and Observer for login-form
function myObserver() {
  console.log("going to register observer");
  this.register();
}
myObserver.prototype = {
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
  },
  register: function() {
    obsService.addObserver(this, "passwordmgr-found-form", false);
    console.log("registered observer");
  },
  unregister: function() {
    obsService.removeObserver(this, "passwordmgr-found-form");
    console.log("UN-registered observer");
  }
};
