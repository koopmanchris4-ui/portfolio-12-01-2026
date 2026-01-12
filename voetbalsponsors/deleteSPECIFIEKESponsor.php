<?php
require_once "database.php";

$data = json_decode(file_get_contents("php://input"), true);

// sponsor to delete data (dat hij echte de goede sponsor verwijdert)
$verdieping = $data["verdieping"];
$zijde = $data["zijde"];
$sectie = $data["sectie"];
$positie = $data["positie"];


//Start Transactie, 
$con->beginTransaction();

// Query 1: DELETE de specifieke sponsor
$sql_delete = "
        DELETE FROM plattegrond_met_sponsors_chris_koopman_sponsors
        WHERE verdieping = :verdieping
          AND zijde = :zijde
          AND secties = :sectie
          AND positie = :positie
    ";

// execute van de delete
$stmt_delete = $con->prepare($sql_delete);
$stmt_delete->execute([
    'verdieping' => $verdieping,
    'zijde' => $zijde,
    'sectie' => $sectie,
    'positie' => $positie
]);

// Query 2: UPDATE de posities van de resterende sponsors binnen DEZELFDE sectie (goede plaatsing na delete)
// alles met hogere positie schijft ééntje op naar links met -1
$sql_update_positie = "
        UPDATE plattegrond_met_sponsors_chris_koopman_sponsors
        SET positie = positie - 1
        WHERE verdieping = :verdieping
          AND zijde = :zijde
          AND secties = :sectie
          AND positie > :positie
    ";

// execute van de update positie
$stmt_update_positie = $con->prepare($sql_update_positie);
$stmt_update_positie->execute([
    'verdieping' => $verdieping,
    'zijde' => $zijde,
    'sectie' => $sectie,
    'positie' => $positie
]);



// kijk of er nog sponsor in deze sectie zitten
$sql_check_empty = "
        SELECT COUNT(*) 
        FROM plattegrond_met_sponsors_chris_koopman_sponsors
        WHERE verdieping = :verdieping
          AND zijde = :zijde
          AND secties = :sectie
    ";

// execute van deze check
$stmt_check_empty = $con->prepare($sql_check_empty);
$stmt_check_empty->execute([
    'verdieping' => $verdieping,
    'zijde' => $zijde,
    'sectie' => $sectie
]);
$count = $stmt_check_empty->fetchColumn();


// als hij leeg is, verlaag de secties dan met -1. Zo blijven er altijd sponsors op beeld
if ($count == 0) {

    $sql_update_sectie = "
            UPDATE plattegrond_met_sponsors_chris_koopman_sponsors
            SET secties = secties - 1
            WHERE verdieping = :verdieping
              AND zijde = :zijde
              AND secties > :sectie
        ";

    // execute van deze update (-1 secties)
    $stmt_update_sectie = $con->prepare($sql_update_sectie);
    $stmt_update_sectie->execute([
        'verdieping' => $verdieping,
        'zijde' => $zijde,
        'sectie' => $sectie
    ]);
}

//Commit van alle handelingen
$con->commit();
