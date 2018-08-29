<?php   header('Content-Type: application/json; charset=utf-8'); ?>
<?php 
$servername = "localhost";
$username = "alrama";
$password = "";
$dbLink = "my_alrama";
class Result {
	public $response_code;
    public $error_description;
    public $response;
}
$result = new Result();
// Create connection
$conn = new mysqli($servername, $username, $password,$dbLink);

// Check connection
if ($conn->connect_error) {
    $result->response_code = 500;
    $result->error_description = $conn->connect_error;
} 
else if (!isset($_GET["token"])) {
    $result->response_code = 300;
    $result->error_description = "Token assente";
}
else {
  mysql_query("SET character_set_results=utf8", $dbLink);
  mb_language('uni'); 
  mb_internal_encoding('UTF-8');
  mysql_set_charset("UTF8", $conn);
  $sql = "SELECT email,password,nome,cognome,telefono FROM paniniweb_temprec where hash = '" . $_GET["token"] . "'";
  $resultSQL = $conn->query($sql);
  if ($nodo = $resultSQL->fetch_assoc()) {
      $flagid = 0;
      $sql = "delete from paniniweb_temprec where email = '".$nodo["email"]."'";
      $rc = $conn->query($sql);
      if (TRUE===$rc) {
        $sql = "update paniniweb_users set hash='".$_GET["token"]."',password='".$nodo["password"]."',nome='".$nodo["nome"]."',cognome='".$nodo["cognome"]."',cellulare='".$nodo["telefono"]."' WHERE email = '".$nodo["email"]."'";
        $rc = $conn->query($sql);
      	if (TRUE===$rc) {
          $result->response_code = 200;
          $result->response = $_GET["token"];
        } else {
          $result->response_code = 302;
          $result->error_description = "Attenzione, registrazione non completata";
        }
      } else {
        $result->response_code = 301;
        $result->error_description = "Attenzione, registrazione non riconosciuta.";
      }
  }
  $conn->close();
}
echo json_encode($result);
exit();
?>
