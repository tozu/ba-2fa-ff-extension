/*
  TODO:
  [X]  HTTPS GET Request
  [X]  read response headers
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
  contentScriptFile: data.url("controls.js"),
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

panel.port.on("validated", function sendAPIRequestTo(url) {
  tabWorker.port.emit("make-API-request", url);
});

panel.port.on("failed", function(reason) {
  var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
  prompts.alert(null, "BT Proximity as 2nd Factor - Add-on", "Could NOT enforce 2nd Factor authentication"
    + "\nReason: " + reason);
});

var tabWorker;
tabs.on('ready', function (tab) {
  tabWorker = tab.attach({
    contentScriptFile: data.url("clientLogic.js")
  });

  tabWorker.port.on("verify", function() {
    panel.port.emit("validate");
  });

  tabWorker.port.on("failed", function(reason) {
    var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
    prompts.alert(null, "BT Proximity as 2nd Factor - Add-on", "Could NOT enforce 2nd Factor authentication"
      + "\nReason: " + reason);
  });

  tabWorker.port.on("success", function(inputs) {
    console.log("-- success" + "- inputs: " + inputs);
    console.log("len: " + inputs.length);

    var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
    prompts.alert(null, "BT Proximity as 2nd Factor - Add-on", "SUCCESS MTHFRKR!");
  });

});

// TODO loginManager

var { Cc, Ci } = require('chrome');
var loginManager = Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager);
