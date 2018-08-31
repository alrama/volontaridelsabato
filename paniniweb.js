/* Set the width of the side navigation to 250px */
function openNav() {
    $("#mySidenav").width("250px");
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    $("#mySidenav").width("0px");
}
function showMessage(message) {
  $("#message").html(message);
  window.scrollTo(0,0);
}
function displayVolontari() {

}
function loadVolontari() {
  showMessage('Attendere. Caricamento dati in corso');
  StorageHelper.getVolontari(function() {
    if (volontari==undefined || volontari.length==0) {
      $("#message").text('Attendere. Richiesta dati remoti');
      NetworkHelper.loadVolontari(function() {
        if (volontari) {
          displayVolontari();
        } else showMessage('Errore. Impossibile ricevere la lista di volontari');
      });
    } else {
      showMessage("");
      displayVolontari();
    }
  });
}
