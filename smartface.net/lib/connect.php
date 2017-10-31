<?php
	$conn = new Mongo('localhost');
	$db = $conn->test;
	$collection = $db->items;
	$cursor = $collection->find();

?> 