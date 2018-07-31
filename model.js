var user;
var funcret;
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var db;
var serviceResponse = {
  "response_code":0,
  "error_description":"",
  "response":null
};
var StorageHelper = {
  getUser : function() {
    var req = db.transaction("user").objectStore("user").get("user");
    req.onsuccess = function(event) {
        user =  event.target.result;
        if (funcret) funcret();
      };
    req.onerror = function(event) {
      // register user
      if (funcret) funcret();
      };
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
    StorageHelper.getUser();
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
      StorageHelper.getUser();
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
