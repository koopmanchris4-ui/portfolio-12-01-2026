const input = document.getElementById("searchInput");
const zoekBtn = document.getElementById("zoekBtn");
const resultatenLijst = document.getElementById("resultaten");
let zichtbareResultaten = 10; // op begin 10 resultaten

let producten = [];

// fetch van products.json
fetch("https://raw.githubusercontent.com/koopmanchris4-ui/json-search/refs/heads/main/products.json")
    .then(res => res.json())
    .then(data => {
        producten = data;

    })


// Levenshtein Fuzzysearch functie
function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,     // verwijderen
                    matrix[i][j - 1] + 1,     // toevoegen
                    matrix[i - 1][j - 1] + 1  // vervangen
                );
            }
        }
    }

    return matrix[b.length][a.length];
}






// Functie om te zoeken
function zoekProducten() {
    const zoekTerm = input.value.toLowerCase().trim(); // zoekterm is input in kleine letters en zonder spaties
    resultatenAantal.innerHTML = ""; // resultaten aantal weg bij nieuwe zoekopdracht
    resultatenLijst.innerHTML = ""; //error en resultaten weg bij nieuwe zoekopdracht





    // als niets ingevuld
    if (zoekTerm === "") {
        resultatenLijst.innerHTML = "<li class='error'>Vul minimaal 3 characters in!</li>";
        return;
    }


    // minimale lengte van input 3 characters
    if (zoekTerm.length >= 3) {


        // als wel iets ingevoerd



        // maak nieuwe array: resultaten. Voeg alleen de producten toe die aan criteria voldoet en noem ze product
        let resultaten = producten.filter(product => {






            //nieuwe array met doorzoekbare velden
            const velden = [
                product.name,
                product.short_description,
                product.tags,
                product.supplier
            ];
            const zoekWoorden = zoekTerm.split(/\s+/); // zoekWoorden is input gesplitst op spaties, dan krijg je losse woorden

            return zoekWoorden.every(zoekWoord => {// ALLE woorden uit zoekWoorden moet ergens in voorkomen in het prodcut.
                return velden.some(veld => { //minstens 1 veld moet zoekWoord bevatten
                    if (!veld) return false; // sla legen velden over




                    const woorden = veld.toLowerCase().split(/\s+/); //maak van het veld een array van losse woorden

                    return woorden.some(woord => {


                        //geen punten voor dino ass.

                        const cleanWoord = woord.toLowerCase().replace(/[^a-z0-9]/g, ""); // geen hoofletters of punten
                        const cleanZoekWoord = zoekWoord.toLowerCase().replace(/[^a-z0-9]/g, ""); //geen hoofdletters en punten

                        // exacte match
                        if (cleanWoord.includes(cleanZoekWoord)) return true;

                        // fuzzy match
                        const afstand = levenshtein(cleanWoord, cleanZoekWoord); //berekentr verschil tussen woord en zoekWoord (dus input en los woord)
                        let maxToegestaan = Math.max(1, Math.floor(cleanZoekWoord.length * 0.3));
                        return afstand <= maxToegestaan && afstand <= 3; // max 3 fouten


                    });
                });
            });
        });

        // aantal resultaten 

        const resultatenAantal = document.getElementById("resultatenAantal");
        resultatenAantal.textContent = `Aantal gevonden resultaten: ${resultaten.length}`;




        // RELEVANTIE SORTEREN alleen op name, meest logisch

        // Custom sort:


        resultaten.sort((a, b) => {
            const naamA = a.name.toLowerCase(); //zet allebei in kleine letters
            const naamB = b.name.toLowerCase(); //zet allebei in kleine letters

            // normale score is 0
            let scoreA = 0;
            let scoreB = 0;

            if (naamA.includes(zoekTerm)) scoreA += 1000; //als zoekterm in de naam zit + 1000
            if (naamB.includes(zoekTerm)) scoreB += 1000; // als zoekterm in de nama zit + 1000

            // Fuzzy sort
            const afstandA = levenshtein(zoekTerm, naamA); // berkenen hoever naam van product afwijkt in afstand veriabel
            const afstandB = levenshtein(zoekTerm, naamB); // berkenen hoever naam van product afwijkt in afstand veriabel

            // Sorteer: hogere score eerst, lagere afstand eerst
            return (afstandA - afstandB) - (scoreA - scoreB);
        });






        // als wel iets ingevuld maar geen resultaten gevonden
        if (resultaten.length === 0) {
            resultatenLijst.innerHTML = "<li class='error'>Geen resultaten gevonden</li>";
        }



        // laten zien in resultatenlijst
        const zichtbare = resultaten.slice(0, zichtbareResultaten);


        // loop door elk resultaat
        zichtbare.forEach(product => { // toon maximaal 10
            const li = document.createElement("li");

            // als naam gevonden (altijd)
            if (product.name) {
                const name = document.createElement("div");
                name.innerHTML = "<strong>Naam:</strong> " + product.name;
                li.appendChild(name);
            }

            // als beschrijving gevonden
            if (product.short_description) {
                const beschrijving = document.createElement("div");
                beschrijving.innerHTML = "<strong>Beschrijving:</strong> " + product.short_description;
                li.appendChild(beschrijving);
            }

            // als tags gevonden
            if (product.tags) {
                const tags = document.createElement("div");
                tags.innerHTML = "<strong>Tags:</strong> " + product.tags;
                li.appendChild(tags);
            }

            // als supplier gevonden
            if (product.supplier) {
                const supplier = document.createElement("div");
                supplier.innerHTML = "<strong>Supplier:</strong> " + product.supplier;
                li.appendChild(supplier);
            }

            resultatenLijst.appendChild(li);
        });

        // laad meer knop

        if (resultaten.length > zichtbareResultaten) { // als er meer resultaten zijn dan op beeld
            const laadMeerBtn = document.createElement("button"); // maak button aan: laad meer
            laadMeerBtn.textContent = "+ Laad meer resultaten";
            laadMeerBtn.classList.add("laadmeer-knop");
            laadMeerBtn.addEventListener("click", () => { // als klik
                zichtbareResultaten += 10; // + 10 zichtbare resultaten
                zoekProducten(); // opnieuw zoeken met + 10 slice
            });
            resultatenLijst.appendChild(laadMeerBtn); // voeg knop toe aan onderkant resultatenlijst
        }

    }
    else {
        resultatenLijst.innerHTML = "<li class='error'>Vul minimaal 3 characters in!</li>"; // dan de error message
    }
}


// bij input (typen) meteen producten zoeken met een debounce timer, voorkomen van lag

let debounceTimer;
input.addEventListener("input", () => { //wanneer input
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        zichtbareResultaten = 10;
        zoekProducten();
    }, 300); // wacht 300ms
});


// X knop

const Knop = document.getElementById("Xknop");
Knop.addEventListener("click", () => {
    resultatenLijst.innerHTML = "";
    input.value = "";
    resultatenAantal.innerHTML = "";

});

