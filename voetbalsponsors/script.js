const container = document.getElementById("stadionContainer");
const generateBtn = document.getElementById("generateBtn");
const verdiepingenInput = document.getElementById("verdiepingenInput");
const verdiepingtekstcontainer = document.getElementById("verdiepingtekst")
let sponsorData = [] // array voor database data, wordt gevuld met current sponsors.
let geselecteerdeKleur = null;
let verdiepingTitelsDB = {}; //globale array voor titels van verdiepingen in de DB
let gesimuleerdeDatum = null; //gesimuleerde datum is altijd null, tenzij datepicker wordt ingesteld

let verdiepingen = []; // array om verdiepingen op te slaan
let huidigeverdiepingIndex = 0; // index van huidige verdieping

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");



// functie om sponsors te tonen

// ruimte = HTML element waar sponsors inkomen (left, right enz)
// aantallen array is leftArr, rightArr, upAr, downArr. (dus eig resultaat van input)
//richting bepaalt of het rows of columns zijn (onder + boven of rechts + links)
function sponsorcount(ruimte, aantallenArray, richting, verdiepingsnummer) {
    ruimte.innerHTML = ""; // eerst een reset

    const newSponsors = []; // tijdelijke array



    if (richting === "rows") { // als het rows zijn, dus de onderste of bovenste rij:
        ruimte.style.display = "grid";
        ruimte.style.gridTemplateColumns = "1fr"; // er komt 1 kolom (kolommen worden gescheiden door komma)
        ruimte.style.gridTemplateRows = `repeat(${aantallenArray.length}, auto)`; // zoveel rijen als aantal getallen inn array. 

        //bij 3,2,1 maak je 3 losse rijen vna elke 1 hoog met 3,2 en 1 rij

        aantallenArray.forEach((aantal, sectieIndex) => { // loop door elk getal in de array
            const rij = document.createElement("div"); // maak een rij
            rij.style.display = "grid";
            rij.style.gridTemplateColumns = `repeat(${aantal}, 1fr)`; // evenveel kolommen als aantal (dus bij 3 getallen (3,2,1) maakt hij 3 kolommen)


            // de rij vullen met vakjes (sponsors)
            for (let i = 0; i < aantal; i++) { // loop door elke aantal
                const vak = document.createElement("div");
                vak.classList.add("sponsor");


                // in dezelfde loop, zet data van sponsor in de newsponsors array
                newSponsors.push({
                    verdieping: verdiepingsnummer, // huidigeverdieping index begint bij 0, dus + 1
                    zijde: ruimte.className, // left, right, up, down
                    positie: i + 1, // + 1 want hij begint bij 0. Positie van links naar rechts per rij
                    sectie: sectieIndex + 1
                });



                // vak verlopen check

                const verlopen = sponsorData.some(sponsor =>
                    sponsor.verdieping == verdiepingsnummer &&
                    sponsor.zijde == ruimte.className &&
                    sponsor.secties == (sectieIndex + 1) &&
                    sponsor.positie == (i + 1) &&
                    sponsor.eindtijd && sponsor.eindtijd !== "0000-00-00" &&
                    !isNaN(new Date(sponsor.eindtijd).getTime()) &&
                    new Date(sponsor.eindtijd) < getHuidigeDatum()
                );

                if (verlopen) {
                    vak.style.backgroundColor = "red";

                } else {
                    // kleur uit database zoeken
                    const dbSponsor = sponsorData.find(s =>
                        s.verdieping == verdiepingsnummer &&
                        s.zijde == ruimte.className &&
                        s.secties == (sectieIndex + 1) &&
                        s.positie == (i + 1)
                    );

                    if (dbSponsor && dbSponsor.kleur) {
                        vak.style.backgroundColor = dbSponsor.kleur;
                    }
                }




                // bij een klik op vak (sponsor) menuutje openen, verwijderknop + verlooptijd
                vak.addEventListener("click", () => {
                    openmenu({ // geef de dingen van hierboven ook mee in de openmenu functie (menu voor specifieke sponsor opnenen)
                        // dit geeft hij mee zodat hij de sponsor toont die identiek is aan de geklikte
                        verdieping: huidigeverdiepingIndex + 1,
                        zijde: ruimte.className,
                        positie: i + 1, // positie van onder naar beneden per kolom
                        sectie: sectieIndex + 1,
                        element: vak
                    })
                })



                rij.appendChild(vak); // voeg sponsor div toe aan rij div
            }
            ruimte.appendChild(rij)
            // ruimte is left, right, up, down. 
            // rij wordt in die toegevoegd
        });


        // als er niets zit in aantallenarray (dus in een zijde)
        if (aantallenArray.length <= 0) {
            ruimte.style.boxShadow = "none"; // verwijder de boxshadow en border
            ruimte.style.border = "none";
        }
        else { // anders (wel weer gevuld), zet het weer terug
            ruimte.style.boxShadow = "";
            ruimte.style.border = "";
        }



    } else if (richting === "columns") { // als de richting columns zijn: dus links of rechts
        ruimte.style.display = "grid";
        ruimte.style.gridTemplateRows = "1fr"; // er komt 1 rij, gescheiden door komma's, dus andersom
        ruimte.style.gridTemplateColumns = `repeat(${aantallenArray.length}, auto)`; // kolommen wordt aantal van aantal getallen in array
        // dus bij 3,2,1 komen er 3 kolommen


        aantallenArray.forEach((aantal, sectieIndex) => {
            //loop door elk getal in de array
            const kolom = document.createElement("div"); // voor elk element in de array, maak een kolom
            kolom.style.display = "grid";
            kolom.style.gridTemplateRows = `repeat(${aantal}, 1fr)`; // evenveel rijen als aantal (dus bij 3,2,1 maakt hij 3 rijen, dus andersom)

            for (let i = 0; i < aantal; i++) { // dezelfde for loop als net
                const vak = document.createElement("div");
                vak.classList.add("sponsor");


                // en hetzelfde de data vullen zoals ook bij rijen
                newSponsors.push({
                    verdieping: verdiepingsnummer,
                    zijde: ruimte.className,
                    positie: i + 1, // positie van onder naar beneden per kolom
                    sectie: sectieIndex + 1
                });



                // vak verlopen check

                // verllopen -> hij zoekt voor identieke sponsor, dus degene die is geklikt
                const verlopen = sponsorData.some(sponsor =>
                    sponsor.verdieping == verdiepingsnummer &&
                    sponsor.zijde == ruimte.className &&
                    sponsor.secties == (sectieIndex + 1) &&
                    sponsor.positie == (i + 1) &&
                    sponsor.eindtijd && sponsor.eindtijd !== "0000-00-00" && // als tijd niet 0000 is
                    !isNaN(new Date(sponsor.eindtijd).getTime()) && // en de eindtijd kleiner is dan vandaag
                    new Date(sponsor.eindtijd) < getHuidigeDatum()
                );
                if (verlopen) { // als dat zo is, maak rood
                    vak.style.backgroundColor = "red";
                } else {
                    // als hij niet velopen is, vind de kleur uit de database van deze sponsor
                    const dbSponsor = sponsorData.find(s =>
                        s.verdieping == verdiepingsnummer &&
                        s.zijde == ruimte.className &&
                        s.secties == (sectieIndex + 1) &&
                        s.positie == (i + 1)
                    );

                    if (dbSponsor && dbSponsor.kleur) { // als kleur kolom bestaat, maak hem die kleur
                        vak.style.backgroundColor = dbSponsor.kleur;
                    }
                }




                // bij een klik op vak (sponsor) menuutje openen, verwijderknop + verlooptijd
                vak.addEventListener("click", () => { // geef de dingen van hierboven ook mee in de openmenu functie (menu voor specifieke sponsor opnenen)
                    openmenu({
                        verdieping: huidigeverdiepingIndex + 1,
                        zijde: ruimte.className,
                        positie: i + 1, // positie van onder naar beneden per kolom
                        sectie: sectieIndex + 1,
                        element: vak
                    })
                })



                kolom.appendChild(vak);
            }
            ruimte.appendChild(kolom)
        })

        // als er niets zit in aantallenarray (dus in een zijde)
        if (aantallenArray.length <= 0) {
            ruimte.style.boxShadow = "none"; // verwijder de boxshadow en border
            ruimte.style.border = "none";
        }
        else { // anders (wel weer gevuld), zet het weer terug
            ruimte.style.boxShadow = "";
            ruimte.style.border = "";
        }

    }
    return newSponsors; // newSponsors array met die database info wordt gegeven aan sponsorcount (later gebruiken)
}

