console.log("controls.js loaded");
// IP
function getIP() {
  return document.getElementById("editIP").value;
}

function setIP(ip) {
  document.getElementById("editIP").value = ip;
}

// Port
function getPort() {
  return document.getElementById("editPort").value;
}

function setPort(port) {
  document.getElementById("editPort").value = port;
}

// TimeInterval
function updateSlider(time) {
  var text = "";

  var value = time * 15;

  var h = value / 3600;
  var min = (value % 3600) / 60;
  var sec = value % 60;

  if(sec >= 1) {
    text = text + Math.floor(sec) + "s";
  }
  if(min >= 1) {
    text = Math.floor(min) + "m " + text;
  }
  if(h >= 1) {
    text = text + Math.floor(h) + "h";
  }

  document.getElementById("chosenTime").innerHTML = text;
}

function setSlider(value) {
  document.getElementById("slTime").value = value;
}

// Level
function getLevel() {
  return document.getElementById("level").value;
}

function setLevel(level) {
  document.getElementById("level").value = level;
}

function createURL() {
  var https = "https://";
  var ref = "/checkForAuthToken?level=";
  var refHMAC = "?hmac=";

  var url = https + getIP() + ":" + getPort() + ref + getLevel().substring(getLevel().length -1, getLevel().length);
  if(getLevel() == "lvl3") {
    url += url + refHMAC + getHMAC();
  }

  console.log("[create URL]: " + url);
  return url;
}
// HMAC
function getHMAC() {
  return document.getElementById("editHmac").value;
}

function setHMAC(hmac) {
  document.getElementById("editHmac").value = hmac;
}

// validation
function checkIP() {
  var ip = getIP();
  if(ip.length == 0) {
    return false;
  } else if(ip == "localhost") {
    return true;
  } else {
    if(/^(([01]?\d\d?|2[0-4]\d|25[0-5])\.){3}([01]?\d\d?|2[0-4]\d|25[0-5])$/.test(ip)) {
      return true;
    } else {
      return false;
    }
  }
}

function checkPort() {
  var port = getPort();
  if(port.length == 0) {
    return false;
  } else {
    if(/^[0-9]+$/.test(port)) {
      return true;
    } else {
      return false;
    }
  }
}

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
