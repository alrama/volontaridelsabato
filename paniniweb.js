/* Set the width of the side navigation to 250px */
function openNav() {
    $("#mySidenav").width("250px");
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    $("#mySidenav").width("0px");
}
var postInit = function(){
  if (user==undefined)
    location.replace("./login.html");
  else location.replace("./evento.html");
};
initModel(postInit);
