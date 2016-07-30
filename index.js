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

tabs.on('ready', function (tab) {
  tab.attach({
    contentScriptFile: data.url("clientLogic.js"),
    contentScriptOptions: {
        loginManager: Cc['@mozilla.org/login-manager;1'].getService(Ci.nsILoginManager),
        obsService: Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService)
      }
  })
});
