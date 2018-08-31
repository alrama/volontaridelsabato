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
class Volontario {
	public $email;
    public $nome;
    public $cognome;
    public $cellulare;
    public $registrato;
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
  	$sql = "SELECT email,nome,cognome,password,cellulare from paniniweb_users where gruppi_id = '" . $gruppiID . "' order by nome";
    $resultSQL = $conn->query($sql);
     if ($resultSQL->num_rows > 0) {
     	$i = 0;
          while($row = $resultSQL->fetch_assoc()) {
              $result->response[$i] = new Volontario();
              $result->response[$i]->email = $row["email"];
              $result->response[$i]->nome = $row["nome"];
              $result->response[$i]->cognome = $row["cognome"];
              if (strlen($row["password"])>0) $result->response[$i]->registrato = 1;
              else $result->response[$i]->registrato = 0;
              $result->response[$i++]->cellulare = $row["cellulare"];
          }
      } 
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
