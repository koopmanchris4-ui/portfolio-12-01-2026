<?php
require_once "database.php";
header('Content-Type: application/json');


// JSON data lezen
$input = file_get_contents("php://input");
$data = json_decode($input, true);


$achtergrond = $data['achtergrond']; // achtergrond is achtergrond meegestuurd van js
$verdieping = $data['verdieping']; // verdieping is verdieping meegestuurd van js

// insert van de achtergrond en verdieping_nummer in verdiepingen tabel
$sql = "
    INSERT INTO plattegrond_met_sponsors_chris_koopman_verdiepingen (verdieping_nummer, achtergrond)
    VALUES (:verdieping, :achtergrond)
    ON DUPLICATE KEY UPDATE 
    achtergrond = VALUES(achtergrond)
";

$stmt = $con->prepare($sql);
$stmt->execute([
'verdieping' => $verdieping,
'achtergrond' => $achtergrond
]);
