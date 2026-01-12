const countdowndiv = document.getElementById("countdown");
const inputseconden = document.getElementById("seconden");
const inputminuten = document.getElementById("minuten");
const inputuren = document.getElementById("uren");
const knop = document.getElementById("knop");
const reset = document.getElementById("reset");
const muteknop = document.getElementById("mute");
const pauzeknop = document.getElementById("pauze");
const plusminuutknop = document.getElementById("plusminuut")
const plusuurknop = document.getElementById("plusuur")
let interval = null; // interval is standaard null
let pauze = false;
let seconden = 0;
let minuten = 0;
let uren = 0;
let alarm = new Audio('alarm.mp3');
alarm.volume = 0.3; // klikgeluid zachter
let tikgeluid = new Audio('klik.mp3'); // klik geluid
tikgeluid.volume = 0.3; // klikgeluid zachter
const meldingdiv = document.getElementById("melding") // melding div in html
const progressieblak = document.getElementById('progressie-balk');
let totaleTijd = 0;




//alvast functie maken voor latere meldingen (errors)
// zet gewoon meldingen in een div onder de timer

function Toonmelding(melding) {
    meldingdiv.textContent = melding; // zet melding text in die div
    meldingdiv.classList.add("zichtbaar"); // zichbaar pas als er een melding is
}




// De main functie-------------------------------------------------------------------------------------------------------------------


function startcountdown() {
    meldingdiv.textContent = "" // melding legen bij nieuwe countdown




    // als 0 ingevuld, laat niets gebeuren

    if ((inputuren.value === "0" || inputuren.value === "00")
        && (inputminuten.value === "0" || inputminuten.value === "00")
        && (inputseconden.value === "0" || inputseconden.value === "00")
    ) {
        return;
    }


    // maak variabelen seconden, uren, minuten met daarin de input

    seconden = Number(inputseconden.value); // seconden is value van input seconden vakje
    minuten = Number(inputminuten.value); // minuten is value van input minuten vakje
    uren = Number(inputuren.value); // uren is value van input uren vakje




    // overgang van seconden naar minuten bij input

    if (seconden > 59) {
        seconden -= 60
        minuten += 1
    }

    // overgang van minuten naar uren bij input

    if (minuten > 59) {
        minuten -= 60
        uren += 1
    }


    // laat dingen verwijdnen als je op start timer klikt

    inputseconden.classList.add('verwijderen'); // voeg class verwijderen toe die knoppen en inputs onzichtbaar maken
    inputminuten.classList.add('verwijderen');
    inputuren.classList.add('verwijderen');
    knop.classList.add('verwijderen');
    reset.classList.add('reset-tevoorschijn');
    muteknop.classList.remove('verborgen');
    muteknop.classList.add('mute-tevoorschijn');
    pauzeknop.classList.add('pauze-tevoorschijn');
    plusminuutknop.classList.add('plus-tevoorschijn')
    plusuurknop.classList.add('plus-tevoorschijn')






    if (interval) { // als er al een interval is (oude countdown)
        clearInterval(interval); // verwijder die eerst
    }



    // kijk eerst of er wel iets is ingevuld, zo niet, laat alles weer tevoorschijn komen (effect dat er niets gebeurd)


    if (inputuren.value === "" && inputminuten.value === "" && inputseconden.value === "") { // als alles 0 is
        clearInterval(interval);
        Toonmelding('Geweigerd, vul eerst een tijd in!')
        inputseconden.classList.remove('verwijderen');
        inputminuten.classList.remove('verwijderen');
        inputuren.classList.remove('verwijderen');
        knop.classList.remove('verwijderen');
        reset.classList.remove('reset-tevoorschijn');
        muteknop.classList.remove('mute-tevoorschijn');
        pauzeknop.classList.remove('pauze-tevoorschijn');
        plusminuutknop.classList.remove('plus-tevoorschijn')
        plusuurknop.classList.remove('plus-tevoorschijn')

        return;
    }

    totaleTijd = uren * 3600 + minuten * 60 + seconden; // bereken totale tijd in seconden


    interval = setInterval(() => { //maak interval, dat is dit hele stukje (steeds opnieuw)
        if (pauze) {
            return;
        }


        // Controleer of de timer voorbij is
        if (uren === 0 && minuten === 0 && seconden === 0) { // als alles 0 is
            clearInterval(interval); // clear de interval (aftellen)
            Toonmelding("de tijd zit erop!")
            countdowndiv.classList.add('knipper'); // voeg knipper class toe
            pauzeknop.classList.add('verborgen'); // maak pauzeknop verborgen bij error
            plusminuutknop.classList.add('verborgen');  // maak + minuutknop verborgen bij error
            plusuurknop.classList.add('verborgen'); // maak + uurknop verbogen bij error
            countdowndiv.textContent = "00:00:00"; // text weer op 00:00:00


            // speel geluidje
            alarm.loop = true
            alarm.play();
            return;
        }


        // update display functie (toon op tijd scherm), losse functie staat onderaan
        updateDisplay()

        // tikgeluid aspelen elke interval/seconde
        tikgeluid.currentTime = 0;
        tikgeluid.play();


        seconden--; // seconden aftellen


        //progressiebalk

        resterendeTijd = uren * 3600 + minuten * 60 + seconden; // bereken huidige tijd in seconden 
        const percentage = (resterendeTijd / totaleTijd * 100); // bereken percentage van resterende tijd op totale tijd (ingevoerde tijd)
        progressieblak.style.width = percentage + "%" // geef de balk die breedte van dat percentage



        //overgang minuten naar seconden bij countdown

        if (seconden < 0) {
            seconden = 59;
            minuten--;
        }

        // overgang uren naar minuten bij countdown

        if (minuten < 0) {
            minuten = 59;
            uren--;
        }


    }, 1000); // de interval duurt 1 seconde (loop van aftellen)
}

