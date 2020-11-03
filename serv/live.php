<?php
header("Access-Control-Allow-Origin:*");
$servername = "localhost";
$username = "dch";
$password = "kitkat";
$dbname = "dch";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$postdata = file_get_contents("php://input");
$req=json_decode($postdata);

$command=$req->command;

if($command=='post'){

   
}
else if($command=='get'){
   echo 'get request';
   echo readfile("live.txt");
}

$conn->close();
?>