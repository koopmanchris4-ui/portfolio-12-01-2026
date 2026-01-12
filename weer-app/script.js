let gradenOfCelcius = "metric" // metric = celcius, imperial = farenheit
let huidigeStad = ""; // huidige stad op begin leeg, onthoud voor de verander functie
let huidigeLat = null // Latitiude op begin  = 0
let huidigeLon = null // longitude op begin = 0


// =======================================================================================================================================

// Handmatig stad invoer



async function haalWeerOp() {
    const eenheid = gradenOfCelcius === "metric" ? "°C" : "°F";
    const stad = document.getElementById("stad").value.trim();
    const apiKey = "ffebe1f70a66e0c6db170ad0680314fd";
    const weerresultaat = document.getElementById("weerresultaat");
    const resultaatVandaag = document.getElementById("weerresultaat-specifieke-dag");
    const meerdereresultaten = document.getElementById("meerdere-resultaten") // meerdere resultaten container voor dubbele namen
    document.getElementById("toggleMeerdaagsBtn").style.display = "none"; // standaard button onzichtbaar








    if (stad) { // als gebruiker een stad invult

        // uitlezen json voor geo (je coordinaten)
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${stad}&limit=5&appid=${apiKey}`; // haal locaties op met Geo URL
        const geoRes = await fetch(geoUrl) // response = fetch van geoUrl
        const geoData = await geoRes.json() // ophalen van info
        huidigeLat = null // reset bij nieuwe ingevoerde stad de coordinaten (nodig voor de werking van error message)
        huidigeLon = null
        huidigeStad = ""; // reset huidigeStad bij nieuwe ingevoerde stad
        weerresultaat.innerHTML = "" // leeg de weerresultaat (van andere dagen) bij nieuwe zoekopdracht
        weerresultaat.style.display = "none" // maak resultaten (van andere dagen) onzichtbaar bij nieuwe zoekopdracht
        resultaatVandaag.innerHTML = "" // leeg resultaat vandaag bij nieuwe zoekopdracht
        resultaatVandaag.style.display = "none" // maak resultaat vandaag onzichtbaar bij nieuwe zoekopdracht







        const uniekeNamen = [] // array met unieke namen (zodat dezelfde knoppen niet 2 keer voorkomen bij aanmaken)


        if (geoData.length > 1) { // als er meerdere resultaten zijn gevonden voor de zoekopdacht
            meerdereresultaten.style.display = "block" // laat meerdere resultaten (keuze menu) zien
            meerdereresultaten.innerHTML = "<p>Meerdere resultaten gevonden:</p>";
            geoData.forEach(item => { //loop door geoData en noem alles gevonden "item"
                const naam = `${item.name}, ${item.state}, ${item.country}`; // maak variabel genaamd "naam" die namen heeft van elk gevonden item
                if (!uniekeNamen.includes(naam)) { // als naam niet in de unieke namen array staat:
                    uniekeNamen.push(naam); // voeg naam toe aan uniekeNamen array
                    // voor elke item in unieke namen. maak een button. Zo krijg je geen dubbele 
                    const btn = document.createElement("button"); // maak button aan voor elk gevonden item
                    btn.classList.add("meer-resultaten-knop")
                    btn.textContent = `${item.name}  ${item.state ? ", " + item.state : ""}, ${item.country}`; // zet naam en country en provincie in de button
                    btn.onclick = () => {
                        huidigeLat = item.lat; // bij klikken zet Huidige coordinaten naar coordinaten van item
                        huidigeLon = item.lon;
                        huidigeStad = `${item.name}${item.state ? ", " + item.state : ""}`; //huidige stad opslaan, nodig voor titel van stad bovenaan bij buttonklik (niet anders worden, voorkomt verwarrubg) 
                        document.getElementById("stad").value = ""; // zet input weer leeg na klikken
                        meerdereresultaten.style.display = "none" // na klikken maak meerdere resultaten (het menu) niet zichbaat
                        haalWeerOp(); // voer de haalweeropfunctie uit zodat hij meteen zoekt

                    };
                    meerdereresultaten.appendChild(btn); // voeg buttons toe aan weerresultaat div
                }
            });
            return;
            // als er maar 1 resultaat is
        } else if (geoData.length === 1) {
            huidigeLat = geoData[0].lat // verander coordinaten van die van de stad die je zoekt
            huidigeLon = geoData[0].lon
        }
    }


    if (huidigeLat === null || huidigeLon === null) { // als geen cordinaten gevonden van dat item (door iets anders getypt)
        meerdereresultaten.style.display = "block" // laat meerdere resultaten menuutje zien met error erin
        meerdereresultaten.innerHTML = "<p>Geen resultaten gevonden</p>"; // error, geen resultaten
        return;
    }

    // =======================================================================================================================================


    // uitlezen jason voor forecast (voorspelling) bij handmatige invoer

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${huidigeLat}&lon=${huidigeLon}&appid=${apiKey}&units=${gradenOfCelcius}&lang=nl`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)

    // =======================================================================================================================================


    // dit stukje is nodig voor het krijgen van input of button tekst als tekstje bovenin weeresultaat (bijv Soest, NL), zodat het niet heel anders wordt (verwarring voorkomen)
    // 1 = gebruik gekozem knopstad
    // 2 = gebruik wat ingetypt is
    // 3 = gebruik wat in de API staat
    if (huidigeStad && huidigeStad !== "") { // als huidige stad ingevuld is
        naamVanStad = huidigeStad; // naam van stad wordt huidige stad
    } else if (stad && stad !== "") { // als gebruik iets geeft ingetypt
        naamVanStad = stad; // naam van stad wordt stad (invoer)
    } else { // anders
        naamVanStad = data.city.name; // naam van stad wordt zoals in json file
    }

    document.getElementById("stadNaam").textContent = `${naamVanStad}, ${data.city.country}`; // zet stad en land boven in div stadNaam
    // =======================================================================================================================================



    //laten zien van resultaten, handmatig ingevoerd (input stad)
    // alles wat tussen de ` staat wordt getoont, (temperatuur, huidig weer en plaatje)



    //resultaten van vandaag per 3 uur


    resultaatVandaag.style.display = "block" // resultaten vandaag zichbaar

    const vandaag = new Date().toISOString().split('T')[0]; //ophalen van datum (jaar - maand- dag) van vandaag
    resultaatVandaag.innerHTML = `
    <h2>Het weer vandaag</h2>
`


    data.list.forEach(item => { // loop door elk item
        if (item.dt_txt.startsWith(vandaag)) { // als de dautm van APi item overeenkomt met opgehaalde datum die net gemaakt is

            // toon tijd, (alleen in uren door de split en slice)
            // toon temperatuur, eenheid, weerbeschrijving en plaatje van weer
            resultaatVandaag.innerHTML += `
        <p>
        <b>${item.dt_txt.split(" ")[1].slice(0, 5)}:</b> 
                ${item.main.temp} ${eenheid},
                ${item.weather[0].description}
    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weericoon">
    </p>
    `;
        }
    });



    // resultaten van alle dagen

    weerresultaat.innerHTML = `


               <h2>${new Date(data.list[8].dt * 1000).toLocaleDateString("nl-NL", { weekday: "long" })}</h2>

                  <p> <b>Temperatuur:</b> ${data.list[8].main.temp} ${eenheid}</p>
                  <p> <b>weer:</b> ${data.list[8].weather[0].description}</p>
                  <img src="https://openweathermap.org/img/wn/${data.list[8].weather[0].icon}@2x.png" alt="weericoon">
                  <hr class="lijn"></hr>


            <br>

               <h2>${new Date(data.list[16].dt * 1000).toLocaleDateString("nl-NL", { weekday: "long" })}</h2>

                  <p> <b>Temperatuur:</b> ${data.list[16].main.temp} ${eenheid}</p>
                  <p> <b>weer:</b> ${data.list[16].weather[0].description}</p>
                  <img src="https://openweathermap.org/img/wn/${data.list[16].weather[0].icon}@2x.png" alt="weericoon">
                 <hr class="lijn"></hr>


                  
            <br>

               <h2>${new Date(data.list[24].dt * 1000).toLocaleDateString("nl-NL", { weekday: "long" })}</h2>

                  <p> <b>Temperatuur:</b> ${data.list[24].main.temp} ${eenheid}</p>
                  <p> <b>weer:</b> ${data.list[24].weather[0].description}</p>
                  <img src="https://openweathermap.org/img/wn/${data.list[24].weather[0].icon}@2x.png" alt="weericoon">
                  <hr class="lijn"></hr>


                  
            <br>

               <h2>${new Date(data.list[32].dt * 1000).toLocaleDateString("nl-NL", { weekday: "long" })}</h2>

                  <p> <b>Temperatuur:</b> ${data.list[32].main.temp} ${eenheid}</p>
                  <p> <b>weer:</b> ${data.list[32].weather[0].description}</p>
                  <img src="https://openweathermap.org/img/wn/${data.list[32].weather[0].icon}@2x.png" alt="weericoon">
                 <hr class="lijn"></hr>
    
            `;

    updateToggleButtonVisibility(); // toon de knop alleen als er data in meerdaagsdiv zit (functie helemaal onderaan)

}

