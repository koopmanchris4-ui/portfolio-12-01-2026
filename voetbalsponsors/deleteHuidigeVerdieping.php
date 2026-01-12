<?php
require_once "database.php"; // bevat $con

$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$data = json_decode(file_get_contents("php://input"), true);
$verdieping = (int)$data["verdieping"]; // verdieping is verdieping meegesturud van fetch (huidigeverdiepingnummer)
$con->beginTransaction();


// DELETES

// verwijder alles van sponsor tabel waar verdieping huidigeverdiepingIndex is
$stmt = $con->prepare(
    "DELETE FROM plattegrond_met_sponsors_chris_koopman_sponsors
         WHERE verdieping = :verdieping"
);
$stmt->execute([":verdieping" => $verdieping]);


// verwijder alles van verdieping tabel waar verdieping huidigeverdiepingIndex is
$stmt = $con->prepare(
    "DELETE FROM plattegrond_met_sponsors_chris_koopman_verdiepingen
         WHERE verdieping_nummer = :verdieping"
);
$stmt->execute([":verdieping" => $verdieping]);

// ---------------------------------------------------------------------------------------

//Updates


// als huidigeverdiepingIndex groter is dan de verwijderde, zet verdieping dan - 1 in de sponsortabel
// bijv 3 wordt 2 als je 3 verwijderd
$stmt = $con->prepare(
    "UPDATE plattegrond_met_sponsors_chris_koopman_sponsors
         SET verdieping = verdieping - 1
         WHERE verdieping > :verdieping"
);
$stmt->execute([":verdieping" => $verdieping]);

// als huidigeverdiepingIndex groter is dan de verwijderde, zet verdieping dan - 1 in de verdiepingentabel
//bijv 3 wordt 2 als je 3 verwijderd.

$stmt = $con->prepare(
    "UPDATE plattegrond_met_sponsors_chris_koopman_verdiepingen
         SET verdieping_nummer = verdieping_nummer - 1
         WHERE verdieping_nummer > :verdieping"
);
$stmt->execute([":verdieping" => $verdieping]);
$con->commit();

echo json_encode([
    "success" => true,
    "message" => "Verdieping succesvol verwijderd en hernummerd"
]);
