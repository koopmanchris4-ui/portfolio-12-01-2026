const datums = []; // originele datums array

const kalender = document.getElementById("kalender");
const vandaag = new Date();
let jaar = vandaag.getFullYear();
let maand = vandaag.getMonth();
const maandtonen = document.getElementById("maandtonen");
const jaartonen = document.getElementById("jaartonen");
const input = document.getElementById("input");
let meerbeschikbaarmode = false;
let geselecteerdeDag = vandaag.getDate();
const checkboxcontainer = document.getElementById("dagcheckboxes");
const meerbeschikbaarknop = document.getElementById("meer-beschikbaar");
const tijdslotsDiv = document.getElementById("tijdslots");




// State per maand
let maandState = {}; // bv { "2025-10": { checkedDays: [0,2], autoToegevoegd: ["2025-10-12"], handmatigUitgezet: ["2025-10-23"] } }


// functie, opslaan naar localStorage ----------------------------------------------------------


function saveToStorage() {
    localStorage.setItem("beschikbareDatums", JSON.stringify(datums)); // maak strings van datums in array in localstorage
    localStorage.setItem("maandState", JSON.stringify(maandState));// maak strings van maandstaat in localstorage
}
function loadFromStorage() {
    const datumstorage = JSON.parse(localStorage.getItem("beschikbareDatums")); // zet datums van array "datums" in nieuwe array "beschikbareDatums"
    if (datumstorage) { // als er datums staan in localStorage
        datums.length = 0; // leeg de datums array 
        datums.push(...datumstorage); // vul hem met de "beschikbaredatums" datums
    }

    const maandstatestorage = JSON.parse(localStorage.getItem("maandState")); // zet maandstate
    if (maandstatestorage) {
        maandState = maandstatestorage;
    }
}

// functie om huidige maand staat op te slaa (niets veranderen bij wisselen van maand) -------------------------------------------------------------

function slaHuidigeMaandOp() {
    const maandKey = `${jaar}-${String(maand + 1).padStart(2, "0")}`; // bijv 2025-10
    // als nog geen maandkey voor deze maand, maak deze arrays
    if (!maandState[maandKey]) maandState[maandKey] = { checkedDays: [], autoToegevoegd: [], handmatigUitgezet: [] };

    // huidige dagen ophalen
    const dagenContainer = document.getElementById("dagen-container");
    const dagen = dagenContainer.querySelectorAll(".dag");

    // eerst reset de arrays
    maandState[maandKey].autoToegevoegd = [];
    maandState[maandKey].handmatigUitgezet = [];

    // loop door dagen en noem ze dagDiv
    dagen.forEach(dagDiv => {
        const datum = dagDiv.dataset.date; // datum is dataset (datum in volgorde van array)
        if (!datum) return; // als er geen datum is, doe niets

        // sla status van maanden op:

        if (dagDiv.classList.contains("toegestaan") && !datums.includes(datum)) { // als toegestaan en niet in de originele array
            // voeg ze toe in autotoegevoegd
            maandState[maandKey].autoToegevoegd.push(datum);
        }

        if (dagDiv.classList.contains("niet-toegestaan") && !datums.includes(datum)) { // niet toegestaan en niet in originele array
            // voeg ze toe in handmatig uitgezet
            maandState[maandKey].handmatigUitgezet.push(datum);
        }
        saveToStorage();

    });



    // sla status van checkboxen op


    const dagenCheckboxes = document.querySelectorAll("#dagcheckboxes input[type='checkbox']");
    const geselecteerdeDagen = [];
    dagenCheckboxes.forEach(checkbox => { if (checkbox.checked) geselecteerdeDagen.push(Number(checkbox.value)); });
    maandState[maandKey].checkedDays = [...geselecteerdeDagen];
}

    loadFromStorage() // alvast loadfrostorage voor de maakkalender functie
    // laadt alvast alle gegevens die nodig zijn (vooral checked checkboxes) die nodig zijn voor bouwen va kalender



// kalnder bouwen, main functie --------------------------------------------------------------------------------------------

