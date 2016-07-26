/*
  TODO:
  [X]  HTTPS GET Request
  [ ]  read response headers
        search for "found BT"
  [ ]  "HOOK" mozilla password manager

*/

var { ToggleButton } = require("sdk/ui/button/toggle");
var panels = require("sdk/panel");
var self = require("sdk/self");

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
  contentURL: self.data.url("panel.html"),
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