// ---------------------------------------------------------------------------------

// Functie om een verdieping te maken
function maakVerdieping() {
    const stadion = document.createElement("div"); // maak stadion div
    stadion.classList.add("stadion"); // voeg de class: stadion toe


    //maak voor elke toegevoegde stadion een up, down, left right en veld. En geef ze de classes

    const up = document.createElement("div");
    up.classList.add("up");

    const down = document.createElement("div");
    down.classList.add("down");

    const left = document.createElement("div");
    left.classList.add("left");

    const right = document.createElement("div");
    right.classList.add("right");

    const veld = document.createElement("img");
    veld.classList.add("veld");
    veld.src = "grijs.png"

    stadion.append(up, down, left, right, veld); // alle kanten worden aan stadion toegevoegd
    container.appendChild(stadion); // stadion wordt toegevoegd aan container (stadion container)

    // Inputs voor deze verdieping
    const inputDiv = document.createElement("div");
    inputDiv.innerHTML = `

    <p>maak meerdere (ongelijke) secties in een balk door ze te scheiden met komma's. Bijvoorbeeld 1,2,3</p>
            <button id='achtergronden' onclick="meerachtergronden()">Selecteer verdiepings achtergrond</button>

        <h4>Links</h4>
        <div class="input-wrapper">
        <input class="linksInput inputs-in-menu" placeholder="bijv: 1,2,3" min="0">
        </div>

        <h4>Rechts</h4>
        <div class="input-wrapper">
        <input  class="rechtsInput inputs-in-menu" placeholder="bijv: 1,2,3" min="0">
        </div>

        <h4>Boven</h4>
        <div class="input-wrapper">
        <input  class="bovenInput inputs-in-menu" placeholder="bijv: 1,2,3" min="0">
        </div>

        <h4>Onder</h4>
        <div class="input-wrapper">
        <input  class="onderInput inputs-in-menu" placeholder="bijv: 1,2,3" min="0">
        </div>

        <input type="submit" class="update-btn" value="Update sponsors van verdieping">
        <button id='reset-deze-verdieping' onclick="verwijderDEZEverdieping()">Verwijder huidige verdieping</button>
        <button id='reset-verdiepingen' onclick="resetVerdiepingen()">Verwijder ALLE verdiepingen</button>

        <p>Simuleer de huidige datum met deze datepicker</p>
        

    `;



    const inputs = inputDiv.querySelectorAll(".inputs-in-menu");

    // voor elke input die hierboven zijn aangemaakt
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            // vervang alles wat geen 0-9 of komma is door lege string, zodat je nooit een letter kan typen
            input.value = input.value.replace(/[^0-9,]/g, '');
        });
    });

    // bij klik op update sponsors
    const btn = inputDiv.querySelector(".update-btn");
    btn.addEventListener("click", () => {

        const parse = input => input.value.split(",").map(n => Number(n.trim())).filter(n => n > 0); // parse is getallen van input gescheiden van kommas
        const verdiepingsnummer = huidigeverdiepingIndex + 1; // verdiepingsnummer = huidigeverdiepingindex + 1 (want array begint bij 0)

        const leftArr = parse(inputDiv.querySelector(".linksInput"));
        const rightArr = parse(inputDiv.querySelector(".rechtsInput"));
        const upArr = parse(inputDiv.querySelector(".bovenInput"));
        const downArr = parse(inputDiv.querySelector(".onderInput"));




        // Genereer sponsors voor deze verdieping via sponsorcount
        // geef mee: ruimte, aantallenArray, richting, verdiepingsnummer

        // dit zijn de sponsors die via de tijdelijke array newSponsors zijn megegeven aan sponsorcount
        const currentSponsors = [
            ...sponsorcount(left, leftArr, "columns", verdiepingsnummer),
            ...sponsorcount(right, rightArr, "columns", verdiepingsnummer),
            ...sponsorcount(up, upArr, "rows", verdiepingsnummer),
            ...sponsorcount(down, downArr, "rows", verdiepingsnummer)
        ];

        // Verwijder oude sponsors van deze verdieping uit globale array, zo voorkomen dat db onnodig vol loopt met heel veel sponsors
        sponsorData = sponsorData.filter(sponsors => sponsors.verdieping !== verdiepingsnummer);

        // currentsponsors hierboven komt in sponsorData (de database info array)
        sponsorData.push(...currentSponsors);

        // als niets in de arrays (niks ingevuld)
        if (leftArr.length === 0 && rightArr.length === 0 && upArr.length === 0 && downArr.length === 0) {
            alert("Geen sponsor data om op te slaan!");
            return;
        }

        // Opslaan naar database
        fetch("saveSponsors.php", { // stuur naar savesponsors.php (INSERT)
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentSponsors) // daar currentSponsors omgezet naar json bestand
        })
            .then(() => { // gelukt, dan message
                alert("Opgeslagen in database!")

                laadSponsors() // opnieuw sponsors laden met actuele data (nodig voor kleuren uit db correct laden)


            })
    });

    // alles van stadion bewaren in verdiepingen array, zodat je makkelijk kan wisselen
    verdiepingen.push({ stadion, inputDiv });

}
// ------------------------------------------------------------------------------------------

