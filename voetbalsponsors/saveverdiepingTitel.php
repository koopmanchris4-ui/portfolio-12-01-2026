<?php
require_once 'database.php'; // $con bevat de PDO verbinding
header('Content-Type: application/json');

// json inlezen
$raw = file_get_contents('php://input');

// data is de json raw data
$data = json_decode($raw, true);

// boventitel is titel van data 
$boventitel = trim($data['titel']); // boventitel is titel in data meegestuurd met fetch, zonder lege tekens
$verdiepingNummer = (int)$data['verdieping_id']; // verdiepingnummer is verdieping_id meegestuurd in fetch


// insert boventitel van deze verdieping
// als boventitel al bestaat op dit verdieping nummer, update hem dan
$sql = "
    INSERT INTO plattegrond_met_sponsors_chris_koopman_verdiepingen (verdieping_nummer, boventitel, achtergrond)
    VALUES (:verdiepingNummer, :boventitel, 'grijs')
    ON DUPLICATE KEY UPDATE
    boventitel = VALUES(boventitel)
";

    $stmt = $con->prepare($sql);
    $stmt->execute([
        ':boventitel' => $boventitel,
        ':verdiepingNummer' => $verdiepingNummer
    ]);
