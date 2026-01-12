<?php

if ($_POST){
    require_once "database.php";
    $stmt = $con->prepare("INSERT INTO games(name, Genre, Leeftijd, Prijs, Multiplayer, Platform) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt -> bindValue(1, $_POST["name"]);
    $stmt -> bindValue(2, $_POST["Genre"]);
    $stmt -> bindValue(3, $_POST["Leeftijd"]);
    $stmt -> bindValue(4, $_POST["Prijs"]);
    $stmt->bindValue(5, isset($_POST["Multiplayer"]) ? 1 : 0);
    $stmt -> bindValue(6, $_POST["Platform"]);



    $stmt -> execute();

    header("location: index.php");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<body>

<body class="container mt-5">

  <h2 class="mb-4">Nieuwe game toevoegen</h2>

  <form method="post">
    <div class="mb-3">
      <label for="name" class="form-label">Naam:</label>
      <input type="text" class="form-control" id="name" name="name">
    </div>

    <div class="mb-3">
      <label for="Genre" class="form-label">Genre:</label>
      <select class="form-select" id="Genre" name="Genre">
        <option value="Sports">Sports</option>
        <option value="Simulation">Simulation</option>
        <option value="Race">Race</option>
        <option value="Platform">Platform</option>
        <option value="RPG">RPG</option>
        <option value="Shooter">Shooter</option>
        <option value="Arcade">Arcade</option>
        <option value="Third Person">Third Person</option>
      </select>
    </div>

    <div class="mb-3">
      <label for="Leeftijd" class="form-label">Leeftijd:</label>
      <select class="form-select" id="Leeftijd" name="Leeftijd">
        <option value="Alle leeftijden">Alle leeftijden</option>
        <option value="6+">6+</option>
        <option value="16+">16+</option>
        <option value="18+">18+</option>
      </select>
    </div>

    <div class="mb-3">
      <label for="Prijs" class="form-label">Prijs:</label>
      <input type="text" class="form-control" id="Prijs" name="Prijs">
    </div>

    <div class="form-check mb-3">
      <input type="checkbox" class="form-check-input" id="Multiplayer" name="Multiplayer">
      <label class="form-check-label" for="Multiplayer">Online multiplayer</label>
    </div>

    <div class="mb-4">
      <label for="Platform" class="form-label">Platform:</label>
      <select class="form-select" id="Platform" name="Platform">
        <option value="Playstation 4">Playstation 4</option>
        <option value="Playstation 5">Playstation 5</option>
        <option value="Nintendo Wii">Nintendo Wii</option>
        <option value="Nintendo Switch">Nintendo Switch</option>
        <option value="Xbox One">Xbox One</option>
        <option value="PC">PC</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary">Opslaan</button>
  </form>

</body>
</html>