// functie die datepicker verwijderd als er geen verdiepingen zijn

function datepickerzichtbaarheid() {
    const tijdInput = document.querySelector(".tijd-input");
    if (verdiepingen.length > 0) {
        tijdInput.style.display = "block"
    }
    else {
        tijdInput.style.display = "none"
    }
}

// -------------------------------------------------

//stukje code om gesimuleerdeDatum aan te passen naar date picker input

const tijdInput = document.querySelector(".tijd-input");
if (tijdInput) {

    tijdInput.addEventListener("change", () => { // bij een verandering in de datepicker
        gesimuleerdeDatum = tijdInput.value || null; // gesiumleerdeDatum wordt het gekozen datum, of blijft null als niet ingevoerd
        toonVerdieping(huidigeverdiepingIndex); // opnieuw de verdieping tonen voor lokale verlopen update
        herlaadzijkanten()
    });
}

// -------------------------------------------------------------------

// functie die de zijkanten opnieuw opbouwt (nodig voor visueel rood worden als gesimuleerdeDatum is ingesteld)
// eigenlijk een soort reset / lokale update

function herlaadzijkanten() {

    // opnieuw gegevens verzamelen voor opnieuw opbouwen van verdieping
    // getallen worden gesplit door kommas (secties)
    const parse = input => input.value.split(",").map(n => Number(n.trim())).filter(n => n > 0); // parse is getallen van input gescheiden van kommas


    // inputs verkrijgen van deze verdieping om weer opnieuw op te bouwen
    const dezeverdieping = verdiepingen[huidigeverdiepingIndex];
    const inputs = {
        left: parse(dezeverdieping.inputDiv.querySelector(".linksInput")),
        right: parse(dezeverdieping.inputDiv.querySelector(".rechtsInput")),
        up: parse(dezeverdieping.inputDiv.querySelector(".bovenInput")),
        down: parse(dezeverdieping.inputDiv.querySelector(".onderInput"))
    }

    // opnieuw de zijdes aanmaken met deze gegevens (dus een refresh van de verdieping)
    // hierdoor worden sponsors meteen rood als de gesimuleerdetijd groter is dan einddatum
    sponsorcount(dezeverdieping.stadion.querySelector(".left"), (inputs.left), "columns", huidigeverdiepingIndex + 1);
    sponsorcount(dezeverdieping.stadion.querySelector(".right"), (inputs.right), "columns", huidigeverdiepingIndex + 1);
    sponsorcount(dezeverdieping.stadion.querySelector(".up"), (inputs.up), "rows", huidigeverdiepingIndex + 1);
    sponsorcount(dezeverdieping.stadion.querySelector(".down"), (inputs.down), "rows", huidigeverdiepingIndex + 1);
}

// -----------------------------------------------------

