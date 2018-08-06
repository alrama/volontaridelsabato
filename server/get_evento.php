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
class Evento {
	public $data_evento;
    public $fasi;
    public $partecipazioni;
}
class Fase {
	public $id;
	public $fase;
    public $sequenza;
}
class Partecipazione {
	public $email;
    public $fase_id;
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
  $sql = "SELECT gruppi_id from paniniweb_users where hash = '" . $_GET["token"] . "'";
  $resultSQL = $conn->query($sql);
  if ($nodo = $resultSQL->fetch_assoc()) {
  	$gruppiID = $nodo["gruppi_id"];
    $evento = new Evento();
  	$sql = "SELECT data_evento,id from paniniweb_evento where gruppi_id = '" . $gruppiID . "'";
    $resultSQL = $conn->query($sql);
    if ($nodo = $resultSQL->fetch_assoc()) {
      $evento->data_evento = $nodo["data_evento"];
      $evento_id = $nodo["id"];
      $sql = "SELECT email,fase_id from paniniweb_partecipazioni where evento_id = '" . $evento_id . "'";
      $resultSQL = $conn->query($sql);
      $i = 0;
      if ($resultSQL->num_rows > 0) {
          while($row = $resultSQL->fetch_assoc()) {
              $evento->partecipazioni[$i] = new Partecipazione();
              $evento->partecipazioni[$i]->fase_id = $row["fase_id"];
              $evento->partecipazioni[$i++]->email = $row["email"];
          }
      } 
    }
    $sql = "SELECT id,fase,sequenza from paniniweb_fasi where gruppi_id = '" . $gruppiID . "' ORDER BY sequenza ASC";
    $resultSQL = $conn->query($sql);
    $i = 0;
    if ($resultSQL->num_rows > 0) {
        while($row = $resultSQL->fetch_assoc()) {
            $evento->fasi[$i] = new Fase();
            $evento->fasi[$i]->id = $row["id"];
            $evento->fasi[$i]->fase = $row["fase"];
            $evento->fasi[$i++]->sequenza = $row["sequenza"];
        }
    } 
    $result->response_code = 200;
    $result->response = $evento;
  } else {
        $result->response_code = 300;
        $result->error_description = "Accesso non autorizzato";
  }
  $conn->close();
}
echo json_encode($result);
exit();
?>