// =======================================================================================================================================




// automatisch stad invoer van locatie


if (navigator.geolocation) { // als er een locatie is (toestaan gedrukt is)
    navigator.geolocation.getCurrentPosition(async pos => { // krijg de locatie van gebruiker en noem het pos
        const resultaatVandaag = document.getElementById("weerresultaat-specifieke-dag")

        resultaatVandaag.style.display = "block";

        const apiKey = "ffebe1f70a66e0c6db170ad0680314fd";
        huidigeLat = pos.coords.latitude;  //huidige Lat = coordinaten van huidige positie van gebruiker
        huidigeLon = pos.coords.longitude; //huidige Lon = coordinaten van huidige positie van gebruiker
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${huidigeLat}&lon=${huidigeLon}&appid=${apiKey}&units=${gradenOfCelcius}&lang=nl`;
        const eenheid = gradenOfCelcius === "metric" ? "°C" : "°F";


        // =======================================================================================================================================


        // uitlezen json voor forecast (voorspelling) bij automatische geolocatie van gebruiker
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)


        huidigeStad = `${data.city.name}`; // huidige stad is stad naam van API
        document.getElementById("stadNaam").textContent = `${huidigeStad}, ${data.city.country}`; // zet stad en land boven in div stadNaam


        // =======================================================================================================================================



        // laten zien van resultaten, automatische locatie 
        // alles wat tussen de ` staat wordt getoont, (temperatuur, huidig weer en plaatje)


        // resultaten vandaag per 3 uur



        //resultaten van vandaag per 3 uur


        resultaatVandaag.style.display = "block" // resultaten vandaag zichbaar

        

        const vandaag = new Date().toISOString().split('T')[0]; //ophalen van datum (jaar - maand- dag) van vandaag
        resultaatVandaag.innerHTML = "<h2>Het weer vandaag</h2>"


        data.list.forEach(item => { // loop door elk item
            if (item.dt_txt.startsWith(vandaag)) { // als de dautm van APi item overeenkomt met opgehaalde datum die net gemaakt is

                // toon tijd, (alleen in uren door de split en slice)
                // toon temperatuur, eenheid, weerbeschrijving en plaatje van weer
                resultaatVandaag.innerHTML += `
        <p>
        <b>${item.dt_txt.split(" ")[1].slice(0, 5)}:</b> 
                ${item.main.temp} ${eenheid},
                ${item.weather[0].description}
    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weericoon">
    </p>
    `;
            }
        });



        // resultaten alle dagen


        const weerresultaat = document.getElementById("weerresultaat");
        document.getElementById("weerresultaat").innerHTML = `
        
        
               <h2>${new Date(data.list[8].dt * 1000).toLocaleDateString("nl-NL", { weekday: "long" })}</h2>

                  <p> <b>Temperatuur:</b> ${data.list[8].main.temp} ${eenheid}</p>
                  <p> <b>weer:</b> ${data.list[8].weather[0].description}</p>
                  <img src="https://openweathermap.org/img/wn/${data.list[8].weather[0].icon}@2x.png" alt="weericoon">
                  <hr class="lijn"></hr>


            <br>

               <h2>${new Date(data.list[16].dt * 1000).toLocaleDateString("nl-NL", { weekday: "long" })}</h2>

                  <p> <b>Temperatuur:</b> ${data.list[16].main.temp} ${eenheid}</p>
                  <p> <b>weer:</b> ${data.list[16].weather[0].description}</p>
                  <img src="https://openweathermap.org/img/wn/${data.list[16].weather[0].icon}@2x.png" alt="weericoon">
                  <hr class="lijn"></hr>


                  
            <br>

               <h2>${new Date(data.list[24].dt * 1000).toLocaleDateString("nl-NL", { weekday: "long" })}</h2>

                  <p> <b>Temperatuur:</b> ${data.list[24].main.temp} ${eenheid}</p>
                  <p> <b>weer:</b> ${data.list[24].weather[0].description}</p>
                  <img src="https://openweathermap.org/img/wn/${data.list[24].weather[0].icon}@2x.png" alt="weericoon">
                  <hr class="lijn"></hr>


                  
            <br>

               <h2>${new Date(data.list[32].dt * 1000).toLocaleDateString("nl-NL", { weekday: "long" })}</h2>

                  <p> <b>Temperatuur:</b> ${data.list[32].main.temp} ${eenheid}</p>
                  <p> <b>weer:</b> ${data.list[32].weather[0].description}</p>
                  <img src="https://openweathermap.org/img/wn/${data.list[32].weather[0].icon}@2x.png" alt="weericoon">   
                  <hr class="lijn"></hr>
 
            `;

        updateToggleButtonVisibility(); // toon de knop alleen als er data in meerdaagsdiv zit (functie helemaal onderaan)


    })


};
// =======================================================================================================================================

