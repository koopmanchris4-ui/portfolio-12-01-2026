<?php

require_once "database.php"; // zoda ik $con kan gebruiken

$auteurValid = true;
$titelValid = true;
$textValid = true;


$auteur = "";
$titel = "";
$text = "";


if ($_POST) {

$auteurValid = trim($_POST["Auteur"]) !="";
$titelValid = trim($_POST["Titel"]) !="";
$textValid = trim($_POST["Text"]) !="";

if($auteurValid && $titelValid && $textValid  ){

    $stmt = $con->prepare("INSERT INTO blogopdracht(Titel, Auteur, Text) VALUES(?,?,?)");
    $stmt->bindValue(1, $_POST["Titel"]);
    $stmt->bindValue(2, $_POST["Auteur"]);
    $stmt->bindValue(3, strip_tags($_POST["Text"], ["<h1><h2><h3><h4><h5><u><strong>"]));

    //strip tags = tegen JS hacks

    $stmt->execute();
}
};


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Blogsite</title>
</head>

</html>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <!-- include libraries(jQuery, bootstrap) -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

    <!-- include summernote css/js -->
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.9.0/dist/summernote.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.9.0/dist/summernote.min.js"></script>

    <style>
        #container {
            width: 70%;
        }

        #container .btn-primary {
            width: 100%;
        }

        .navbar {
            background-color: #337ab7 !important;
        }

        .container-nav-items {
            margin-left: 3%;
        }
    </style>
</head>

<body>

    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-primary">

        <div class="container-nav-items">

            <div>
                <a class="navbar-brand" href="#"><b>Bloggen</b></a>
                <a class="navbar-brand" href="latenzien.php" style="color: lightgray;"><b>Alle blogs</b></a>
            </div>
        </div>
    </nav>


    <form method="post">



        <div id="container" class="container-fluid d flex justify-content-center">
        <?php if (!$titelValid){ echo "<div style='color:red;'>Een titel is verplicht</div>";} ?>

            <div class="form-group">
                <input type="text" class="form-control" placeholder="Titel" name="Titel">
            </div>
            <?php if (!$auteurValid){ echo "<div style='color:red;'>Uw naam is verplicht</div>";} ?>


            <div class="form-group">
                <input type="text" class="form-control" placeholder="Uw naam" name="Auteur">
            </div>

            <?php if (!$textValid){ echo "<div style='color:red;'>Een bericht is verplicht</div>";} ?>


            <textarea id="summernote" name="Text"></textarea>
            <button type="submit" class="btn btn-primary">Opslaan</button>
    </form>
    </div>
</body>

<script>
    $(document).ready(function() {
        $('#summernote').summernote();
    });
</script>


</html>