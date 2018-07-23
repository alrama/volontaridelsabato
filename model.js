var user;
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var db;
var requestDB = window.indexedDB.open("paniniDB", 1);
var StorageHelper = {
  initUser : function() {
    var req = db.transaction("paniniweb").objectStore("paniniweb").get("user");
    req.onsuccess = function(event) {
        user =  event.target.result.name;
      };
    req.onerror = function(event) {
      // register user
      };
  }
}
requestDB.onerror = function(event) {
  alert("Attenzione, il database locale di paniniweb non può essere aperto.\nDatabase error: " + event.target.errorCode);
};
requestDB.onsuccess = function(event) {
  db = event.target.result;
  StorageHelper.initUser();
};
requestDB.onupgradeneeded = function(event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("paniniweb", { keyPath: "pweb" });
  StorageHelper.initUser();
};
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
