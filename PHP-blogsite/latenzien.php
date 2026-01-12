<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <!-- include libraries(jQuery, bootstrap) -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

    <!-- include summernote css/js -->
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.9.0/dist/summernote.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.9.0/dist/summernote.min.js"></script>
</head>

<body>

    <style>
        .container {
            background-color: rgb(213, 213, 213);
            max-width: 70%;
        }


        .navbar {
            background-color: rgb(51, 122, 183) !important;
        }

        .container-nav-items {
            margin-left: 3%;
        }

        h3 {
            text-align: center;
        }

      
    </style>


    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-primary">

        <div class="container-nav-items">

            <div>
                <a class="navbar-brand" href="index.php" style="color: lightgray;"><b>Bloggen</b></a>
                <a class="navbar-brand" href="latenzien.php"><b>Alle blogs</b></a>
            </div>
        </div>
    </nav>

</body>

</html>
<?php

require_once "database.php";

$stmt = $con->prepare("SELECT * FROM blogopdracht");
$stmt->execute();

$data = $stmt->fetchAll(PDO::FETCH_OBJ); //geeft array terug (lijst)




echo "<br><br>";
echo "<h3><b>Alle blogs:</h3></b>";
echo "<br><br>";

//als ik de items in midden wil hebben, voeg een style toe voor de <p> en doe text-align: center

foreach ($data as $d) {
    echo "<div class='container'>";

    echo  "<p><b>Blog ID:</b> $d->idBlogopdracht </p>";
    echo "<br>";
    echo  "<p><b>Titel:</b> $d->Titel </p>";
    echo "<br>";
    echo  "<p><b>Auteur:</b> $d->Auteur </p>";
    echo "<br>";
    echo  "<p><b>Tekst:</b> $d->Text </p>";
    echo "<br>";
    echo  "<b>Gespost op:</b> $d->Lastupdate";
    echo "<br>";
    echo "</div>";

    echo "<br><br><br><br>";
};

?>
</tbody>
</thead>
</table>