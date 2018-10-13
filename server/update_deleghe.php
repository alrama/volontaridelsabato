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
    $result->error_description = "Accesso non autorizzato";
}
else {
  mysql_query("SET character_set_results=utf8", $dbLink);
  mb_language('uni'); 
  mb_internal_encoding('UTF-8');
  mysql_set_charset("UTF8", $conn);
  $sql = "SELECT gruppi_id,admin from paniniweb_users where hash = '" . $_GET["token"] . "'";
  $resultSQL = $conn->query($sql);
  $fasi = json_decode($_POST["fasi"],true);
  if ($nodo = $resultSQL->fetch_assoc()) {
  	if ($nodo["admin"]) {
	  $sql = "update paniniweb_users set deleghe='".$_GET["deleghe"]."' where email='".$_GET["email"]."' AND gruppi_id=" . $nodo["gruppi_id"] .";" ;
      $rc = $conn->query($sql);
      if (TRUE===$rc) {
        $result->response_code = 200;
      } else {
        $result->response_code = 302;
        $result->error_description = "Errore di aggiornamento utente: " .$sql."-". mysqli_error($conn) ;
      }
    } else {
        $result->response_code = 301;
        $result->error_description = "Non abilitato alle modifiche";
    }
  } else {
        $result->response_code = 300;
        $result->error_description = "Accesso non autorizzato";
  }
  $conn->close();
}
echo json_encode($result);
exit();
?>