// andere functies

//verander F/C

function verander() { // verander functie, nodig voor veranderen van celcius naar farenheit en andersom
    if (gradenOfCelcius === "metric") {  // als gradenOfCelsius metric is (C)
        gradenOfCelcius = "imperial"; // verander het naar imperial (f)
    } else {
        gradenOfCelcius = "metric"; // anders is het metric (C)
    }

    haalWeerOp(); // update het weer met de nieuwe eenheid
}

// enter klik


document.getElementById("stad").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        haalWeerOp();
    }
});



// toon weervoorspelling knop



document.getElementById("toggleMeerdaagsBtn").addEventListener("click", function () {
    const meerdaagsDiv = document.getElementById("weerresultaat");

    if (meerdaagsDiv.style.display === "none" || meerdaagsDiv.style.display === "") {
        meerdaagsDiv.style.display = "block";
        this.textContent = "Verberg weersvoorspelling";
    } else {
        meerdaagsDiv.style.display = "none";
        this.textContent = "Toon weersvoorspelling";
    }
});

// =======================================================================================================================================

// laat knop niet zien als er niets in weerresultaat div zit

function updateToggleButtonVisibility() {
    const toggleBtn = document.getElementById("toggleMeerdaagsBtn");
    const meerdaagsDiv = document.getElementById("weerresultaat");

    // Verberg knop als div leeg of alleen witruimte bevat
    if (!meerdaagsDiv.innerHTML.trim()) {
        toggleBtn.style.display = "none";
    } else {
        toggleBtn.style.display = "block";
    }
}


