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
      $gruppiID = $nodo["gruppi_id"];
      for($i = 0, $size = count($fasi); $i < $size; ++$i) {
      	if (!empty($fasi[$i]["id"])) {
	      if ($i>0) $ids.=",";
          $ids.=$fasi[$i]["id"];
        } 
      }
      $sql = "delete from paniniweb_fasi where gruppi_id =" . $gruppiID . "AND id NOT IN (".$ids.");";
      $sql .= "delete from paniniweb_partecipazioni where gruppi_id =" . $gruppiID . "AND fase_id NOT IN (".$ids.");";
      $rc = $conn->multi_query($sql);
      foreach ($fasi as $fase) {
      	if (is_null($fase["id"])) {
	      $sql = "insert into paniniweb_fasi (gruppi_id,fase,orario,max_partecipanti) values (".$gruppiID.",'".$fase["fase"]."','".$fase["orario"]."',".$fase["max_partecipanti"].");" ;
        } else {
	      $sql = "update paniniweb_fasi set fase='".$fase["fase"]."', orario='".$fase["orario"]."', max_partecipanti=".$fase["max_partecipanti"]." where id=".$fase["id"]." AND gruppi_id=" . $gruppiID ;
        }
      	$rc = $conn->query($sql);
      }
      if (TRUE===$rc) {
        $result->response_code = 200;
      } else {
        $result->response_code = 302;
        $result->error_description = "Errore di aggiornamento fase: " .$sql."-". mysqli_error($conn) ;
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
