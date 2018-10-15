<?php   header('Content-Type: application/json; charset=utf-8'); ?>
<?php 
function removeDelega($email,$deleghe) {
	$ar_deleghe = explode(';',$deleghe);
    $newAr_deleghe = "";
    for ($i = 0, $j = count($ar_deleghe); $i < $j; $i++) {
    	if ($ar_deleghe[$i]!==$email) {
        	if (strlen($newAr_deleghe)==0) $newAr_deleghe=$ar_deleghe[$i];
            else $newAr_deleghe.= ';' . $ar_deleghe[$i];
        }
    }
    return $newAr_deleghe;
}
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
else if (!isset($_GET["email"])) {
    $result->response_code = 304;
    $result->error_description = "email non specificata";
}
else {
  mysql_query("SET character_set_results=utf8", $dbLink);
  mb_language('uni'); 
  mb_internal_encoding('UTF-8');
  mysql_set_charset("UTF8", $conn);
  $sql = "SELECT gruppi_id,admin from paniniweb_users where hash = '" . $_GET["token"] . "'";
  $resultSQL = $conn->query($sql);
  if ($nodo = $resultSQL->fetch_assoc()) {
  	if ($nodo["admin"]) {
      $sql = "delete from paniniweb_users where email='".$_GET["email"]."'";
      $rc = $conn->query($sql);
      if (TRUE===$rc) {
          $sql = "SELECT email,deleghe from paniniweb_users where gruppi_id = '" . $nodo["gruppi_id"] . "' AND deleghe LIKE '%".$_GET["email"]."%'";
          $resultSQL = $conn->query($sql);
          $result->response = "";
          if ($resultSQL->num_rows > 0) {
            while($row = $resultSQL->fetch_assoc()) {
              $sql = "UPDATE paniniweb_users set deleghe='". removeDelega($_GET["email"],$row['deleghe']) ."' where gruppi_id =" . $nodo["gruppi_id"] . " AND email='".$row["email"]."';";
              $result->response.=$sql;
              $rc2 = $conn->query($sql);
            }
          }
	      $result->response_code = 200;
      } else {
        $result->response_code = 302;
        $result->error_description = "Errore nella cancellazione del volontario: " . $sql;
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
