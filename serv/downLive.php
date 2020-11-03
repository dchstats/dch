<?php
header("Access-Control-Allow-Origin:*");
echo readfile('liveData.txt');
?>