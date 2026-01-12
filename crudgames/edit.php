<?php

require_once "database.php";

//altijd personen ophalen uit database op basis van ID in de link

$stmt = $con->prepare("SELECT * FROM games WHERE id = ?");
$stmt->bindValue(1, $_GET["id"]);
$stmt->execute();

$games = $stmt->fetchObject();


//als er op submit is gedrukt......
//Update doen als er op submit is gedrukt


if ($_POST) {

  $stmt = $con->prepare("UPDATE games SET name=?, Genre=?, Leeftijd=?, Prijs=?, Multiplayer=?, Platform=? WHERE id=?");
  $stmt->bindValue(1, $_POST["name"]);
  $stmt->bindValue(2, $_POST["Genre"]);
  $stmt->bindValue(3, $_POST["Leeftijd"]);
  $stmt->bindValue(4, $_POST["Prijs"]);
  $stmt->bindValue(5, isset($_POST["Multiplayer"]) ? 1 : 0);
  $stmt->bindValue(6, $_POST["Platform"]);
  $stmt->bindValue(7, $_GET["id"]);




  $stmt->execute();
  header("location: index.php");
}




?>



<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game wijzigen</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body class="container mt-5">

  <h2 class="mb-4">Game wijzigen</h2>

  <form method="post">
    <div class="mb-3">
      <label for="name" class="form-label">Naam:</label>
      <input type="text" class="form-control" id="name" name="name" value="<?php echo $games->name ?>">
    </div>

    <div class="mb-3">
      <label for="Genre" class="form-label">Genre:</label>
      <select class="form-select" id="Genre" name="Genre">
        <option <?php if ($games->Genre == "Sports"){echo "selected";} ?> value="Sports">Sports</option>
        <option <?php if ($games->Genre == "Simulation"){echo "selected";} ?> value="Simulation">Simulation</option>
        <option <?php if ($games->Genre == "Race"){echo "selected";} ?> value="Race">Race</option>
        <option <?php if ($games->Genre == "Platform"){echo "selected";} ?> value="Platform">Platform</option>
        <option <?php if ($games->Genre == "RPG"){echo "selected";} ?> value="RPG">RPG</option>
        <option <?php if ($games->Genre == "Shooter"){echo "selected";} ?> value="Shooter">Shooter</option>
        <option <?php if ($games->Genre == "Arcade"){echo "selected";} ?> value="Arcade">Arcade</option>
        <option <?php if ($games->Genre == "Third Person"){echo "selected";} ?> value="Third Person">Third Person</option>
      </select>
    </div>

    <div class="mb-3">
      <label for="Leeftijd" class="form-label">Leeftijd:</label>
      <select class="form-select" id="Leeftijd" name="Leeftijd">
        <option <?php if ($games->Leeftijd == "Alle leeftijden"){echo "selected";} ?> value="Alle leeftijden">Alle leeftijden</option>
        <option <?php if ($games->Leeftijd == "6+"){echo "selected";} ?> value="6+">6+</option>
        <option <?php if ($games->Leeftijd == "16+"){echo "selected";} ?> value="16+">16+</option>
        <option <?php if ($games->Leeftijd == "18+"){echo "selected";} ?> value="18+">18+</option>
      </select>
    </div>

    <div class="mb-3">
      <label for="Prijs" class="form-label">Prijs:</label>
      <input type="text" class="form-control" id="Prijs" name="Prijs" value="<?php echo $games->Prijs?>">
    </div>

    <div class="form-check mb-3">
      <input <?php if($games->Multiplayer ==1){echo "checked";} ?> type="checkbox" class="form-check-input" id="Multiplayer" name="Multiplayer">
      <label class="form-check-label" for="Multiplayer">Online multiplayer</label>
    </div>

    <div class="mb-4">
      <label for="Platform" class="form-label">Platform:</label>
      <select class="form-select" id="Platform" name="Platform">
        <option <?php if ($games->Platform == "Playstation 4"){echo "selected";} ?> value="Playstation 4">Playstation 4</option>
        <option <?php if ($games->Platform == "Playstation 5"){echo "selected";} ?> value="Playstation 5">Playstation 5</option>
        <option <?php if ($games->Platform == "Nintendo Wii"){echo "selected";} ?> value="Nintendo Wii">Nintendo Wii</option>
        <option <?php if ($games->Platform == "Nintendo Switch"){echo "selected";} ?> value="Nintendo Switch">Nintendo Switch</option>
        <option <?php if ($games->Platform == "Xbox One"){echo "selected";} ?> value="Xbox One">Xbox One</option>
        <option <?php if ($games->Platform == "PC"){echo "selected";} ?> value="PC">PC</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary">Opslaan</button>
  </form>

</body>

</html>