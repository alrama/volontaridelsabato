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
  if ($nodo = $resultSQL->fetch_assoc()) {
  	if ($nodo["admin"]) {
      $gruppiID = $nodo["gruppi_id"];
      for($i = 0, $size = count($_POST["fasi"]); $i < $size; ++$i) {
      	if (!empty($_POST["fasi"]->id)) {
	      if ($i>1) $ids.=",";
          $ids.=$_POST["fasi"][$i]->id;
        } 
      }
      $sql = "delete from paniniweb_fasi where gruppi_id =" . $gruppiID . "AND id NOT IN (".$ids.");";
      $rc = $conn->query($sql);
      foreach ($_POST["fasi"] as $fase) {
      	if ($fase->id is_null) {
	      $sql = "insert into paniniweb_fasi (gruppi_id,fase,orario,max_partecipanti) values (".$gruppiID.",'".$fase->fase."','".$fase->orario."',".$fase->max_partecipanti.");" ;
        } else {
	      $sql = "update paniniweb_fasi set fase='".$fase->fase."' orario='".$_GET["orario"]." max_partecipanti=".$fase->max_partecipanti." where id=".$fase->id." AND gruppi_id =" . $gruppiID ;
        }
      	$rc = $conn->query($sql);
      }
      if (TRUE===$rc) {
        $result->response_code = 200;
      } else {
        $result->response_code = 302;
        $result->error_description = "Errore di aggiornamento fase: " . $sql;
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
