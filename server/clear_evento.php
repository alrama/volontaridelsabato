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
  $sql = "SELECT gruppi_id,admin,email from paniniweb_users where hash = '" . $_GET["token"] . "'";
  $resultSQL = $conn->query($sql);
  if ($nodo = $resultSQL->fetch_assoc()) {
  	if ($nodo["admin"]) {
        $sql = "SELECT id from paniniweb_evento where gruppi_id = '" . $nodo["gruppi_id"] . "'";
        $resultSQL = $conn->query($sql);
        if ($nodo1 = $resultSQL->fetch_assoc()) {
          $sql = "delete from paniniweb_partecipazioni where evento_id=".$nodo1["id"];
          $rc = $conn->query($sql);
          if (TRUE===$rc) {
              $sql = "delete from paniniweb_evento where id=".$nodo1["id"];
              $rc = $conn->query($sql);
              if (TRUE===$rc) {
              	$result->response_code = 200;
              } else {
                $result->response_code = 302;
                $result->error_description = "Errore nella cancellazione:" . $sql;
              }
          } else {
            $result->response_code = 302;
            $result->error_description = "Errore nella cancellazione: " . $sql;
          }
      }
      else {
            $result->response_code = 304;
            $result->error_description = "Errore, evento non presente";
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