function maakKalender(jaar, maand) { // maak kalender voor deze maand + jaar
    const maandKey = `${jaar}-${String(maand + 1).padStart(2, "0")}`; // maand key : bijv 2025-10
    // als deze maandkey nog niet in de array "MaandState" staat, maak maandState met deze 3 arrays
    if (!maandState[maandKey]) maandState[maandKey] = { checkedDays: [], autoToegevoegd: [], handmatigUitgezet: [] };

    const maandnamen = ["Januari", "Februari", "Maart", "April", "Mei", "Juni",
        "Juli", "Augustus", "September", "Oktober", "November", "December"];


    // maand + jaar tonen in header
    maandtonen.textContent = maandnamen[maand];
    jaartonen.textContent = jaar;

    const aantalDagen = new Date(jaar, maand + 1, 0).getDate(); // aantal dagen = getdate (maand+ 1, want begint op 0 in js)
    const eerstedag = new Date(jaar, maand, 1); // eerste dag van maand als date object
    const dagvanweek = eerstedag.getDay(); // 0  = zondag, 1 = maandag, 2 = dinsdag enz

    let dagenvorigemaand; // dagen vorige maand = hoeveel dagen zichtbaar van vorige maand op begin van kalender
    if (dagvanweek === 0) { // als dagvanweek = 0 (zondag)
        dagenvorigemaand = 6; // toon dan 6 dagen van vorige maand op begin
    } else { // anders verschuif alles 1 naar links
        dagenvorigemaand = dagvanweek - 1;

    }

    const laatsteDagVorigeMaand = new Date(jaar, maand, 0).getDate(); // laatste dagnummer van vorige maand



    const dagenContainer = document.getElementById("dagen-container");
    dagenContainer.innerHTML = ""; //altijd eerst resetten bij nieuwe kalender maken

    // Dagen tonen vorige maand
    for (let i = dagenvorigemaand; i > 0; i--) { // als dagen die toegoegd gaan worden uit vorige maand groter is dan 0, dan dagen laten zien tot maandag
        const dagDiv = document.createElement("div");
        dagDiv.classList.add("dag", "super-licht");
        dagDiv.textContent = laatsteDagVorigeMaand - i + 1;
        dagenContainer.appendChild(dagDiv);
    }

    // Dagen tonen Huidige maand
    for (let dag = 1; dag <= aantalDagen; dag++) { // looop door elke dag (1t/m "aantal dagen")
        const dagDiv = document.createElement("div"); // maak er een div van en noem het dagDiv
        dagDiv.classList.add("dag"); // class dag toevoegen
        dagDiv.textContent = dag; // dagnummer als tekst
        dagenContainer.appendChild(dagDiv); // zet hem in dagencontainer




        const datum = `${jaar}-${String(maand + 1).padStart(2, "0")}-${String(dag).padStart(2, "0")}`; // maak datumstring, bijv 2025-06-07, komt overeen met array
        dagDiv.dataset.date = datum; // dagdiv.dataset.date is hetzelfde als datum 
        const dagWeek = new Date(datum).getDay(); // dag van de week 0 = zondag, 1 = maandag enz 

        // styling geven
        // als hij in de datum array,  zit: geef class toegestaan
        //als de maandkey in checkeddays, autotoegevoegd, of handmatig uitgezet staat:
        if (datums.includes(datum)) dagDiv.classList.add("toegestaan");
        if (maandState[maandKey].checkedDays.includes(dagWeek) && !datums.includes(datum)) dagDiv.classList.add("toegestaan"); // checkbox dagen, class = "toegestaan"
        if (maandState[maandKey].autoToegevoegd.includes(datum)) dagDiv.classList.add("toegestaan"); //check box datum, class = "toegestaan"
        if (maandState[maandKey].handmatigUitgezet.includes(datum)) { //handmatig uitgezet uitgezet, class niet toegestaan
            dagDiv.classList.remove("toegestaan");
            dagDiv.classList.add("niet-toegestaan");
        }
        //anders
        if (!dagDiv.classList.contains("toegestaan")) dagDiv.classList.add("niet-toegestaan"); // als dagdiv niet de class toegestaaan heeft, geef class "niet-toegestaan"

        // als geklikt
        dagDiv.addEventListener('click', () => {
            // als geklikt en developer mode aan
            if (meerbeschikbaarmode) {
                if (dagDiv.classList.contains("toegestaan")) { // als hij toegestaan was, maak hem niet toegestaan
                    dagDiv.classList.remove("toegestaan");
                    dagDiv.classList.add("niet-toegestaan");


                    // als er geklikt is en dag zit niet niet in "handmatig uitgezet", doe hem erin
                    if (!maandState[maandKey].handmatigUitgezet.includes(datum)) maandState[maandKey].handmatigUitgezet.push(datum);

                    // als toegestaan door checkbox en je klikt erop, doe hem weer uit
                    const idx = maandState[maandKey].autoToegevoegd.indexOf(datum);
                    if (idx !== -1) maandState[maandKey].autoToegevoegd.splice(idx, 1);

                    // als geklikt in developer mode. haal hem uit de array "datums"
                    const index = datums.indexOf(datum);
                    if (index !== -1) datums.splice(index, 1);

                    //anders, weer klikbaar
                } else {
                    // maak weer toegestaan
                    dagDiv.classList.remove("niet-toegestaan");
                    dagDiv.classList.add("toegestaan");

                    if (!datums.includes(datum)) datums.push(datum); // zet hem in de datums array als hij er nog niet in zat


                    // als in de handmatiguitgezet, haal hem eruit

                    const idx = maandState[maandKey].handmatigUitgezet.indexOf(datum);
                    if (idx !== -1) maandState[maandKey].handmatigUitgezet.splice(idx, 1);

                    // als uit checkeddays, doe hem er weer in
                    if (maandState[maandKey].checkedDays.includes(dagWeek) && !datums.includes(datum) && !maandState[maandKey].autoToegevoegd.includes(datum)) {
                        maandState[maandKey].autoToegevoegd.push(datum);
                    }
                }
                // als developer mode niet aan, klik actie
            } else {
                if (dagDiv.classList.contains("toegestaan")) { // als datum de class "toegestaan" heeft: (als je mag klikken)

                    //eerst alles reset
                    document.querySelectorAll(".dag").forEach(d => {
                        d.style.backgroundColor = "";
                        d.style.color = "";
                        d.style.pointerEvents = "auto";
                    });

                    // maak daarna blauw en toon tijdslots (radio buttons)
                    dagDiv.style.backgroundColor = "rgba(30, 144, 255, 1)";
                    dagDiv.style.color = "white";
                    dagDiv.style.pointerEvents = "none";
                    geselecteerdeDag = dag;
                    input.value = datum;
                    toonTijdslots(dag, maand, jaar); // als klikactie, toontijden (functie onderaan)
                    tijdslotsDiv.classList.add('show')



                }
            }

            // bij klik op input, toon de radio buttons (effect dat niet weggaat)
            input.addEventListener('click', e => {
                tijdslotsDiv.classList.add('show')
            })



            saveToStorage();

        });

        // als dag geselecteerd is, maak hem dan blauw. (standaard vandaag)

        if (dag === geselecteerdeDag) {
            dagDiv.style.backgroundColor = "#1E90FF";
            dagDiv.style.color = "white";
        }
    }


    // Dagen tonen volgende maand
    const laatsteDagWeek = new Date(jaar, maand + 1, 0).getDay(); // laastste dagweek: bijv zondag = 0, maandag = 1 enz

    let laatsteDagWeekCorrect; // alvast aanmaken

    if (laatsteDagWeek === 0) { // als laatstedagweek = 0 (zondag)
        laatsteDagWeekCorrect = 6; // toon 6 dagen
    } else { // haal alles 1 naar beneden
        laatsteDagWeekCorrect = laatsteDagWeek - 1;
    }

    // dagen toevoegen tot hij eindigt op zondag
    const dagenVolgendeMaand = 6 - laatsteDagWeekCorrect;


    // voeg dagen toe tot gelijk of minder dan dagenvolgende maand
    for (let i = 1; i <= dagenVolgendeMaand; i++) {
        const dagDiv = document.createElement("div");
        dagDiv.classList.add("dag", "super-licht");
        dagDiv.textContent = i;
        dagenContainer.appendChild(dagDiv);
    }

    // Checkboxen onthouden, maand switch
    const dagenCheckboxes = document.querySelectorAll("#dagcheckboxes input[type='checkbox']");
    dagenCheckboxes.forEach(checkbox => { // loop door elke checkbox
        // Veilig checken of maandState bestaat
        const checkedDays = maandState[maandKey]?.checkedDays || []; // checkedDays zijn de checkedDays van maandstate, of lege array als hij nog niet bestond
        checkbox.checked = checkedDays.includes(Number(checkbox.value));  // checkbox wordt gecheckt als de value opgeslagen is in checkedDays array
        checkbox.onchange = () => maakSpecifiekeDagenKlikbaar(); // wanneer verandering, voer checkbox functie uit
    });
    // einde maak kalender functie

}