// functie om huidigedatum te krijgen, (wordt gebruikt om newdate te vervangen en later te vervangen met gesimuleerdeDatum)

function getHuidigeDatum() {
    if (gesimuleerdeDatum) { // als gesimuleerde datum (dus als datepicker is ingevuld)
        return new Date(gesimuleerdeDatum); // new date wordt gesimuleerdeDatum
    } else { // anders (datepicker is nooit ingevuld)
        return new Date(); // gebruik gewoon new Date (huidige tijd)
    }
}
// ---------------------------------------------------------

// functie voor het resetten van ALLE verdiepingen (knop staat in innerHTML)

function resetVerdiepingen() {
    fetch("deleteALLEsponsors.php", { // fetch naar deleteAllesponsors.php
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ sponsors: sponsorData }) // sponsorData (array met alle DB sponsors wordt meegestruud om te verwijderen)
    })
        .then(response => { // als dat gelukt is, update lokaal alles
            if (response.ok) {

                // lokale updates van alles op beeld
                verdiepingen = [];
                sponsorData = [];
                container.innerHTML = '';
                document.getElementById("inputs-container").innerHTML = "";
                updateNavigatieKnoppen();
                verdiepingtekstcontainer.innerHTML = "";
                datepickerzichtbaarheid()

            }
        })
};



// functie meerachtergrondenmenuutje openen en keuze maken-----------------------------------
function meerachtergronden() {

    //sluit knop
    const sluitknop = document.getElementById("menu-sluitknop");
    sluitknop.addEventListener("click", () => {
        fadeMenu.classList.remove("show"); // menu gaat dicht
    })


    const fadeMenu = document.getElementById("fade-achter-menu2"); // container met menu erin
    fadeMenu.classList.add("show"); // menu gaat open

    const plaatjes = document.querySelectorAll(".achtergrondkeuze") // klikbare plaatjes
    const veld = verdiepingen[huidigeverdiepingIndex].stadion.querySelector(".veld"); // veld van deze verdieping

    plaatjes.forEach(img => {
        img.onclick = () => { // bij een klik op het plaatje
            const gekozenAchtergrond = img.dataset.value; // gekozen antwoord wordt de keuze

            veld.src = gekozenAchtergrond + ".png"; // src wordt keuze + png
            fadeMenu.classList.remove("show"); // bij keuze sluit menu

            fetch("updateAchtergrond.php", { // pak alles van updateAhtergrond.php
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ // achtergrond en huidigeverdieping meesturen
                    achtergrond: gekozenAchtergrond,
                    verdieping: huidigeverdiepingIndex + 1
                })
            })
        }
    });
}



// stukje code voor het genereren en van nieuwe verdiepingen -------------------------


// Genereer verdiepingen op knop
generateBtn.addEventListener("click", () => {
    const aantal = Number(verdiepingenInput.value); // aantal is de input.
    if (aantal <= 0 || isNaN(aantal)) { // als dat 0 of niets is, geef error
        alert("vul minimaal 1 verdieping in")
        return;
    }


    for (let i = 1; i <= aantal; i++) { // voor elk aantal (elk getal in de input, maak een verdieping)
        maakVerdieping();
    }

    //Zet de huidige verdieping op 0 en toon deze
    huidigeverdiepingIndex = 0;
    toonVerdieping(huidigeverdiepingIndex);

    //Update navigatieknoppen en generate knop tekst en datepicker zichtbaarheid
    updateNavigatieKnoppen();
    updateGenerateBtnText();
    datepickerzichtbaarheid()
    alert(`${aantal} verdiepingen toegevoegd`);
});

// --------------------------------------------------


// functie voor tekst veranderen bij knop als er al verdiepingen zijn -------------------------------

function updateGenerateBtnText() {
    if (verdiepingen.length === 0) {
        generateBtn.value = "Genereer verdiepingen";
    } else {
        generateBtn.value = "Genereer meer verdiepingen";
    }
}
updateGenerateBtnText() // aanroepen bij laden page



// functie om verdieping + titel te tonen -----------------------------------

function toonVerdieping(index) {

    //eerst verdiepingnaam ophalen

    fetch("getverdiepingTitel.php")
        .then(res => res.json()) // zet response om in JSON
        .then(data => { // resultaat heet data
            verdiepingTitelsDB = {};
            data.forEach(v => { // voor alle data, vul de verdiepingTitelDB array met verdiepingnummer en de boventitel
                verdiepingTitelsDB[v.verdieping_nummer] = v.boventitel; // bijv 1 = verdieping 1
            });


            // tekst die in de titel moet komen, is of het resltaat uit de DB, of plattegrond 1,2,3,4 etc
            const verdiepingTEXT = verdiepingTitelsDB[index + 1] || `Plattegrond Verdieping ${index + 1}`; // of wat er in de verdiepingDB staat, anders huidige verdieping
            verdiepingtekstcontainer.innerHTML = `<h3 id='verdieping-titel' contenteditable="true">${verdiepingTEXT}</h3>`; // verdiepingtekst, gevuld met wat hierboven staat

            const verdiepingTitel = document.getElementById('verdieping-titel'); // titel van verdieping
            verdiepingTitel.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { // als er wordt gedrukt op enter
                    e.preventDefault(); // preventdefault = voorkom dat er een <br> met enter getypt wordt
                }
            })

            // bij een verandering van input (iemand is aan het typen)
            // sla het ingevoerde op naar de verdieping tabel in de DB
            verdiepingTitel.addEventListener("input", () => {
                fetch("saveverdiepingTitel.php", { // pak alles van saveTitel.php
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ // achtergrond en huidigeverdieping meesturen
                        titel: verdiepingTitel.innerText,
                        verdieping_id: index + 1
                    })
                })
            })
        })



    container.innerHTML = ""; // verwijder huidige inhoud (zo krijg je er maar 1 verdieping op het beeld)
    const inputsContainer = document.getElementById("inputs-container"); // container met input van side menu
    inputsContainer.innerHTML = ""; // verwijder ook huidige sidemenu inhoude, zo krijg je maar 1 verdieping opties in sidemenu

    if (verdiepingen[index]) {
        container.appendChild(verdiepingen[index].stadion); // zet de stadion van die index (alleen huidige op scherm) in de container (stadioncontainer)
        inputsContainer.appendChild(verdiepingen[index].inputDiv); // zet de inputs van die index (alleen huidige op scherm) in de container (stadioncontainer)
    }
}

