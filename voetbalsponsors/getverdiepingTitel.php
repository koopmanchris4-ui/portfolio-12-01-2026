<?php
header('Content-Type: application/json');
require_once "database.php";

try {
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // query uitvoeren
    $stmt = $con->prepare("SELECT verdieping_nummer, boventitel FROM plattegrond_met_sponsors_chris_koopman_verdiepingen ORDER BY verdieping_nummer ASC");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // altijd array teruggeven, ook bij leeg resultaat
    echo json_encode($result ?: []);
} catch (PDOException $e) {
    // bij fout, geef een array terug met foutmelding
    echo json_encode([["error" => $e->getMessage()]]);
}
?>