// functie die input value veranderd als dezelfde dag volgende maand toegestaan is-------------------------

function updateInputAlsDagBestaat() {
    const datum = `${jaar}-${String(maand + 1).padStart(2, "0")}-${String(geselecteerdeDag).padStart(2, "0")}`; // datums tring maken
    const dagDiv = document.querySelector(`.dag.toegestaan[data-date="${datum}"]`);
    if (dagDiv) {
        input.value = datum;
        toonTijdslots(geselecteerdeDag, maand, jaar)
    }

    if (!dagDiv) {
        toonTijdslots(); // anders leeg
    }
}

// input click verberg oud menu -------------------------------------------------

input.addEventListener('click', e => {
    e.preventDefault(); // standaard menu ververgen
    kalender.classList.add("show");
    meerbeschikbaarmode = false;
    meerbeschikbaarknop.innerHTML = "Developer mode | datums wijzigen (UIT)";
    meerbeschikbaarknop.classList.remove("developermode");
    meerbeschikbaarknop.classList.add("show");
    checkboxcontainer.classList.remove("show");

    const dagdivs = document.querySelectorAll(".dag");
    dagdivs.forEach(dag => dag.classList.remove("dag-hover"));
});

// input zelf typen -------------------------------------------------

input.addEventListener("change", () => { // bij verandering
    const val = input.value; // val = value van input
    if (!val) return; // als geen input, doe niets
    const [jaarStr, maandStr, dagStr] = val.split("-"); // maandstr en jaarstr en dagStr is value gesplit met streep


    jaar = Number(jaarStr);
    maand = Number(maandStr) - 1;
    geselecteerdeDag = Number(dagStr); // geseleceteerde dag (blauw) wordt ipv vandaag, die dag die je typt (dagStr)


    maakKalender(jaar, maand); // maak nieuwe kalender met nieuwe getallen


    // dag die overeenkomt met ingevoerde datum wordt blauw en niet klikbnaar

    const dagEl = document.querySelector(`.dag[data-date="${val}"]`); // dagEl = dag met dezelfde data als val (dus dezeelfde jaar-maand-dag)
    if (dagEl && dagEl.classList.contains("toegestaan")) { // als hij de class: toegestaan heeft.


        //eerst reset kleur en klikbaarheid
        document.querySelectorAll(".dag").forEach(dagDiv => {
            dagDiv.style.backgroundColor = "";
            dagDiv.color = "";
            dagDiv.pointerEvents = "auto";
        })

        // stel dan kleuren en klikbaarheid in voor die dag

        dagEl.style.backgroundColor = "#1E90FF";
        dagEl.style.color = "white";
        dagEl.style.pointerEvents = "none"; // niet klikbaar

        // toodslots voor die dag tonen

        toonTijdslots(geselecteerdeDag, maand, jaar); // functie tijdslots opneiuw aanroepen
        if (tijdslotsDiv) { // als tijdslotsdiv bestaat (user form)
            tijdslotsDiv.classList.add('show'); // laat tijdslots zien

        }
    } else {
        // anders ( dag gekozen die niet toegestaan), maak tijdslots leeg en onzichtbaar
        if (tijdslotsDiv) { // als tijdslotsdiv bestaat (user form)
            tijdslotsDiv.innerHTML = "";
            tijdslotsDiv.classList.remove('show');
        }
    }
});

