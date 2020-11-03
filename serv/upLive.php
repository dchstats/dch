<?php
header("Access-Control-Allow-Origin:*");
$postdata = file_get_contents("php://input");
$req=json_decode($postdata);
$a= $req->str;
$myfile = fopen("liveData.txt", "w") or die("Unable to open file!");
fwrite($myfile, $a);
fclose($myfile);
echo readfile('liveData.txt');
?>