// functie om alleen huidige verdieping te verwijderen (knop druk) ------------------
// dit pas na de titel tonen functie, omdat anders namen niet geupdate worden

function verwijderDEZEverdieping() {
    const huidigeVerdiepingNummer = huidigeverdiepingIndex + 1;

    fetch("deleteHuidigeVerdieping.php", { // pak alles van deleteHuidigeVerdieping.php
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            verdieping: huidigeVerdiepingNummer // stuur mee huidigeverdiepingNummer als verdieping
        })
    });

    // huidige verdieping verwijderen omdat de gebruiker op de knop drukt van DIE verdieping
    verdiepingen.splice(huidigeverdiepingIndex, 1); // verwijder huidige verdieping uit verdiepingen array


    // loop door elke sponsorData element
    for (let i = sponsorData.length - 1; i >= 0; i--) {
        // wanneer sponsorData's verdieping op verwijderde verdieping staat
        if (sponsorData[i].verdieping === huidigeVerdiepingNummer) {
            // Verwijder dat element (dus alle sponsors + verdieping)
            sponsorData.splice(i, 1);

            // als het element in een hogere verdieping dan de verwijderde staat
        } else if (sponsorData[i].verdieping > huidigeVerdiepingNummer) {
            // Verminder verdiepingsnummer voor sponsorData (dus 3 wordt 2 bijv)
            sponsorData[i].verdieping--;
        }
    }

    // bij het verwijderen van de laatste verdieping, doe -1 voor huidigeverdiepingindex
    // zo ziet gaat de gebruiker ook automatisch 1 verdieping lager
    if (huidigeverdiepingIndex >= verdiepingen.length) {
        huidigeverdiepingIndex = verdiepingen.length - 1;
    }

    // lokale upaten van verdiepingen

// als huidigeverdiepingIndex
    if (huidigeverdiepingIndex >= 0) { // huidigeverdieping index groter dan 0 of 0 is. Er is nog een verdieping
        toonVerdieping(huidigeverdiepingIndex); // update lokaal bij verwijderen van verdieping
    } else { // anders (er zijn geen verdiepingen meer, je verwijdert de laatste)
        container.innerHTML = ""; // verwijder stadion
        document.getElementById("inputs-container").innerHTML = ""; // inputs leeg
        verdiepingtekstcontainer.innerHTML = ""; // geen tekst
    }

    // anders lokale updates
    datepickerzichtbaarheid()
    updateNavigatieKnoppen();
}
// ------------------------------------------------------



// verdieping + en - knoppen ---------------------------------------------

document.getElementById("prevBtn").addEventListener("click", () => {
    if (huidigeverdiepingIndex > 0) { // zolang het groter is dan nul
        huidigeverdiepingIndex--; // kan je naar beneden
        toonVerdieping(huidigeverdiepingIndex); // laat verdieping zien
        herlaadzijkanten() // zijkanten herladen (voor rode sponsor tonen alle verdiepingen)
    }
});

document.getElementById("nextBtn").addEventListener("click", () => {
    if (huidigeverdiepingIndex < verdiepingen.length - 1) { // als het kleiner is dan verdiepingen in de array - 1 (laatste)
        huidigeverdiepingIndex++; // kan je naar boven
        toonVerdieping(huidigeverdiepingIndex); // laat verdieping zien
        herlaadzijkanten() // zijkanten herladen (voor rode sponsor tonen alle verdiepingen)

    }
});

// media query voor de knoppen, ze komen in het sidemenu ipv rechts bij 1700px

const OriginelePlek = document.getElementById("navButtons-wrapper");
const NieuwePlek = document.getElementById("verdiepingenInput-wrapper");

const mediaquery = window.matchMedia("(max-width: 1700px)");

function veranderenKnopPositie(e) {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (e.matches) {
        // als er nog geen wrapper is, maak die met display flex (nodig voor knoppen naast elkaar)
        let flexWrapper = document.getElementById("flexWrapper");
        if (!flexWrapper) {
            flexWrapper = document.createElement("div");
            flexWrapper.id = "flexWrapper";
            flexWrapper.style.display = "flex";
            flexWrapper.style.gap = "10px";
            flexWrapper.style.padding = "10px";
            flexWrapper.style.justifyContent = "center"
            NieuwePlek.appendChild(flexWrapper); // zet de wrapper met buttons in sidecontainer
        }

        // Buttons in de nieuwe wrapper plaatsen
        flexWrapper.appendChild(prevBtn);
        flexWrapper.appendChild(nextBtn);

    } else {
        // als weer groter dan 1700px, buttons gaan terug naar originele positie
        OriginelePlek.appendChild(prevBtn);
        OriginelePlek.appendChild(nextBtn);

    }
}

