<?php
error_reporting( E_ALL );

// connect
$c = new MongoClient();
$db = $c->demo_twobirds;

// find in the collection
$cursor = array( "error" => "action not found." );
switch ( $_GET["action"] || "" ) {
    case "login":
		$collection = $db->users; // containing username(string)
		$cursor = $collection->find( 
			array( "username" => $_GET["usernick"], "userpass" => $_GET["userpass"] ), 
			array( "_id" => false, "username" => true )
		);
        break;
}

// iterate through the results
echo json_encode(iterator_to_array($cursor, false));
?>
