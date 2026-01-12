 <!DOCTYPE html>
 <html lang="en">

 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Stadion Sponsor Generator</title>
     <link rel="stylesheet" href="style.css">
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
 </head>

 <body>

     <div id="alles-wrapper">
         <div id="side-menu">
             <div id="verdiepingenInput-wrapper">
                 <input type="number" id="verdiepingenInput" placeholder="Aantal nieuwe verdiepingen" min="1">
                 <input type="submit" id="generateBtn" value="Genereer verdiepingen">


                 <div id="inputs-container">
                     <div id="inputDiv">
                     </div>
                 </div>
                 <input class='tijd-input' type="date">
             </div>
         </div>



         <div id="stadionWrapper">
             <div id="verdiepingtekst"></div>


             <div id="stadion-en-pijl-wrapper">
                 <div id="stadionContainer">
                 </div>

                 <div id="navButtons-wrapper">
                     <button id="prevBtn"><i class="bi bi-arrow-up-square-fill"></i></button>
                     <button id="nextBtn"><i class="bi bi-arrow-down-square-fill"></i></button>
                 </div>
             </div>
         </div>
     </div>
     </div>

     <!-- voor sponsormenu -->
     <div id="fade-achter-menu">
         <div id="menu"></div>
     </div>




     <!-- voor achtergrondmenu -->

     <div id="fade-achter-menu2">
         <div id="achtergrondmenu">
             <div id="titelenX-wrapper2">
                 <h2 id="titel-menu">Achtergrond kiezen:</h2>
                 <button id="menu-sluitknop">X</button>
             </div>
             <p>Kies één van de achtergronden voor deze verdieping</p>
             <div id="image-wrapper">
                 <img class="achtergrondkeuze" src="achtergronden/grijs.png" data-value="achtergronden/grijs">
                 <img class="achtergrondkeuze" src="achtergronden/voetbalveld.png" data-value="achtergronden/voetbalveld">
                 <img class="achtergrondkeuze" src="achtergronden/basketbalveld.png" data-value="achtergronden/basketbalveld">
                 <img class="achtergrondkeuze" src="achtergronden/café.png" data-value="achtergronden/café">
                 <img class="achtergrondkeuze" src="achtergronden/slaapkamer.png" data-value="achtergronden/slaapkamer">
                 <img class="achtergrondkeuze" src="achtergronden/theater.png" data-value="achtergronden/theater">
             </div>
         </div>
     </div>

     <script src="script.js"></script>
 </body>

 </html>