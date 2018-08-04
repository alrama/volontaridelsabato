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
      if (func) funcret();
    }
  },
  saveUser : function(func) {
    var objStr = db.transaction("user","readwrite").objectStore("user");
    var insUser = function(event) {
      user.id = 1;
      reqIns = objStr.put(user);
      reqIns.onsuccess = function(event) {
        if (func) funcret();
      }
      reqIns.onerror = function(event) {
        if (func) funcret();
      }
    };
    var reqClear = objStr.clear();
    reqClear.onsuccess = insUser(event);
    reqClear.onerror = insUser(event);
  },
  clearUser : function(func) {
    var objStr = db.transaction("user","readwrite").objectStore("user");
    var reqClear = objStr.clear();
    reqClear.onsuccess = function(event) {if (func) func();};
    reqClear.onerror = function(event) {if (func) func();};
  }
}
initModel = function(func) {
  funcret = func;
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
Volontario.prototype.setPassword = function(value) {
  this.password= value;
}
function evento() {
  ;
}
