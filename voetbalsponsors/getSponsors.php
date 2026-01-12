<?php
require_once "database.php";

$sql = "
    SELECT 
        s.id, 
        s.verdieping, 
        s.zijde, 
        s.positie, 
        s.secties, 
        s.eindtijd, 
        s.kleur, 
        s.naam, 
        v.achtergrond 
    FROM plattegrond_met_sponsors_chris_koopman_sponsors AS s
    LEFT JOIN plattegrond_met_sponsors_chris_koopman_verdiepingen AS v 
    ON s.verdieping = v.verdieping_nummer
"; // select alles, join verdiepingen on verdieping_nummer in de andere database

$stmt = $con->prepare($sql);
$stmt->execute();
$sponsors = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($sponsors);
?>