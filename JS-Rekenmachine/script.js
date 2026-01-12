 const display = document.getElementById("schermpje");
    let laatsteantwoord = "";
    let shiftIngedrukt = false;


    // eerst 0 bij begin
    display.placeholder = "0";

    function Naardisplay(input) {

        // als shift is ingedrukt, verander de input op display van sin, cos en tan
        if (shiftIngedrukt) {
            if (input === 'sin(') input = 'sin⁻¹(';
            if (input === 'cos(') input = 'cos⁻¹(';
            if (input === 'tan(') input = 'tan⁻¹(';
        }
        display.value += input;

    }

    function Backspace() {
        // DEL
        // haal 1 van de display
        display.value = display.value.slice(0, -1);
        display.placeholder = "0";
    }

    function Cleardisplay() {
        // AC
        // maak display leeg
        display.value = "";

        // placeholder weer op 0
        display.placeholder = "0";
    }

    function Uitrekenen() {
        // =
        try {
            // zet de som + uitkomst op het scherm voor overzetten van pi, wortel en kwadraat naar getal
            display.value = eval(display.value
                .replace(/π/g, Math.PI)                          // verander pi naar getal
                .replace(/√(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)')   // wortel
                .replace(/x²/g, '**2')                           // kwadraat
                .replace(/(\d+)%/g, '($1/100)')                  // procent
                .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')      // cos()
                .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')      // sin()
                .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')      // tan()
                .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')    // log()
                .replace(/\^/g, '**')                            // machtsverheffing
                .replace(/In\(([^)]+)\)/g, 'Math.log($1)')       // ln()
                .replace(/x³/g, '**3')                           // derde macht
                .replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, Math.E) // E
                .replace(/π/g, 'Math.PI')
                .replace(/sin(?:\^-?1|⁻¹)/g, 'Math.asin')
                .replace(/cos(?:\^-?1|⁻¹)/g, 'Math.acos')
                .replace(/tan(?:\^-?1|⁻¹)/g, 'Math.atan')


            );




            // zodat bij fout/undefined een nieuwe regel begint. 
            // als er geen nummer is, dan word error placeholder ipv value en dan leeg voor een andere som

            if (typeof display.value !== "number" && isNaN(display.value)) {
                display.placeholder = display.value
                display.value = ""
            }

            // zet de som + uitkomst in "laatste antwoord"
            laatsteantwoord = eval(display.value);
        } catch (error) {
            display.value = "";
            display.placeholder = "Ongeldige invoer";
        }
    }

    function ANS() {
        // ans
        // controle als er GEEN undefined staat, als niet, dan komt het antwoord met ANS knop op scherm, anders niet.
        if (laatsteantwoord !== undefined) {
            display.value += laatsteantwoord;

        }
    }


    function Shift() {
        shiftIngedrukt = !shiftIngedrukt;


        // als shift is ingedrukt, verander de tekst van knoppen
        if (shiftIngedrukt) {
            document.getElementById("sin").innerText = "sin⁻¹";
            document.getElementById("cos").innerText = "cos⁻¹";
            document.getElementById("tan").innerText = "tan⁻¹";

            // anders niet
        } else {
            document.getElementById("sin").innerText = "sin";
            document.getElementById("cos").innerText = "cos";
            document.getElementById("tan").innerText = "tan";
        }
    }