// functie maand veranderen ---------------------------------------

function maandvooruit() {
    const dagencontainer = document.getElementById("dagen-container");
    dagencontainer.classList.add("fade");

    slaHuidigeMaandOp();
    maand++;
    if (maand > 11) { maand = 0; jaar++; }

    setTimeout(() => {
        maakKalender(jaar, maand);
        updateInputAlsDagBestaat()
        dagencontainer.classList.remove("fade");
    }, 100);
}


function maandachteruit() {
    const dagencontainer = document.getElementById("dagen-container");
    dagencontainer.classList.add("fade");

    slaHuidigeMaandOp();
    maand--;
    if (maand < 0) { maand = 11; jaar--; }

    setTimeout(() => {
        maakKalender(jaar, maand);
        updateInputAlsDagBestaat()
        dagencontainer.classList.remove("fade");
    }, 100)

}

// functie developer mode (puur styling button) -----------------------------------------------------------

function meerbeschikbaar() {
    meerbeschikbaarmode = !meerbeschikbaarmode; // veranderen wel/niet aan
    const dagdiv = document.querySelectorAll(".dag");
    if (meerbeschikbaarmode) {
        meerbeschikbaarknop.innerHTML = "Developer mode | datums wijzigen (AAN)";
        meerbeschikbaarknop.classList.add("developermode");
        checkboxcontainer.classList.toggle("show");
        dagdiv.forEach(d => d.classList.add("dag-hover"));
    } else {
        meerbeschikbaarknop.innerHTML = "Developer mode | datums wijzigen (UIT)";
        meerbeschikbaarknop.classList.remove("developermode");
        checkboxcontainer.classList.remove("show");
        dagdiv.forEach(d => d.classList.remove("dag-hover"));
        slaHuidigeMaandOp();
    }
}

