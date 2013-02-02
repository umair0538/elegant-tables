<?php
sleep(2);

$response = array();
$response["rows"] = array();
$response["total"] = 100;
$data = array("column1", "column2", "column3", "<a href='javascript:slide_left_show(\"edit_form\")'>Edit</a><a href='#'>Delete</a>");

for($i = 0; $i < $_GET["rows"]; $i++)
	$response["rows"][] = $data;

echo json_encode($response);
?>