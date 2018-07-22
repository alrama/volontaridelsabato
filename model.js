window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var db;
var requestDB = window.indexedDB.open("paniniDB", 1);
requestDB.onerror = function(event) {
  alert("Attenzione, il database locale di paniniweb non può essere aperto.\nDatabase error: " + event.target.errorCode);
};
requestDB.onsuccess = function(event) {
  db = event.target.result;
};
var StorageHelper = {
  initUser : function(user) {
    db.transaction("user").objectStore("user").get("user").onsuccess = function(event) {
      user =  event.target.result.name;
    };
  }
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
var user;
StorageHelper.initUser(user);
