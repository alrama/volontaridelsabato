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
class User {
	public $email;
    public $password;
	public $nome;
    public $cognome;
    public $admin;
    public $hash;
}
$result = new Result();
// Create connection
$conn = new mysqli($servername, $username, $password,$dbLink);

// Check connection
if ($conn->connect_error) {
    $result->response_code = 500;
    $result->error_description = $conn->connect_error;
} 
else if (!isset($_GET["user"]) || !isset($_GET["pw"])) {
    $result->response_code = 300;
    $result->error_description = "Attenzione, email o password non corretti.";
}
else {
  mysql_query("SET character_set_results=utf8", $dbLink);
  mb_language('uni'); 
  mb_internal_encoding('UTF-8');
  mysql_set_charset("UTF8", $conn);
  $sql = "SELECT nome,cognome,admin,hash FROM paniniweb_users where email = '" . $_GET["user"] . "' AND password='" . $_GET["pw"] . "'" ;
  $resultSQL = $conn->query($sql);
  if ($nodo = $resultSQL->fetch_assoc()) {
  	if (NULL===$nodo["hash"]) {
       $result->response_code = 302;
       $result->error_description = "Attenzione, utente non registrato.";
    } else {
      $userRet = new User();
      $userRet->email = $_GET["user"];
      $userRet->password = $_GET["pw"];
      $userRet->nome = $nodo["nome"];
      $userRet->cognome = $nodo["cognome"];
      $userRet->admin = (int) $nodo["admin"];
      $userRet->hash = $nodo["hash"];
      $result->response_code = 200;
      $result->response = $userRet;
    }
  } else {
        $result->response_code = 301;
        $result->error_description = "Attenzione, email o password non corretti.";
  }
  $conn->close();
}
echo json_encode($result);
exit();
?>
