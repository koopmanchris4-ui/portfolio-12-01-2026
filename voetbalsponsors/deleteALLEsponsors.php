<?php
require_once "database.php";

// Verwijder sponsors
$stmtDeleteSponsors = $con->prepare("DELETE FROM plattegrond_met_sponsors_chris_koopman_sponsors"); 
$stmtDeleteSponsors->execute();

// Verwijder verdiepingen
$stmtDeleteVerdiepingen = $con->prepare("DELETE FROM plattegrond_met_sponsors_chris_koopman_verdiepingen"); 
$stmtDeleteVerdiepingen->execute();

?>