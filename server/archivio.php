<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="theme-color" content="darkolivegreen">
<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0">
<link rel="icon" href="favicon.ico" />
<link rel="stylesheet" href="../paniniweb.css?v=6"/>
<script src="../jquery-3.3.1.min.js"></script>
<script src="../paniniweb.js?v=3"></script>
<title>Volontari del sabato</title>
</head>

<body>
  <div id="mySidenav" class="sidenav">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
    <a href="../evento.html">Prossima distribuzione</a>
    <a href="../volontari.html">Volontari</a>
    <a href="../avvisi.html">Avvisi</a>
    <a href="../fasi.html" id="fasi_link" style="display:none;">Gestione Fasi</a>
  </div>

  <!-- Use any element to open the sidenav -->
  <img onclick="openNav()" src="../img/menu.png">
  <h2>Archivio</h2>
  <div class="main">
    <ul style='width:fit-content;margin:auto;text-align:left;margin-top:50px'>
<?php
$directory = '../archivio/';
$scanned_directory = array_diff(scandir($directory), array('..', '.'));
      foreach ($scanned_directory as $key => $value)  {
      	echo "<LI><a href='../archivio/".$value."'>".$value."</a></LI>";
      }
?>
    </ul>
  </div>

</body>

</html>
