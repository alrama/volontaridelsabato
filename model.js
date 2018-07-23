var user;
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var db;
var requestDB = window.indexedDB.open("paniniDB", 1);
var StorageHelper = {
  initUser : function(user) {
    var request = db.transaction("global").objectStore("global").get("user");
    request.onsuccess = function(event) {
      user =  event.target.result.name;
    };
    request.onerror = function(event) {
      alert("ObjectStore:"+event);
    }
  }
}
requestDB.onerror = function(event) {
  alert("Attenzione, il database locale di paniniweb non può essere aperto.\nDatabase error: " + event.target.errorCode);
};
requestDB.onsuccess = function(event) {
  db = event.target.result;
  StorageHelper.initUser(user);
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
