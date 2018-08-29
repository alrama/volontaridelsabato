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
else if (!isset($_GET["email"]) or !isset($_GET["pwd"]) or !isset($_GET["nome"]) or !isset($_GET["cognome"])) {
    $result->response_code = 300;
    $result->error_description = "Assenti informazioni obbligatorie";
}
else {
  mysql_query("SET character_set_results=utf8", $dbLink);
  mb_language('uni'); 
  mb_internal_encoding('UTF-8');
  mysql_set_charset("UTF8", $conn);
  $sql = "SELECT email FROM paniniweb_users where email = '" . $_GET["email"] . "'";
  $resultSQL = $conn->query($sql);
  if ($nodo = $resultSQL->fetch_assoc()) {
      $flagid = 0;
      $hash_value = hash("sha256", $_GET["email"] . $_GET["pwd"]);
      $sql = "insert into paniniweb_temprec (email,hash,password,nome,cognome,telefono) VALUES ('".$_GET["email"]."','".$hash_value."','".$_GET["pwd"]."','".$_GET["nome"]."','".$_GET["cognome"]."','".$_GET["telefono"]."')";
      $rc = $conn->query($sql);
      if (TRUE===$rc) {
          mail(
            $_GET["email"],
            'Completamento della Registrazione',
            'Per completare la registrazione premere il seguente collegamento: ' .
            'http://alrama.altervista.it/paniniweb/login.html#' . $hash_value ,
            'From: "Volontari del Sabato" <no-reply@volontaridelsabato.org>'
          );
          $result->response_code = 200;
      } else {
        $result->response_code = 301;
        $result->error_description = "Attenzione, processo di registrazione non disponibile.";
      }
  }
  $conn->close();
}
echo json_encode($result);
exit();
?>