// checkbox functie ---------------------------------------------------------------------------------
function maakSpecifiekeDagenKlikbaar() {
    // weer maandkey maken, bijv 2025-10
    const maandKey = `${jaar}-${String(maand + 1).padStart(2, "0")}`;

    // als er nog geen maandstate bestaat, maak de structuur, (arrays)
    if (!maandState[maandKey]) maandState[maandKey] = {
        checkedDays: [],
        autoToegevoegd: [],
        handmatigUitgezet: []
    };

    const dagenCheckboxes = document.querySelectorAll("#dagcheckboxes input[type='checkbox']");
    const geselecteerdeDagen = []; // tijdelijke array
    dagenCheckboxes.forEach(checkbox => { // loop door checkboxen en noem het checkbox
        if (checkbox.checked) geselecteerdeDagen.push(Number(checkbox.value)); // als checkbox gecheckt is, doe de value ervan in tijdelijke array
    });

    // Vergelijk oude vs nieuwe checkboxstatus
    const oudeCheckedDays = maandState[maandKey].checkedDays; // huidige staat van gevinkte checkboxen opslaan
    maandState[maandKey].checkedDays = [...geselecteerdeDagen]; // "checkeddays" is copy van tijdelijke array. Wordt nu acutuele staat van checkboxen

    const dagen = document.querySelectorAll(".dag");

    dagen.forEach(dagDiv => { // loop door dagen
        const datumStr = dagDiv.dataset.date; // datumstr is dataset (datum in formaat van array)
        if (!datumStr) return; // als geen datum , doe niets
        const dagWeek = new Date(datumStr).getDay(); //bepaal de weekdag 0 = zondag, 1 = maandag, 2 = woensdag enz.

        const wasInCheckboxVoorheen = oudeCheckedDays.includes(dagWeek); // als dag in oudeCheckeddays zat, dan was hij in checkbox vroeger
        const isInCheckboxNu = geselecteerdeDagen.includes(dagWeek); // als dag in de tijdelijke array staat, dan is hij in checkbox van nu 

        const isHandmatigUitgezet = maandState[maandKey].handmatigUitgezet.includes(datumStr); // als maandkey array : "handmatigUitgezet" die dag heeft, dan isHandmatigUitgezet
        const isAutoToegevoegd = maandState[maandKey].autoToegevoegd.includes(datumStr);// als maandkey array : "autoToegevoegd" die dag heeft, dan isAutoToegevoegd


        // de logica checkboxes --------------------------------------------


        // als checkbox nu actief is
        if (isInCheckboxNu) {

            // dag was handmatig uitgezet, maar vroeger niet door de checkbox toegestaan is
            if (isHandmatigUitgezet && !wasInCheckboxVoorheen) {
                const idx = maandState[maandKey].handmatigUitgezet.indexOf(datumStr); // verwijder uit handmatiguitgezet (voorkomt in de war)
                if (idx !== -1) maandState[maandKey].handmatigUitgezet.splice(idx, 1);
            }

            // dag wordt toegestaan als hij niet handmatig uitgezet is
            if (!maandState[maandKey].handmatigUitgezet.includes(datumStr)) {
                dagDiv.classList.remove("niet-toegestaan"); // maak actief
                dagDiv.classList.add("toegestaan");

                // als het een nieuwe automatische datum is, (nog niet in originele datums en Autotoegevoegd)
                if (!datums.includes(datumStr) && !isAutoToegevoegd)
                    maandState[maandKey].autoToegevoegd.push(datumStr);

                // anders handmatige uitzetting
            } else {
                dagDiv.classList.remove("toegestaan");
                dagDiv.classList.add("niet-toegestaan");
            }

            // als checkbox NIET aanstaat
        } else {

            const idx = maandState[maandKey].autoToegevoegd.indexOf(datumStr);
            if (idx !== -1) maandState[maandKey].autoToegevoegd.splice(idx, 1); // haal hem uit de array "autoToegevoegd" want checkbox staat uit


            //originele dagen blijven toegestaan
            // alles behalve de originele array wordt niet toegestaan, van datums wordt afgebleven
            if (!datums.includes(datumStr)) {
                dagDiv.classList.remove("toegestaan");
                dagDiv.classList.add("niet-toegestaan");
            }
        }
    });

    saveToStorage();
}