// nachtkleuren als het nacht is

const nu = new Date(); // krijg datum
const uur = nu.getHours(); // lkrijg uren op basis van die datum


if (uur >= 21 || uur < 6) { //nacht 
    document.body.classList.add("nacht"); // maak achtergrond kleur nacht kleur
    document.getElementById("weerresultaat").style.backgroundColor = "rgba(63, 79, 113, 0.9)" // maak weerresultaat (andere dagen) nachtkleur
    document.getElementById("weerresultaat-specifieke-dag").style.backgroundColor = "rgba(63, 79, 113, 0.9)" // maak vandaag nachtkleur
    document.getElementById("toggleMeerdaagsBtn").style.backgroundColor = "rgba(82, 98, 132, 0.9)" // maak toon weervorospelling knop nachtkleur
    document.getElementById("stad").style.backgroundColor = "rgba(82, 98, 132, 0.9)" // maak input nachtkleur
    document.getElementById("stad").style.color = "white" // maak input text wit
    document.getElementById("stad").classList.add("nacht"); // maak placeholder van input wit
    document.getElementById("opslaan-knop").style.backgroundColor = "rgba(82, 98, 132, 0.9)" // // maak haal weer op knop nachtkleur
    document.getElementById("verander").style.backgroundColor = "rgba(82, 98, 132, 0.9)" // maak verander waarde knop nachtkleur
    document.getElementById("meerdere-resultaten").style.backgroundColor = "rgba(82, 98, 132, 0.9)" // meerdere resultaten tekst en error nachtkleur
    document.getElementsByClassName("meer-resultaten-knop").style.backgroundColor = "rgba(82, 98, 132, 0.9)"


}

