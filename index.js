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
  contentScriptFile: require("sdk/self").data.url("controls.js"),
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
    contentScriptFile: data.url("clientLogic.js")
  });

  worker.port.on("verify", function() {
    console.log("(index) - verify");
    panel.port.emit("validate");
    console.log("(index -> panel) - validate");
  });

  worker.port.on("validated", function sendAPIRequestTo(url) {
    console.log("(index) - validated");
    worker.port.emit("make-API-request", url);
    console.log("(index -> cL) - validate");
  });

  worker.port.on("failed", function(reason) {
    console.log("(index) failed" + "\nReason: " + reason);
    alert("FAILED!")
  });

});