// klik buiten kalender functie ----------------------------------------------------

addEventListener("click", e => {
    if (e.target !== input
        && !kalender.contains(e.target)
        && (!meerbeschikbaarknop || !meerbeschikbaarknop.contains(e.target))
        && (!checkboxcontainer || !checkboxcontainer.contains(e.target))
        && (!tijdslotsDiv || !tijdslotsDiv.contains(e.target))) {

        kalender.classList.remove("show");

        if (meerbeschikbaarknop) meerbeschikbaarknop.classList.remove("show");
        if (checkboxcontainer) checkboxcontainer.classList.remove("show");
        if (tijdslotsDiv) tijdslotsDiv.classList.remove("show")

    }
});

// spatie verberg oude kalender functie ----------------------------------------

input.addEventListener("keydown", spatie);
function spatie(e) {
    if (e.key === " ") {
        e.preventDefault()
    }
}


// reset localstorage knop ----------------------------------------------------------

function resetKalender() {
    // Vraag de gebruiker om bevestiging
    if (confirm("Weet u zeker dat u de kalender wilt resetten?")) { // als geklikt op confirm, pop up
        localStorage.removeItem("beschikbareDatums"); // wis alle dagen uit localstorage
        localStorage.removeItem("maandState"); location.reload();    // Herlaad de pagina
        maakKalender(jaar, maand); // bouw kalender opnieuw, zodat dingen wel weer aan kunnen

    } else { // anders, niets......
    }
}

// verwijder deze maand kruisje ------------------------------------

function verwijderDezeMaand() {
    if (confirm("Weet u zeker dat u de datums uit deze maand wilt resetten?")) { // als op confirm gedrukt is
        // maandkey
        const maandKey = `${jaar}-${String(maand + 1).padStart(2, "0")}`; // bv 2025-10


        // Arrays van deze maand leegmaken
        maandState[maandKey].checkedDays = [];
        maandState[maandKey].autoToegevoegd = [];
        maandState[maandKey].handmatigUitgezet = [];

        for (let i = datums.length - 1; i >= 0; i--) { // loop achteruit door datums array. Stopt pas wanneer i (dus array) kleiner is dan 0, dus seleceteerd alles
            if (datums[i].startsWith(maandKey)) { // als hudiige item van de loop met maandkey begint (deze maand)
                datums.splice(i, 1); // verwijder hem dan uit de datums array. 
                // hij verwijderd dus alle dagen uit de array van deze maand (geklikt op kruisje!
            }
        }

        saveToStorage();        // opslaan in localStorage
        maakKalender(jaar, maand); // kalender opnieuw bouwen
    }
    else {
        //als niet op confirm gedrukt is: doe niets
    }
}