// bij een change, dus mediaquery gaat af, voer deze verander functie uit
mediaquery.addEventListener("change", veranderenKnopPositie);

// Direct bij laden uitvoeren
veranderenKnopPositie(mediaquery);


// functie voor het uitzetten van knoppen als er geen verdiepingen zijn (beginstaat pagina) ------------------------------------------------

function updateNavigatieKnoppen() {
    if (verdiepingen.length === 0) {

        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
    } else {
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
    }
}
updateNavigatieKnoppen(); // bij pagina laad, update knoppen


// functie voor stadion bouwen uit database ----------------------------------------------------------------------------

function laadSponsors() {
    fetch("getSponsors.php") // pakt alles van getSponsors.php (SELECT)
        .then(response => response.json()) // wordt teruggestuurd in json
        .then(data => { // data = array met antwoord van getSponsors (dus alle sponsors en hun info)


            if (data.length === 0) {
                return; // als er niets in de database is, laad niets
            }

            sponsorData = data; // sponsorData vullen met data uit database. Nodig Om sponsors rood te maken

            let maxVerdieping = 0; // maxverdiepingen is standaard 0

            for (let i = 0; i < data.length; i++) { // voor elke sponsor in data (dus uit de SELECT)
                if (data[i].verdieping > maxVerdieping) { // kijk per sponsor of de verdiepingswaarde groter is dan maxverdieping
                    maxVerdieping = data[i].verdieping; // maxverdieping update dan elke keer, op het eind van de loop heb je de uiteindelijke maxverdieping
                }
            }

            if (maxVerdieping === 0) return; // als maxverdieping 0 is (geen verdiepingen) stop de code


            if (verdiepingen.length === 0) { // alleen nieuwe verdiepingen maken als ze er nog niet zijn
                for (let i = 1; i <= maxVerdieping; i++) { // maak zoveel verdiepingen als maxverdieping
                    maakVerdieping();
                }
            }

            datepickerzichtbaarheid() // na verdiepingen maken, ook zichtbaarheid van datepicker updaten
            // zorgt ervoor dat bij een refresh de datepicker nogsteeds zichtbaar is


            const verdiepingData = {}; // verdiepingsdata object
            data.forEach(sponsor => { // voor elke sponsor van de SELECT
                const key = `verdieping_${sponsor.verdieping}`; // voor elke sponsor wordt bepaald welke verdieping hij zit, bijv verdieping_1
                if (!verdiepingData[key]) { // als nog geen entry voor verdiepingen van die sponsor
                    verdiepingData[key] = { up: [], down: [], left: [], right: [] }; // maak er een aan met zijdes
                    // dus dat wordt bijv: verdieping_1 { up: [], down: [], left: [], right: []  }
                }
                verdiepingData[key][sponsor.zijde].push(sponsor); // voeg de sponsor toe aan de juiste zijde van veld (links, rechts enz )
            });


            // voor elke gemaakte verdieping
            for (let i = 0; i < maxVerdieping; i++) {
                const verdiepingsnummer = i + 1; //verdiepingsnummer = steeds 1,2,3.... tot maxverdieping
                const currentVerdieping = verdiepingen[i]; // currrentverdieping = huidige verdieping uit array verdiepingen
                const dataForVerdieping = verdiepingData[`verdieping_${verdiepingsnummer}`];
                // dataforverdieping = alle sponsors voor die specifieke verdieping (up, down, left, right) 

                if (!dataForVerdieping) continue; // als er geen data voor verdieping (lege verdieping), sla deze hele loop over


                const verdiepingsAchtergronden = {}; // object om achtergrond per verdieping op te slaan

                data.forEach(sponsor => { // loop door elke sponsor van de SELECT
                    if (sponsor.achtergrond) { // als de sponsor een achtergrond heeft in de DB:
                        verdiepingsAchtergronden[sponsor.verdieping] = sponsor.achtergrond; // zet dan de achtergrond uit de DB van die verdieping in de object 
                    }
                });

                // Pas achtergrond toe bij elke verdieping
                // loop door elke verdieping heen
                for (let i = 0; i < verdiepingen.length; i++) {
                    const verdiepingsnummer = i + 1;
                    const stadionDiv = verdiepingen[i].stadion;
                    const veld = stadionDiv.querySelector(".veld");

                    if (verdiepingsAchtergronden[verdiepingsnummer]) { // als huidige verdieping een achtergrond in de DB heeft
                        veld.src = verdiepingsAchtergronden[verdiepingsnummer] + ".png"; // geef hem die + png
                    } else {
                        veld.src = "grijs.png"; // anders, grijs.png (standaard)
                    }
                }


                const inputs = {
                    left: currentVerdieping.inputDiv.querySelector(".linksInput"),
                    right: currentVerdieping.inputDiv.querySelector(".rechtsInput"),
                    up: currentVerdieping.inputDiv.querySelector(".bovenInput"),
                    down: currentVerdieping.inputDiv.querySelector(".onderInput")
                };

                // functie om per sectie aantal sponsors te tonen gescheiden door kommas
                const getSectieString = (sponsors) => { // krijgt array van sponsors
                    if (sponsors.length === 0) return ""; // als niets (geen sponsors), stop de code


                    // DATABSASE KOLOM IS secties

                    const sectieCounts = {}; // sectieCounts object
                    sponsors.forEach(s => { // loop door elke sponsor en noem het s
                        const sectie = s.secties; // sectie is sectie uit de DB van die sponsor
                        sectieCounts[sectie] = (sectieCounts[sectie] || 0) + 1; // kijk of er een getal is voor deze sectie in DB, als niet, neem 0. Tel 1 op
                        // resultaat wordt: "1" : 3, "2" : 3 betekent sectie 1 heeft 3 sponsors. sectie 2 heeft 3 sponsors
                    });

                    const result = Object.keys(sectieCounts) // result is keys van sectie counts, dus die sectie 1 en sectie 2 van hierboven
                        .map(key => sectieCounts[key]) // voor elke key haal de sponsors op: , dus die 3 en 3 van hierboven
                        .join(','); //zet de array om in een komma gescheiden string, dus "3,3"

                    return result; // geeft dan "3,3 terug"
                };

                // Vul de inputvelden (Right en Down direct)
                inputs.right.value = getSectieString(dataForVerdieping.right); // geeft dat komma gescheiden getal terug en doet in de input
                inputs.down.value = getSectieString(dataForVerdieping.down);
                inputs.left.value = getSectieString(dataForVerdieping.left);
                inputs.up.value = getSectieString(dataForVerdieping.up);


                // velden voor deze verdieping
                const stadionDiv = currentVerdieping.stadion;
                const left2 = stadionDiv.querySelector(".left");
                const right2 = stadionDiv.querySelector(".right");
                const up2 = stadionDiv.querySelector(".up");
                const down2 = stadionDiv.querySelector(".down");

                // Parse de input waardes voor de visualisatie
                const parseVisual = input => input.value.split(",").map(n => Number(n.trim())).filter(n => n > 0); // maakt losse getallen, geschieden met komma
                // dus "1,2,3" wordt "1", "2", "3". Bruikbaar voor maken van stadion

                const leftArrVisual = parseVisual(inputs.left);
                const rightArrVisual = parseVisual(inputs.right);
                const upArrVisual = parseVisual(inputs.up);
                const downArrVisual = parseVisual(inputs.down);


                // functie van verdiepingzijdes opbouwen aanroepen met:
                // geef mee: ruimte, aantallenArray, richting, verdiepingsnummer
                sponsorcount(left2, leftArrVisual, "columns", verdiepingsnummer);
                sponsorcount(right2, rightArrVisual, "columns", verdiepingsnummer);
                sponsorcount(up2, upArrVisual, "rows", verdiepingsnummer);
                sponsorcount(down2, downArrVisual, "rows", verdiepingsnummer);
            }

            // toon eerste verdieping en update knoppen
            huidigeverdiepingIndex = 0;
            toonVerdieping(huidigeverdiepingIndex);
            updateNavigatieKnoppen();
            updateGenerateBtnText();
        })
}

