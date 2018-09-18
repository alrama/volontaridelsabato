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
  $resultSQL = $conn->query($sql) ;
  if ($nodo = $resultSQL->fetch_assoc()) {
  	$gruppiID = $nodo["gruppi_id"];
  	$sql = "SELECT count(*) as total from paniniweb_avvisi where gruppi_id =" . $gruppiID . " AND inserita>".$_GET["ultima_data"];
    $resultSQL = $conn->query($sql) or die($conn->error);
     if ($row = $resultSQL->fetch_assoc()) {
     	$result->response = $row["total"];
     } else $result->response = 0;
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
