<!-- De insert -->

<!-- alles wat je heb toegevoegd in de UI komt in de DB, alles wat niet meer zichtbaar wordt, wordt verwijderd -->

<?php
require_once "database.php";

$data = json_decode(file_get_contents("php://input"), true);
$verdieping = $data[0]['verdieping']; // haalt huidige verdieping op (dus zichtbare verdieping op scherm)



// haal eerst de huidige sponsors uit de DB
$stmt = $con->prepare("SELECT * FROM plattegrond_met_sponsors_chris_koopman_sponsors WHERE verdieping = ?");
$stmt->execute([$verdieping]);
$existing = $stmt->fetchAll(PDO::FETCH_ASSOC); // zet ze in existing


// Maak map met bestaande sponsor keys (dus de sponsors die al in db stonden)
$existingMap = [];
foreach ($existing as $s) {
    $key = $s['zijde'].'-'.$s['secties'].'-'.$s['positie'];
    $existingMap[$key] = $s;
}

// Map van alles wat toegevoegd wordt (dus alles wat nu zichtbaar is)
$newMap = [];
foreach ($data as $s) {
    $key = $s['zijde'].'-'.$s['sectie'].'-'.$s['positie'];
    $newMap[$key] = $s;
}

// de niet-toegevoegde  worden verwijderd (dus alles wat niet zichtbaar is)
//bijv je hebt een sectie van: blauw->oranje->geel, je verwijderd 2, dan blijft blauw over. De andere 2 worden verwijderd
foreach ($existingMap as $key => $s) {
    if (!isset($newMap[$key])) {
        $del = $con->prepare("DELETE FROM plattegrond_met_sponsors_chris_koopman_sponsors WHERE id = ?");
        $del->execute([$s['id']]);
    }
}

// de nieuwe worden toegevoegd, insert
$insert = $con->prepare("
    INSERT INTO plattegrond_met_sponsors_chris_koopman_sponsors (verdieping, zijde, secties, positie)
    VALUES (?, ?, ?, ?)
");

foreach ($data as $s) {
    $key = $s['zijde'].'-'.$s['sectie'].'-'.$s['positie'];

    // als de sponsor al bestond, voeg geen nieuwe toe. (kleur en naam houden)
    if (isset($existingMap[$key])) continue;

    $insert->execute([
        $verdieping,
        $s['zijde'],
        $s['sectie'],
        $s['positie']
    ]);
}
?>