// andere functies ---------------------------------------------------------------------------------------------------------



// uren max 2 lengte

inputuren.addEventListener('input', () => {
    inputuren.value = inputuren.value.slice(0, 3);

});

// minuten max 2 lengte


inputminuten.addEventListener('input', () => {
    inputminuten.value = inputminuten.value.slice(0, 2);

});

// seconden max 2 lengte


inputseconden.addEventListener('input', () => {
    inputseconden.value = inputseconden.value.slice(0, 2);

});


// pauze functie --------------------------------------------------------------------------------------------------------------------

function pause() {
    if (!interval) { //werkt pas als er een interval is, als niet stop de functie
        return;
    }
    pauze = !pauze; // omwisselen van staat pauze naar play
    if (pauze) { // als pauze
        pauzeknop.innerHTML = "<i class='bi bi-play-fill'></i>"; // play icoontje
        pauzeknop.style.backgroundColor = "rgb(220, 62, 62)";
        countdowndiv.style.color = "lightgrey"
        progressieblak.style.backgroundColor = "lightgrey"


    }
    else { // als play
        pauzeknop.textContent = "| |"; // pauze icoontje
        pauzeknop.style.backgroundColor = "";
        countdowndiv.style.color = ""
        progressieblak.style.backgroundColor = ""

    }


}

// reset functie -------------------------------------------------------------------------------------------------------------

reset.addEventListener("click", () => { // klik op reset knop
    clearInterval(interval); // stop oude interval
    interval = null; // weer reset interval
    pauze = false; // pauze is niet waar

    inputseconden.classList.remove('verwijderen'); // remove "verwijder" class (laat alles tevoorschijn komen)
    inputminuten.classList.remove('verwijderen');
    inputuren.classList.remove('verwijderen');
    knop.classList.remove('verwijderen');



    reset.classList.remove('reset-tevoorschijn'); // remove tevoorschijn  class (verberg de knoppen)
    pauzeknop.classList.remove('pauze-tevoorschijn');
    plusminuutknop.classList.remove('plus-tevoorschijn');
    plusuurknop.classList.remove('plus-tevoorschijn');
    muteknop.classList.remove('mute-tevoorschijn');

    pauzeknop.classList.remove('verborgen'); // remove ook class verborgen, zodat met nieuwe zoekopdracht ze wel te zien zijn
    plusminuutknop.classList.remove('verborgen');
    plusuurknop.classList.remove('verborgen');


    // reset countdown display
    countdowndiv.textContent = "00:00:00";
    countdowndiv.style.color = "white";

    //reset input velden
    inputseconden.value = "";
    inputminuten.value = "";
    inputuren.value = "";

    // stop alarm bij reset

    alarm.pause();

    meldingdiv.textContent = ""; // reset melding bij reset
    countdowndiv.classList.remove('knipper'); // knipper weghalen bij reset

    muteknop.classList.add('verborgen'); // bij reset maak muteknop verborgen

    progressieblak.style.width = "" // balk op 0 bij reset





});

// plus uren/minuten -----------------------------------------------------------------------------------------------------------------------------------------

function plusminuut() {
    minuten++;

    // overgang van minuten naar uren voor + minuten knop

    if (minuten > 59) {
        minuten -= 60;
        uren += 1;
    }
    totaleTijd = uren * 3600 + minuten * 60 + seconden; // bij plus minuut weer seconden berekenen zodat progressie balk update
    updateDisplay();

}

function plusuur() {
    uren++;
    totaleTijd = uren * 3600 + minuten * 60 + seconden; // bij plus uur weer seconden berekenen zodat progressie balk update
    updateDisplay();
}

//update display (nodig voor + minuten en uren) ----------------------------------------------------------------------------


function updateDisplay() { // opnieuw text laten zien na plus uur/ plus minuut, (precies zoals bovenaan ook)
    countdowndiv.textContent =
        String(uren).padStart(2, '0') + ":" +
        String(minuten).padStart(2, '0') + ":" +
        String(seconden).padStart(2, '0');
}


// mute en verander icoon gedeelte ----------------------------------------------------------------------------------------------


function mute() {
    if (tikgeluid.volume === 0) {
        tikgeluid.volume = 0.3; // zet geluid weer aan
        muteknop.innerHTML = "<i class='bi bi-volume-up'></i>"
    } else {
        tikgeluid.volume = 0; // mute
        muteknop.innerHTML = "<i class='bi bi-volume-off-fill'></i>"
    }

    if (alarm.volume === 0) {
        alarm.volume = 0.3;

    }
    else {
        alarm.volume = 0;
    }
}

// Start countdown met Enter-toets
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { // als enter gedrukt is
        startcountdown(); // doe alsof op de startknop is geklikt
    }
});
