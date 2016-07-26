/*
function badCertListener() {}
badCertListener.prototype = {
  getInterface: function(aIID) {
    return this.QueryInterface(aIID)
  },
  QueryInterface: function(aIID) {
    if(aIID.equals(Ci.nsIBadCertListener2) || aIID.equals(Ci.nsIInterfaceRequestor) || aIID.equals(Ci.nsISupports)) {
        return this;
    }
    throw Cr.NS_ERROR_NO_INTERFACE
  }
}

function connectAndCheck() {
  if(!GETRequest)
    GETRequest = new XMLHttpRequest();

  if(GETRequest) {
    try {
      console.log("[try]")
      GETRequest.open('GET', URL);
      // GETRequest.onreadystatechange = getHeaders;

      GETRequest.onerror = errorHandler;

      GETRequest.channel.notificationCallbacks = new badCertListener();
      GETRequest.send();
    } catch (e) {
      console.log("[catch]");
      // We *expect* exceptions if there are problems with the certificate presented by the site
      Cu.reportError("Attempted to connect to a site with a bad certificate in the add exception dialog. "
          + "This results in a (mostly harmless) exception being thrown. "
          + "Logged for information purposes only: " + e);
      addException();
    }
  }
}

var errorHandler = function(xhr, errorType, exception) {
  // console.log("HTTPError: " + e.target.responseText);
  console.log("responseText: " + GETRequest.statusText + " - errorType: " + GETRequest.errorType);
}

function getHeaders() {
  console.log("[get Headers]");
  if(GETRequest.readyState == 4) {
    console.log(GETRequest.responseText);
    console.log("response headers: \n" + GETRequest.getAllResponseHeaders());
  }
};

function addException() {
  console.log("[add Exception]");

  var certdbService = Cc['@mozilla.org/security/x509certdb;1'].getService(Ci.nsIX509CertDB) // nsIX509CertDB2 ?!
  var scriptabeleStream = Cc["@mozilla.org/scriptableinputstream;1"].getService(Ci.nsIScriptableInputStream);
  var channel = gIOService.newChannel("chrome://btproximityextension/content/certs" + CertName, null, null);    // chrome://packagename/section/path/to/file

  var input = channel.open();
  scriptabeleStream.init(input);
  var certFile = scriptabeleStream.read(input.available());
  scriptabeleStream.close();
  input.close();

  var beginCert = "-----BEGIN CERTIFICATE-----";
  var endCert = "-----END CERTIFICATE-----";

  certFile = certFile.replace(/[\r\n]/g,""); // regex to remove carriage returns and newline
  var begin = certFile.indexOf(beginCert);
  var end = certFile.indexOf(endCert);
  var cert = certFile.substring(begin + beginCert.length, end);
  certdbService.addCertFromBase64(base64, "TCu,TCu,TCu", 'UCICA - UCI')
  console.log("[added Cert ;)]");
}

*/

// ============================= original =============================
// --------------------------- WEBSITE code ---------------------------

/*
function certCheck() {
  let uri = getURI();
  let req = new XMLHttpRequest();
  try {
    if(uri) {
      req.open('GET', uri.prePath, false);
      req.channel.notificationCallbacks = new badCertListener();
      req.send();
    }
  } catch (e) {
    // We *expect* exceptions if there are problems with the certificate presented by the site
    Cu.reportError("Attempted to connect to a site with a bad certificate in the add exception dialog. "
        + "This results in a (mostly harmless) exception being thrown. "
        + "Logged for information purposes only: " + e);
    addException();
  }
}

// alread in use
function addException() {
    let certdbService = Cc['@mozilla.org/security/x509certdb;1'].getService(Ci.nsIX509CertDB)
    let base64 = 'kk' // The base64 code present on the cert, not put the code because is to long

    // TODO

    certdbService.addCertFromBase64(base64, "TCu,TCu,TCu", 'UCICA - UCI')
}

// Build and return a URI for do request
function getURI() {
  // Use fixup service instead of just ioservice's newURI since it's quite likely
  // that the host will be supplied without a protocol prefix, resulting in malformed
  // uri exceptions being thrown.
  let fus = Cc["@mozilla.org/docshell/urifixup;1"].getService(Ci.nsIURIFixup)
  let uri = fus.createFixupURI('https://cuotas.uci.cu/servicios/v1/InetCuotasWS.php?wsdl', 0)

  if (!uri) {
    return null
  } else {
    return uri
  }
}
*/

// --------------------------- MOZILLA code ---------------------------

/*
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
const gObserver = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIObserverService);
const gIOService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);

function CertsService() {}

CertsService.prototype = {
  observe: function(aSubject, aTopic, aData) {
    switch (aTopic) {
      case "app-startup":
        gObserver.addObserver(this, "xpcom-shutdown", false);
        gObserver.addObserver(this, "final-ui-startup", false);
        break;
      case "xpxom-shutdown":
        gObserver.removeObserver(this, "final-ui-startup");
        gObserver.removeObserver(this, "xpcom-shutdown");
        break;
      case "xpxom-shutdown":
        this.init();
        break;
    }
  },

  init: function() {
    // add all certificates you wannt to install here
    var certificates = "root.crt, user.crt";

    var cert = certificates.split(',');
    for(var i = 0; i < cert.length; i++) {
      this.addCertificate(certs[i], 'C,c,c');
    }
  },

  addCertificate: function(CertName, CertTrust) {
    var certDB = Cc["@mozilla.org/security/x509certdb;1"].getService(Ci.nsIX509CertDB2);
    var scriptabeleStream = Cc["@mozilla.org/scriptableinputstream;1"].getService(Ci.nsIScriptableInputStream);
    var channel = gIOService.newChannel("chrome://YOURAPP/content/certs" + CertName, null, null);

    var input = channel.open();
    scriptabeleStream.init(input);
    var certFile = scriptabeleStream.read(input.available());
    scriptabeleStream.close();
    input.close();

    var beginCert = "-----BEGIN CERTIFICATE-----";
    var endCert = "-----END CERTIFICATE-----";

    certFile = certFile.replace(/[\r\n]/g,""); // regex to remove carriage returns and newline
    var begin = certFile.indexOf(beginCert);
    var end = certFile.indexOf(endCert);
    var cert = certFile.substring(begin + beginCert.length, end);
    certDB.addCertFromBase64(cert, CertTrust, "");
  },

  classDescription: "Certificate Service",    //
  contractID: "@mozilla.org/certs-service;2",
  classID: Components.ID("{e9d2d37c-bf25-4e37-82a1-16b8fa089939}"),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver]),
  _xpcom_categories: [{
    category: "app-startup",
    service: true
  }]
}

function NSGetModule(compMgr, fileSpec) {
  return XPCOMUtils.generateModule([CertService]);
}
*/
