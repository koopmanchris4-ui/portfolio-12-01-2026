<?php

require_once "database.php";

//delete gedeelte

if (isset($_GET["id"])) {
    $stmt = $con->prepare("DELETE FROM games WHERE id = ?");
    $stmt->bindValue(1, $_GET["id"]);

    $stmt->execute();

    header("location: index.php");
    exit();
}

//database inzien gedeelte

$stmt = $con->prepare("SELECT * FROM games");
$stmt->execute();

$data = $stmt->fetchAll(PDO::FETCH_OBJ); //geeft array terug (lijst)



?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Game Collectie</title>

    <style>
        .gamevak {
            width: 45%;
            height: 375px;
            float: left;
            margin-left: 3.5%;
            box-shadow: 3px 3px 3px grey;
            background-color: #F2F1F1;
            margin-bottom: 2%;
        }


        h3 {
            float: left;
            margin-right: 60%;
        }

        ;

        p {
            align-items: center;
        }

        #container {
            align-items: center;
            text-align: center;
        }

        .gametoevoeg {
            width: 15%;
        }
    </style>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body>

    <?php
    echo "<div id = 'container'>";
    echo "<br><br>";
    echo "<h1>Game collectie:</h1>";
    echo "<br>";
    echo "<a class = 'btn btn-primary  gametoevoeg'href='toevoegen.php'>Games toevoegen +</a>";
    echo "<br><br><br>";
    echo "</div>";





    foreach ($data as $d) {
        $Multiplayer = "nee";
        if ($d->Multiplayer == 1) {
            $Multiplayer = "ja";
        }


        echo '<div class="gamevak">';
        echo  "<h3>$d->name</h3> <a class = 'btn btn-primary'href='edit.php?id=$d->id'>...</a> <a class = 'btn btn-danger'href='index.php?id=$d->id'>X</a>";
        echo "<br>";
        echo "<br>";
        echo  "<p><b>Genre: </b>$d->Genre </p>";
        echo "<br>";
        echo  "<p><b>Leeftijd: </b> $d->Leeftijd </p>";
        echo "<br>";
        echo  "<p><b>Prijs: </b>$d->Prijs </p>";
        echo "<br>";
        echo  "<p><b>Online Multiplayer: </b> $Multiplayer </p>";
        echo "<br>";
        echo  "<p><b>Platform: </b>$d->Platform </p>";
        echo "<br>";
        echo "</div>";
    }
    ?>


</body>

</html>