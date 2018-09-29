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
class Avviso {
	public $inserito;
    public $testo;
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
  $resultSQL = $conn->query($sql) ;
  if ($nodo = $resultSQL->fetch_assoc()) {
  	$gruppiID = $nodo["gruppi_id"];
  	$sql = "SELECT inserita,testo from paniniweb_avvisi where gruppi_id =" . $gruppiID . " AND unix_timestamp(inserita)>unix_timestamp('".$_GET["ultima_data"]."')";
    $sql .= " ORDER BY inserita DESC;";
    $resultSQL = $conn->query($sql) or die($conn->error);
    if ($resultSQL->num_rows > 0) {
    	$i = 0;
        while($row = $resultSQL->fetch_assoc()) {
     		$result->response[$i] = new Avviso();
            $result->response[$i]->inserito = $row["inserita"];
            $result->response[$i++]->testo = $row["testo"];
        }
    } else $result->response = array();
    $result->response_code = 200;
  } else {
        $result->response_code = 300;
        $result->error_description = "Accesso non autorizzato";
  }
  $conn->close();
}
echo json_encode($result);
exit();
?>