// tijden met radio buttons per dag --------------------------------------------------------------------------

const tijdenPerDag = {
    1: ["15:00", "16:00", "17:00", "18:00"],//maandag
    2: ["13:00", "14:00"],//dinsdag
    3: ["11:00", "12:00"],//woensdag
    4: ["11:00", "12:00"],//donderdag
    5: ["11:00", "12:00"],//vrijdag
    6: ["17:00", "18:00", "19:00"],//zaterdag
    0: ["11:00", "12:00", "13:00", "14:00"],//zondag
};

function toonTijdslots(dag, maand, jaar) { // tijdslots tonen voor geselecteerde dag
    if (!tijdslotsDiv) return // als er geen tijdslotsdiv id (developer page), doe deze hele functie niet


    tijdslotsDiv.innerHTML = "" // leegmaken bij begin functie, (zodat andere kan kiezen)

    const dagWeek = new Date(jaar, maand, dag).getDay() // geeft dat van week, 1 is maandag, 2 is dsindag enz
    const tijden = tijdenPerDag[dagWeek] || []; // is tijden van nummers die zijn gegeven door dagweek (dagen)


    tijden.forEach(tijd => {
        const label = document.createElement("label");

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "tijdslot";
        radio.value = tijd;

        label.appendChild(radio);
        label.appendChild(document.createTextNode(" " + tijd));

        tijdslotsDiv.appendChild(label);
    })
}

//  afspraak maken knop --------------------------------


let eersteklikformknop = true

//  preventdefault, dat form niet weggaat bij klik op knop, bij klik op knop ook functie maakafsrpaak aanroepen
document.addEventListener("DOMContentLoaded", () => { // zodat developer mode pagina geen problemen
    const form = document.getElementById("afspraak");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        maakafspraak();


    });
});

