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
    var objectStore = db.transaction("user").objectStore("user");
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        user = cursor.value;
        if (funcret) funcret();
      }
      else {
        if (funcret) funcret();
      }
    };
  },
  saveUser : function(func) {
    var objStr = db.transaction("user","readwrite").objectStore("user");
    var insUser = function(event) {
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
  }
}
initModel = function(func) {
  funcret = func;
  var requestDB = window.indexedDB.open("paniniDB", 2);
  requestDB.onerror = function(event) {
    alert("Attenzione, il database locale di paniniweb non può essere aperto.\nDatabase error: " + event.target.errorCode);
  };
  requestDB.onsuccess = function(event) {
    db = event.target.result;
    StorageHelper.getUser(func);
  };
  requestDB.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("user");
    var objectStore = db.createObjectStore("evento");
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
