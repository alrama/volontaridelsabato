<?php   header('Content-Type: application/json; charset=utf-8'); ?>
<?php 
echo hash("sha256",$_GET["token"]);
exit();
?>
