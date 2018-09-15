/* Set the width of the side navigation to 250px */
function openNav() {
    $("#mySidenav").width("250px");
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    $("#mySidenav").width("0px");
}
function logout() {
  if (confirm("Uscire da "+user.email+"?")) {
    StorageHelper.clearVolontari();
    StorageHelper.clearEvento();
    StorageHelper.clearUser();
    location.href = "./login.html";
  }
}
function aggiornaFase(fase_id,orario) {
  showMessage("Invio aggiornamento");
  var req = {};
  req.onsuccess = function() {showMessage("");};
  req.onsuccess = function() {showMessage("Errore. Dati non aggiornati");};
  NetworkHelper.aggiornaFase(fase_id,orario,req);
}
function showMessage(message) {
  $("#message").html(message);
  window.scrollTo(0,0);
}
function displayVolontari() {
  showMessage("");
  var htmlcontant = "";
  for (volontario of volontari) {
    htmlcontant += "<div class='riga' onclick='dettaglio_riga(this,\""+volontario.email+"\")'><div class='textsmall'>";
    if (volontario.nome.length+volontario.cognome.length<5) {
      htmlcontant+=volontario.nome + " " + volontario.cognome + "</div>";
      htmlcontant+="<div class='textsmall'>"+volontario.email+"</div>";
    } else {
      htmlcontant+=volontario.nome + "</div>";
      htmlcontant+="<div class='textsmall dettaglio_riga'>"+volontario.cognome+"</div>";
    }
    htmlcontant+="</div>"
  }
  $("#volontari_content").html(htmlcontant);
}
function aggiornaVolontari(callback) {
  $("#message").text('Attendere. Richiesta dati remoti');
  NetworkHelper.loadVolontari(function() {
    if (volontari) {
      if (typeof callback === 'function' ) callback();
      else loadVolontari(displayVolontari);
    } else if (typeof callback === 'object' && typeof callback.onerror === 'function') callback.onerror();

  });
}
function loadVolontari(callback) {
  showMessage('Attendere. Caricamento dati in corso');
  StorageHelper.getVolontari(function() {
    if (volontari==undefined || volontari.length==0) {
      aggiornaVolontari(callback);
    } else {
      showMessage("");
      if (typeof callback === 'function' ) callback();
    }
  });
}
