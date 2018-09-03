var user;
var evento = {
  data_evento: null,
  fasi: null,
  partecipanti:null
};
function Volontario() {
  this.email="";
  this.nome= "";
  this.cognome="";
  this.cellulare="";
  this.password="";
  this.admin;false;
}
var volontari;
function findVolontario(email) {
  for (i=0;i<volontari.length;i++) {
    if (volontari[i].email==email)
      return volontari[i];
  }
  return null;
}
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var db;
var serviceResponse = {
  response_code:0,
  error_description:"",
  response:null
};
var NetworkHelper = {
  loadVolontari : function(funcret) {
    $.ajax({
      url: "server/get_volontari.php?token="+user.hash,
      type: 'GET',
      success: function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            volontari = serviceResponse.response;
            StorageHelper.saveVolontari();
          }
        } /* else network error */
        if (funcret) funcret();
      },
      error: function(data) {if (funcret) funcret();}
    })
  },
  sendVolontario : function(volontario,callback) {
    var urlserver = "server/put_volontario.php?token="+user.hash+"&email="+
      volontario.email+"&nome="+volontario.nome+"&cognome="+volontario.cognome+
      "&admin="+volontario.admin;
    $.ajax({
      url : urlserver,
      type : 'GET',
      success : function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            if (typeof callback === 'object' && typeof callback.onsuccess === 'function') callback.onsuccess();
          } else if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
        } else {
          if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
        }
      },
      error : function(data) {
        if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
      }
    });
  },
  deleteVolontario : function(email,callback) {
    var urlserver = "server/remove_volontario.php?token="+user.hash+"&email="+email;
    $.ajax({
      url : urlserver,
      type : 'GET',
      success : function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            if (typeof callback === 'object' && typeof callback.onsuccess === 'function') callback.onsuccess();
          } else if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
        } else {
          if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
        }
      },
      error : function(data) {
        if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
      }
    });
  },
  loadEvento : function(funcret) {
    $.ajax({
      url: "server/get_evento.php?token="+user.hash,
      type: 'GET',
      success: function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            evento = serviceResponse.response;
            if (evento.data) StorageHelper.saveEvento();
          }
        } /* else network error */
        if (funcret) funcret();
      },
      error: function(data) {if (funcret) funcret();}
    })
  },
  sendEvento : function(callback) {
    var urlserver = "server/put_evento.php?token="+user.hash+"&evento="+evento.data_evento;
    $.ajax({
      url : urlserver,
      type : 'GET',
      success : function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            if (typeof callback === 'object' && typeof callback.onsuccess === 'function') callback.onsuccess();
          } else if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
        } else {
          if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
        }
      },
      error : function(data) {
        if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
      }
    });
  }
};
var StorageHelper = {
  getVolontari : function(funcret) {
    var req = db.transaction("volontari").objectStore("volontari").openCursor();
    volontari = [];
    req.onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        volontari.push(cursor.value);
        cursor.continue();
      }
      else if (funcret) funcret();
    };
    req.onerror = function(event) {
      if (funcret) funcret();
    }
  },
  saveVolontari : function(callback) {
    var trx = db.transaction("volontari","readwrite");
    var objStr = trx.objectStore("volontari");
    var insVolontari = function(event) {
      if (typeof callback === 'object' && typeof callback.onsuccess === 'function')
        trx.oncomplete = callback.onsuccess;
      for (i=0; i<volontari.length; i++) {
        volontari[i].id = i;
        objStr.put(volontari[i]);
      }
    };
    var reqClear = objStr.clear();
    reqClear.onsuccess = insVolontari(event);
    reqClear.onerror = insVolontari(event);
  },
  getEvento : function(funcret) {
    var req = db.transaction("evento").objectStore("evento").get(1);
    req.onsuccess = function(event) {
      evento = event.target.result;
      if (funcret) funcret();
    };
    req.onerror = function(event) {
      if (funcret) funcret();
    }
  },
  saveEvento : function(callback) {
    var objStr = db.transaction("evento","readwrite").objectStore("evento");
    var insEvento = function(event) {
      evento.id = 1;
      var reqIns = objStr.put(evento);
      reqIns.onsuccess = function(event) {
        if (typeof callback === 'object' && typeof callback.onsuccess === 'function') callback.onsuccess();
      }
      reqIns.onerror = function(event) {
        if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
      }
    };
    var reqClear = objStr.clear();
    reqClear.onsuccess = insEvento(event);
    reqClear.onerror = insEvento(event);
  },
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
    if (event.oldVersion < 1) {
      var objectStore = db.createObjectStore("user",{ keyPath: "id" });
      objectStore = db.createObjectStore("evento", { keyPath: "id" });
      objectStore = db.createObjectStore("volontari", { keyPath: "id" });
      objectStore.createIndex("nome", "nome", { unique: false });
      objectStore.createIndex("cognome", "cognome", { unique: false });
      objectStore.createIndex("email", "email", { unique: true });
      objectStore.transaction.oncomplete = function(event) {
        StorageHelper.getUser(func);
      };
    }
  };
}