function maakafspraak() {


    const geselecteerdeTijd = document.querySelector('input[name="tijdslot"]:checked');
    const naam = document.querySelector('input[name="naam"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const datum = document.getElementById("input").value;
    const inputDate = document.getElementById("input");
    const form = document.getElementById("afspraak");



    // check of geselecteerde datum toegestaan is
    const dagEl = document.querySelector(`.dag[data-date="${datum}"]`); // dagEl is dag met datum die gebruiker heeft gekozen
    if (!dagEl || !dagEl.classList.contains("toegestaan")) { // als die er niet is, of hij is niet toegestaan:
        inputDate.setCustomValidity("deze dag is niet toegestaan!") // geef error, hij is niet toegestaan
        inputDate.reportValidity()
        return;
    }

    else { // anders (weer goed gezet, leeg de error)
        inputDate.setCustomValidity("")
    }

    // Eerste scherm: check of alles ingevuld is, als niet, geef error en stop de code
    if (eersteklikformknop) {

        if (!geselecteerdeTijd) {
            inputDate.setCustomValidity("kies een tijd onder de gekozen dag")
            inputDate.reportValidity()
            return;
        }

        if (!naam) { // standaard error HTML
            return;
        }

        if (!email) { // standaard error HTML
            return;
        }

        // als in het formulier nog iets leeg is, geef error en stop (extra voor mail)

        if (!form.checkValidity()) {
            form.reportValidity();
            return
        }

        // Verander menu naar tweede scherm
        const inputveld1 = document.getElementById("inputveld");
        const inputveld2 = document.getElementById("inputveld2");
        const inputdate = document.getElementById("input");
        const opslaanknop = document.getElementById("opslaanknop");
        const titel = document.querySelector(".Afspraak-tekst");


        inputveld1.classList.add("remove");
        inputveld2.classList.add("remove");
        inputdate.classList.add("remove");

        opslaanknop.textContent = "Afspraak plannen";
        titel.textContent = "Waar is de afspraak voor?";

        const tekst = document.getElementById("tekstarea");
        tekst.innerHTML = "";

        const textarea = document.createElement("textarea");
        tekst.appendChild(textarea);

        const kleinetekst = document.getElementById("kleine-tekst");
        kleinetekst.textContent = "Geef een korte beschrijving over de afspraak";

        // Zet flag op false zodat tweede klik de afspraak toevoegt
        eersteklikformknop = false;
        return; // nog niet opslaan, want nog geen beschrijving
    }

    // Tweede scherm: check of beschrijving ingevuld is
    const beschrijving = document.querySelector("#tekstarea textarea").value.trim();

    // als er nog geen beschijving is, betekent dat dat je nog op eerste scherm bent, dus stopt de code en wordt localstorage nog niet gevuld
    if (!beschrijving) return;

    // Maak afspraak object
    const afspraak = {
        naam: naam,
        tijd: geselecteerdeTijd.value,
        email: email,
        beschrijving: beschrijving,
        datum: document.getElementById("input").value
    };

    // Haal bestaande afspraken of lege array
    let afspraken = JSON.parse(localStorage.getItem("afspraken")) || [];

    // Check of exact dezelfde afspraak al bestaat // als alles overeenkomt, komt hij in "bestaat"
    const bestaat = afspraken.some(a =>
        a.naam === afspraak.naam &&
        a.email === afspraak.email &&
        a.datum === afspraak.datum &&
        a.tijd === afspraak.tijd
    );

    if (!bestaat) { // als hij niet in bestaat staat (nieuwe), voeg hem dan toe aan localstorage
        afspraken.push(afspraak); // Voeg alleen toe als het nog niet bestaat
        localStorage.setItem("afspraken", JSON.stringify(afspraken));


        // menu 3, afsrpaak opgeslagen!

        const textarea = document.getElementById("tekstarea");
        const plaatje = document.getElementById("plaatje");


        plaatje.style.display = "block"


        textarea.classList.toggle("remove")

        opslaanknop.classList.toggle("remove")

        const titel = document.querySelector(".Afspraak-tekst");
        const kleinetekst = document.getElementById("kleine-tekst");

        titel.textContent = "Gelukt!";
        kleinetekst.textContent = "De afspraak wordt zo snel mogelijk behandeld";

        setTimeout(() => {
            location.reload(); // an 3 seconden wordt de pagina gereset en ga je terug naar hoofdmenu (form)
        }, 3000)
    }
}
// -------------------------------------------------------------------------------

// tabel met localstorage afspraak laten zien in developer page


function afsprakentabel() {
    const table = document.getElementById("afspraken-tabel");
    const tableWrapper = document.querySelector(".table-wrapper")

    const afspraken = JSON.parse(localStorage.getItem("afspraken")) || [];


    // als geen afspraken in de localstoragte, laat de tabel niet zien
    if (afspraken.length === 0) {
        tableWrapper.style.display = "none"
        return;
    }

    // tabel reset, (voor verwijderen dat het er niet bij komt)

    table.innerHTML = `
        <tr>
            <th>Naam</th>
            <th>E-mail</th>
            <th>Datum</th>
            <th>Tijdstip</th>
            <th>Beschrijving</th>
            <th>Acties</th>
        </tr>
    `;


    //  voor elke afsrpaak in localstorage, maak een rij met naam, email, dartum, tijd en beschrijving
    afspraken.forEach((afspraak, index) => {
        table.innerHTML += `
            <tr>
                <td>${afspraak.naam}</td>
                <td>${afspraak.email}</td>
                <td>${afspraak.datum}</td>
                <td>${afspraak.tijd}</td>
                <td>${afspraak.beschrijving}</td>
                <td><button class="tabel-knop" data-index="${index}">X</button></td>
            </tr>
        `;
    });


    const verwijderKnoppen = table.querySelectorAll(".tabel-knop");
    verwijderKnoppen.forEach(knop => { // loop door elke knop
        knop.addEventListener("click", (e) => { // bij een klik op de knop:
            const idx = e.target.dataset.index; // index is hetgene op welke knop je geklikt hebt
            afspraken.splice(idx, 1); // verwijder afspraak uit array
            localStorage.setItem("afspraken", JSON.stringify(afspraken)); // update localStorage
            afsprakentabel(); // herlaad tabel
        });
    });
}



// Direct uitvoeren bij laden
document.addEventListener("DOMContentLoaded", afsprakentabel);


//bij laden van pagina, bouw kalender

loadFromStorage();
maakKalender(jaar, maand);


