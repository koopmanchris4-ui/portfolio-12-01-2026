<?php

require_once "database.php";

// Lees JSON van POST
$data = json_decode(file_get_contents("php://input"), true);



$stmt = $con->prepare("UPDATE plattegrond_met_sponsors_chris_koopman_sponsors SET naam = ?, eindtijd = ?, kleur = ? WHERE verdieping = ? AND zijde = ? AND secties = ? AND positie = ?");

// update. Alles blijft eigenlijk hetzelfde behalve de eindtijd en kleur en tags
$eindtijd = $data['eindtijd'] ?: null;
$stmt->bindValue(1, $data['naam']);
$stmt->bindValue(2, $eindtijd);
$stmt->bindValue(3, $data['kleur']);
$stmt->bindValue(4, $data['verdieping'], PDO::PARAM_INT);
$stmt->bindValue(5, $data['zijde'], PDO::PARAM_STR);
$stmt->bindValue(6, $data['sectie'], PDO::PARAM_INT);
$stmt->bindValue(7, $data['positie'], PDO::PARAM_INT);
$stmt->execute();
?>