laadSponsors();


// fucntie om menu van specifieke sponsor te openen -------------------------------------------

const fadeachtermenu = document.getElementById("fade-achter-menu"); // globaal, anders werkt niet met innerHTMl onclick


function openmenu(sponsor) {
    geselecteerdeKleur = null; // reset van kleur bij elke andere sponsor
    fadeachtermenu.classList.add("show"); // laat fade op achtergrond zien, dus ook menu die erin zit


    // exacte match vinden van de sponsor, zodat hij weet welke er geklikt is (nodig voor naam selecteren)
    const dbSponsor = sponsorData.find(s =>
        s.verdieping == sponsor.verdieping &&
        s.zijde == sponsor.zijde &&
        s.secties == sponsor.sectie &&
        s.positie == sponsor.positie
    )

    // sponsorNaam = naam  in database van de match of geen naam gevonden
    const sponsorNaam = dbSponsor?.naam || ""; // dit hier onder tonen in het menu.innerHTML


    // Vul het menu met info van deze sponsor
    const menu = document.getElementById("menu");
    menu.innerHTML = `
    <div id="titelenX-wrapper">
    <h2 id="titel-menu">Sponsor Info</h2>
        <button id="menu-sluitknop" onclick="fadeachtermenu.classList.remove('show')">X</button></div>

        <p><b>Verdieping:</b> ${sponsor.verdieping}</p>
        <p><b>Zijde:</b> ${sponsor.zijde}</p>
        <p><b>Sectie:</b> ${sponsor.sectie}</p>
        <p><b>Positie:</b> ${sponsor.positie}</p>
        <p><b>Naam:</b> ${sponsorNaam || "<span style='color:red; font-weight:bold;'>geen naam in database gevonden</span>"}</p>

        <b>Einddatum instellen:</b>
        <input type="date" id="einddatumInput""><br>

        <b>Sponsornaam instellen:</b>
        <input type="text" id="naamInput" value="${sponsorNaam || ''}"><br>



        <b id='kleur-instellen-tekst'>Kleur instellen:</b>

        <div id="button-wrapper">
        <button class="menukleuren" id="none" value="">None</button>
        <button class="menukleuren" id="blauw" value="blue"></button>
        <button class="menukleuren" id="lichtblauw" value="lightblue"></button>
        <button class="menukleuren" id="indigo" value="indigo"></button>
        <button class="menukleuren" id="paars" value="purple"></button>
        <button class="menukleuren" id="violet" value="violet"></button>
        <button class="menukleuren" id="roze" value="pink"></button>
        <button class="menukleuren" id="geel" value="yellow"></button>
        <button class="menukleuren" id="oranje" value="orange"></button>
        <button class="menukleuren" id="lichtgroen" value="lightgreen"></button>
        <button class="menukleuren" id="groen" value="green"></button>
        <button class="menukleuren" id="grijs" value="grey"></button>
        </div>
        <button id="deleteBtn">Sponsor verwijderen</button>
        <button id="savemenuBtn">Sponsor Opslaan</button>
    `;

    // sponsor verlopen check
    // de sponsor is verlopen als:
    const verlopen = dbSponsor?.eindtijd && dbSponsor.eindtijd !== "0000-00-00" && // het niet 0 is
        !isNaN(new Date(dbSponsor.eindtijd).getTime()) && // een geldige datum is
        new Date(dbSponsor.eindtijd) < getHuidigeDatum(); // het kleiner is dan vandaag of resultaat uit datepicker

    // Selecteer container van kleurknoppen
    const menukleurenContainer = document.getElementById("button-wrapper");
    const kleurInstellenTekst = document.getElementById("kleur-instellen-tekst")

    const verlopenmelding = document.createElement("p")
    verlopenmelding.innerText = "De sponsor is verlopen, kleur aanpassen is nu niet mogelijk. Verleng de einddatum om dit wel te kunnen."

    // als sponsor is verlopen
    if (verlopen) {
        menukleurenContainer.style.display = "none"; // verberg de kleurenknoppen
        kleurInstellenTekst.style.display = "none"
        menu.appendChild(verlopenmelding) // voeg de verlopenmelding toe

    } else { // anders (als eindtijd is verlengt)
        menukleurenContainer.style.display = "flex"; // laat knoppen weer zien
        kleurInstellenTekst.style.display = "block"

    }

    document.querySelectorAll(".menukleuren").forEach(btn => { // loop door elke knop

        // OPSTART: als kleur uit db overeenkomt, maakt hij knop selected
        if (btn.id !== "none") { // reset knop niet, want dat is gek dat die een outline heeft bij opstart
            btn.classList.toggle('selected', btn.value === dbSponsor?.kleur)
        }

        // BIJ KLIK OP ANDERE KNOP: maak die selected en haal oude selected weg
        btn.addEventListener("click", () => {
            geselecteerdeKleur = btn.value
            document.querySelectorAll(".menukleuren").forEach(b => b.classList.remove('selected'));


            // geklikte knop wordt selected
            btn.classList.add('selected');
        })
    })



    document.getElementById("savemenuBtn").addEventListener("click", () => { // bij klik op saveknop
        const einddatum = document.getElementById("einddatumInput").value; // einddatum is = gekozen input
        const sponsorNaam = document.getElementById("naamInput").value;

        // kleur om op te slaan is geselecteerde kleur van buttons, of kleur uit db.
        // zo weet hij ook elke kleur te gebruiken als buttons niet zijn ingevuld (bijv na reset)
        let kleurOmOpTeSlaan;

        if (geselecteerdeKleur !== null) {
            kleurOmOpTeSlaan = geselecteerdeKleur; // als buttons geklikt: word dat kleuromopteslaan
        } else if (dbSponsor?.kleur) {
            kleurOmOpTeSlaan = dbSponsor.kleur; // bij binnenkomst: kijk naar database kleur, dat word kleuromopteslaan
        }



        fetch("updateSponsor.php", { // pakt alles van deze file (UPDATE)
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // stuurt gegevens mee van deze geklikte sponsor + nieuwe eindtijd
                verdieping: sponsor.verdieping,
                zijde: sponsor.zijde,
                sectie: sponsor.sectie,
                positie: sponsor.positie,
                eindtijd: einddatum,
                kleur: kleurOmOpTeSlaan,
                naam: sponsorNaam
            })
        })
            .then(() => {

                //lokale updates van menu opties (zonder refresh)

                // eerst sponsorData opnieuw vullen met nieuwe gefetchte data (reset dat lokaal alles zeker de nieuwe dingen krijgen):
                // nodig voor lokale update van sponsornaam
                dbSponsor.naam = sponsorNaam;
                dbSponsor.kleur = kleurOmOpTeSlaan;
                dbSponsor.eindtijd = einddatum;


                // lokaal updaten van kleur sponsor
                const einddatumDate = new Date(einddatum);

                if (!isNaN(einddatumDate) && einddatumDate <= getHuidigeDatum()) {
                    sponsor.element.style.backgroundColor = "red"; // als einddatumdate kleiner is dan vandaag (verlopen), maak lokaak rood
                } else if (kleurOmOpTeSlaan) { // als er een kleur is gekozen met de buttons, toon die dan
                    sponsor.element.style.backgroundColor = kleurOmOpTeSlaan;
                } else { // anders (bij none), toon standaard
                    sponsor.element.style.backgroundColor = "";
                }


                fadeachtermenu.classList.remove("show") // sluit als op opslaan geklikt is
                alert("Sponsor wijzigingen opgeslagen!")
            })
    }
    )

    // bij een klik op de delete sponsor knop
    document.getElementById("deleteBtn").addEventListener("click", () => {

        const sponsorDataToDelete = { // data to delete is de data van deze exacte sponsor
            // pakt gewoon de data van deze geklikte sponsor
            verdieping: sponsor.verdieping,
            zijde: sponsor.zijde,
            sectie: sponsor.sectie,
            positie: sponsor.positie
        };

        fetch("deleteSPECIFIEKESponsor.php", { // pakt alles van deleteSPECIFIEKEsponsors.php (het verwijderen van specifieke sponsor)
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sponsorDataToDelete) // zet sponsordata om in JSON zodat het bruikbaar is in delete.php
        })
            .then(() => { // als gelukt, sluit menu
                fadeachtermenu.classList.remove("show");

                laadSponsors(); // herlaad alle sponsors

            })
    });
}
