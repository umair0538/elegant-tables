<?php
sleep(5);

$response = array();
$response["rows"] = array();
$response["total"] = 100;
$data = array("column1", "column2", "column3", "column4", "column5");

for($i = 0; $i < $_GET["rows"]; $i++)
	$response["rows"][] = $data;

echo json_encode($response);
?>