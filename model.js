var user;
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var db;
var serviceResponse = {
  "response_code":0,
  "error_description":"",
  "response":null
};
var StorageHelper = {
  getUser : function(funcret) {
    var req = db.transaction("user").objectStore("user").get(1);
    req.onsuccess = function(event) {
      user = event.target.result;
      if (funcret) funcret();
    };
    req.onerror = function(event) {
      if (funcret) funcret();
    }
  },
  saveUser : function(funcret) {
    var objStr = db.transaction("user","readwrite").objectStore("user");
    var insUser = function(event) {
      user.id = 1;
      var reqIns = objStr.put(user);
      reqIns.onsuccess = function(event) {
        if (funcret) funcret();
      }
      reqIns.onerror = function(event) {
        if (funcret) funcret();
      }
    };
    var reqClear = objStr.clear();
    reqClear.onsuccess = insUser(event);
    reqClear.onerror = insUser(event);
  },
  clearUser : function(funcret) {
    var objStr = db.transaction("user","readwrite").objectStore("user");
    var reqClear = objStr.clear();
    reqClear.onsuccess = function(event) {if (funcret) func();};
    reqClear.onerror = function(event) {if (funcret) func();};
  }
}
initModel = function(func) {
  var requestDB = window.indexedDB.open("paniniDB", 1);
  requestDB.onerror = function(event) {
    alert("Attenzione, il database locale di paniniweb non può essere aperto.\nDatabase error: " + event.target.errorCode);
  };
  requestDB.onsuccess = function(event) {
    db = event.target.result;
    StorageHelper.getUser(func);
  };
  requestDB.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("user",{ keyPath: "id" });
    var objectStore = db.createObjectStore("evento", { keyPath: "id" });
    var objectStore = db.createObjectStore("volontari", { keyPath: "email" });
    objectStore.createIndex("nome", "nome", { unique: false });
    objectStore.createIndex("cognome", "cognome", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });
    objectStore.transaction.oncomplete = function(event) {
      StorageHelper.getUser(func);
    };
  };
}
function Volontario() {
  this.email="";
  this.nome= "";
  this.cognome="";
  this.cellulare="";
  this.password="";
  this.admin;false;
}
function evento() {
  ;
}
