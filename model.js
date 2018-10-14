var user;
function userHaDeleghe() {
  return user.deleghe!=undefined && user.deleghe!=null && user.deleghe!="";
}
var evento = {
  data_evento: null,
  fasi: null,
  partecipazioni:null
};
var partecipazione = {
	email: null,
  fase_id: null,
  evento_id: null
}
var avvisi;
function formatDataEvento() {
  var giorno = evento.data_evento.substring(8,10);
  var mese = evento.data_evento.substring(5,7);
  return giorno + "/" + mese;
};
function aggiungiPartecipante(fase_id,email) {
  partecipazione.fase_id = fase_id;
  partecipazione.email = email;
  partecipazione.evento_id = evento.evento_id;
  if (evento.partecipazioni==null) evento.partecipazioni = []
  evento.partecipazioni.push(partecipazione);
}
function Volontario() {
  this.email="";
  this.nome= "";
  this.cognome="";
  this.cellulare="";
  this.password="";
  this.admin;false;
  this.deleghe="";
}
function Fase(sequenza) {
  this.orario = "00:00";
  this.max_partecipanti=0;
  this.fase="";
  this.sequenza = sequenza;
}
var volontari;
function findVolontario(email) {
  for (var i=0;i<volontari.length;i++) {
    if (volontari[i].email==email)
      return volontari[i];
  }
  return null;
}
function isDelegato(volontario,email) {
  if (volontario.deleghe===undefined || volontario.deleghe===null || volontario.deleghe==="") return false;
  return volontario.deleghe.indexOf(email)>-1;
}
function isPartecipante(fase_id,email) {
  if (!evento.partecipazioni) return false;
  var ret = false;
  for (var i = 0; i< evento.partecipazioni.length;i++) {
    if (evento.partecipazioni[i].fase_id==fase_id && evento.partecipazioni[i].email==email) {
      ret=true;
      break;
    }
  }
  return ret;
}
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var db;
var serviceResponse = {
  response_code:0,
  error_description:"",
  response:null
};
var NetworkHelper = {
  getDeleghe : function() {
    var urlserver = "server/get_deleghe.php?token="+user.hash;
    $.ajax({
      url : urlserver,
      type : 'GET',
      success : function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            user.deleghe = serviceResponse.response;
            StorageHelper.saveUser();
          }
        }
      },
      error : function(data) {
        if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror("Errore di rete");
      }
    });
  },
  updateDeleghe : function(delegato,callback) {
    var urlserver = "server/update_deleghe.php?token="+user.hash+"&email="+delegato.email+"&deleghe="+delegato.deleghe;
    $.ajax({
      url : urlserver,
      type : 'GET',
      success : function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            if (typeof callback === 'object' && typeof callback.onsuccess === 'function') callback.onsuccess();
          } else if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror(serviceResponse.error_description);
        } else {
          if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror("Errore di risposta del servizio");
        }
      },
      error : function(data) {
        if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror("Errore di rete");
      }
    });
  },
  sendFasi : function(callback) {
    var urlserver = "server/update_fasi.php?token="+user.hash;
    $.ajax({
      url : urlserver,
      type : 'POST',
      data : {'fasi':JSON.stringify(evento.fasi)},
      success : function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            if (typeof callback === 'object' && typeof callback.onsuccess === 'function') callback.onsuccess();
          } else if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror(serviceResponse.error_description);
        } else {
          if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror("Errore di risposta del servizio");
        }
      },
      error : function(data) {
        if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror("Errore di rete");
      }
    });
  },
  sendAvviso : function(avviso,callback) {
    var urlserver = "server/put_avviso.php?token="+user.hash;
    $.ajax({
      url : urlserver,
      type : 'POST',
      data : {'testo':avviso},
      success : function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            for (var i=0;i<avvisi.length;i++)
              StorageHelper.saveAvviso(avvisi[i]);
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
  getAvvisi : function(ultima_data,callback) {
    var urlserver = "server/get_avvisi.php?token="+user.hash+"&ultima_data="+ultima_data;
    $.ajax({
      url : urlserver,
      type : 'GET',
      success : function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            avvisi = serviceResponse.response;
            for (var i=0;i<avvisi.length;i++)
              StorageHelper.saveAvviso(avvisi[i]);
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
  getNumAvvisi : function(ultima_data,callback) {
    var urlserver = "server/get_numavvisi.php?token="+user.hash+"&ultima_data="+ultima_data;
    $.ajax({
      url : urlserver,
      type : 'GET',
      success : function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            if (typeof callback === 'object' && typeof callback.onsuccess === 'function') callback.onsuccess(serviceResponse.response);
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
  aggiornaFase : function(fase_id,orario,callback) {
    var urlserver = "server/update_fase.php?token="+user.hash+"&fase_id="+fase_id+"&orario="+orario;
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
  removeEvento : function(callback) {
    var urlserver = "server/clear_evento.php?token="+user.hash;
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
  removePartecipante : function(fase_id,email,callback) {
    var urlserver = "server/remove_partecipante.php?token="+user.hash+"&email="+email+"&fase_id="+fase_id;
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
  sendPartecipante : function(fase_id,email,callback) {
    var urlserver = "server/add_partecipante.php?token="+user.hash+"&email="+email+"&fase_id="+fase_id;
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
  loadEvento : function(callback) {
    $.ajax({
      url: "server/get_evento.php?token="+user.hash,
      type: 'GET',
      success: function(data) {
        serviceResponse = data;
        if (serviceResponse.response_code) {
          if (serviceResponse.response_code==200) {
            evento = serviceResponse.response;
            if (evento.data_evento) StorageHelper.saveEvento();
            if (typeof callback === 'object' && typeof callback.onsuccess === 'function') callback.onsuccess();
          } else if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
        } else {
          if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
        }
      },
      error : function(data) {
        if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
      }
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
  saveAvviso : function(avviso,callback) {
    var trx = db.transaction("avvisi","readwrite");
    var objStr = trx.objectStore("avvisi");
    objStr.put(avviso);
  },
  deleteAvviso : function(inserito) {
    var trx = db.transaction("avvisi","readwrite");
    var objStr = trx.objectStore("avvisi");
    var reqClear = objStr.delete(inserito);
  },
  getAvvisi : function(funcret) {
    var req = db.transaction("avvisi").objectStore("avvisi").openCursor(null,'prev');
    avvisi = [];
    req.onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        avvisi.push(cursor.value);
        cursor.continue();
      }
      else if (funcret) funcret();
    };
    req.onerror = function(event) {
      if (funcret) funcret();
    }
  },
  aggiornaVolontario : function(volontario) {
    var trx = db.transaction("volontari","readwrite");
    var objStr = trx.objectStore("volontari");
    objStr.put(volontario);
  },
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
  clearVolontari : function(callback) {
    var trx = db.transaction("volontari","readwrite");
    var objStr = trx.objectStore("volontari");
    var reqClear = objStr.clear();
  },
  saveVolontari : function(callback) {
    var trx = db.transaction("volontari","readwrite");
    var objStr = trx.objectStore("volontari");
    var insVolontari = function(event) {
      if (typeof callback === 'object' && typeof callback.onsuccess === 'function')
        trx.oncomplete = callback.onsuccess;
      for (var i=0; i<volontari.length; i++) {
        volontari[i].id = i;
        objStr.put(volontari[i]);
      }
    };
    var reqClear = objStr.clear();
    reqClear.onsuccess = insVolontari;
    reqClear.onerror = insVolontari;
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
  clearEvento : function(callback) {
    var objStr = db.transaction("evento","readwrite").objectStore("evento");
    var reqClear = objStr.clear();
    reqClear.onsuccess = function(event) {
      if (typeof callback === 'object' && typeof callback.onsuccess === 'function') callback.onsuccess();
    }
    reqClear.onerror = function(event) {
      if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();
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
    reqClear.onsuccess = insEvento;
    reqClear.onerror = insEvento;
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
    insUser();
  },
  clearUser : function(funcret) {
    var objStr = db.transaction("user","readwrite").objectStore("user");
    var reqClear = objStr.clear();
    reqClear.onsuccess = function(event) {if (funcret) func();};
    reqClear.onerror = function(event) {if (funcret) func();};
  }
}
initModel = function(func) {
  var requestDB = window.indexedDB.open("paniniDB", 4);
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
    if (event.oldVersion < 4) {
      objectStore = db.createObjectStore("avvisi", { keyPath: "inserito" });
    }
  };
}
