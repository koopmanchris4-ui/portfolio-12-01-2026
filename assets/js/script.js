let rootPath = ""; // pad is niet (gewone root paginas)


// hamburger navbar --------------------------

const hamburgerBtn = document.getElementById("hamburger-btn");
const navbar = document.querySelector(".navbar")


if (hamburgerBtn && navbar) { // checken of hij er is bij elke page. Anders klapt de code
    hamburgerBtn.addEventListener("click", () => { // als er wordt geklikt op de hamburger button
        navbar.classList.toggle("active") // krijgt de navbar de class "active"
    })
}

//------------------------------------------------

// dropdown menu contact pagina --------------

const dropdownBtn = document.getElementById("dropdownBtn"); // dropdown knop
const menu = document.getElementById("dropdownMenu"); // menu (lijst)
const dropdownValue = document.getElementById("dropdownValue");


if (dropdownBtn) {
    dropdownBtn.onclick = () => { // bij een klik op de knop

        if (menu.classList.contains("visible")) { // als het menu al zichbaar is
            menu.classList.remove("visible"); // maak hem onzichtbaar (sluit hem)
        } else { // anders (hij is nog gesloten)
            menu.classList.add("visible") // maak hem open
        }

        // bij een klik buiten de knop
        document.addEventListener("click", (e) => {
            if (!dropdownBtn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove("visible");
            }

            // als menu geen class zichtbaar heeft (hij is nog gesloten)
            if (!menu.classList.contains("visible")) {
                dropdownBtn.style.outline = 0; // geen outline
            }
            // maar als hij weer open is, wel een uitline
            else { dropdownBtn.style.outline = "" }
        })

        // loop door elke li uit dropdown en noem het item
        document.querySelectorAll("#dropdownMenu li").forEach(item => {
            // bij een klik op zo'n item (Li)
            item.addEventListener("click", () => {
                // dropdown value wordt dataset value van die li (staat in HTML)
                dropdownValue.value = item.dataset.value;
                // ook de value (dus wat er zichtbaar staat in de input) wordt die data uit HTML
                dropdownBtn.value = item.textContent;
                // sluit ook het dropdown menu weer
                menu.classList.remove("visible");

            });
        });
    }
}

// sorteerfunctie voor projecten page

const allknop = document.getElementById("sorteerknop-alles")
const jaar1knop = document.getElementById("sorteerknop-jaar1")
const jaar2knop = document.getElementById("sorteerknop-jaar2")


const jaar1Projecten = document.querySelectorAll(".jaar1")
const jaar2Projecten = document.querySelectorAll(".jaar2")

if (allknop && jaar1knop && jaar2knop) {

    if (allknop) { allknop.style.backgroundColor = "rgba(21, 29, 62)" }


    jaar1knop.addEventListener("click", () => {
        jaar1knop.style.backgroundColor = "rgba(21, 29, 62)"
        jaar2knop.style.backgroundColor = ""
        allknop.style.backgroundColor = ""

        jaar2Projecten.forEach(jaar2project => {
            jaar2project.style.display = "none"

            jaar1Projecten.forEach(jaar1project => {
                jaar1project.style.display = "flex"
            })
        })
    })

    jaar2knop.addEventListener("click", () => {
        jaar2knop.style.backgroundColor = "rgba(21, 29, 62)"
        jaar1knop.style.backgroundColor = ""
        allknop.style.backgroundColor = ""
        jaar1Projecten.forEach(jaar1project => {
            jaar1project.style.display = "none"

            jaar2Projecten.forEach(jaar2project => {
                jaar2project.style.display = "flex"
            })

        })
    })

    allknop.addEventListener("click", () => {
        jaar2knop.style.backgroundColor = ""
        jaar1knop.style.backgroundColor = ""
        allknop.style.backgroundColor = "rgba(21, 29, 62)"
        jaar1Projecten.forEach(jaar1project => {
            jaar1project.style.display = "flex";
        })
        jaar2Projecten.forEach(jaar2project => {
            jaar2project.style.display = "flex";
        })
    })
}





// -----------------


// Vanaf hier, nachtmode

//eerst rootpath bepalen voor diepere (projecten paginas)
if (window.location.pathname.includes("/koppelingen/")) { // als er beginscherm inzit
    rootPath = "../../../"; // ga naar de root
}


//druk op ander thema




function anderThema() {
    const body = document.body;

    const knop = document.getElementById("anderthema");
    const isDark = body.dataset.theme === "dark"


    const bodybackground = document.querySelector(".fixed-background")

    // body dark

    if (!isDark) {
        // Zet donkere modus
        body.dataset.theme = "dark";
        bodybackground.style.backgroundImage = `url('${rootPath}assets/Afbeeldingen/nachtachtergrond.jpg')`; // root en link naar plaatje vanaf daar
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundSize = "cover";
        body.style.backgroundPosition = "center";
        body.style.minHeight = "100vh";
        body.style.backgroundColor = "black"



        // navbar dark


        const navbar = document.querySelector(".navbar");
        if (navbar) {
            navbar.style.boxShadow = "10px 20px 50px rgb(0, 0, 0)";
            navbar.style.background = "rgb(46, 56, 103)";
        }

        // ----------------------------------------------------------------------------------------------------------
        // pagina - over


        // h1 dark

        const h1s = document.querySelectorAll("h1");
        h1s.forEach(h1 => {
            h1.style.color = "white";
        });


        //grijsvlak2 dark


        const grijsvlak2 = document.getElementById("grijsvlak2");
        if (grijsvlak2) {
            grijsvlak2.style.background = "linear-gradient(to bottom, rgba(16, 20, 123, 0) 0%, rgba(21, 47, 108, 0.38) 15%, rgb(30, 33, 53) 100%)"

        }

        // vaardigheden

        const vaardigheden = document.getElementsByClassName("vaardigheid");
        for (let vaardigheid of vaardigheden) {
            vaardigheid.style.backgroundColor = "rgba(255, 255, 255, 0.66)";
        }

        // ----------------------------------------------------------------------------------------------
        // pagina - projecten


        // projecten feller maken 
        const projecten = document.querySelectorAll(".Project");
        for (let project of projecten) {
            project.style.backgroundColor = "rgba(255, 255, 255, 0.65)"
        }


        const achtergrondkleurdiv = document.getElementById("achtergrondkleurdiv");
        if (achtergrondkleurdiv) {
            achtergrondkleurdiv.style.background = "linear-gradient(to bottom, rgba(16, 20, 123, 0) 0%, rgba(150, 150, 150, 0.38) 15%, rgba(0, 0, 0, 0.56) 100%)"
        }


        // ---------------------------------------------------------------------------------------------------
        //pagina - contact


        //achtergrondfade donkerder maken

        const achtergrondfade = document.getElementById("achtergrondfade");
        if (achtergrondfade) {
            achtergrondfade.style.background = "linear-gradient(to bottom, rgba(123, 16, 28, 0) 0%, rgba(150, 150, 150, 0.38) 15%, rgba(0, 0, 0, 0.56) 100%)"
        }

        //contact vlak iets minder doorschijnend maken

        const contactVlak = document.getElementById("contact-vlak");
        if (contactVlak) {
            contactVlak.style.backgroundColor = "rgba(239, 239, 239, 0.47)";


            // alle tekst wit maken
            const texts = body.querySelectorAll("p, h1"); // alle text in contact-vlak
            texts.forEach(el => el.style.color = "white");
        }

        // ---------------------------------------------------------------------------------------------------------------------------



        // knop icoontje + localstorage aanpassen als gedrukt op knop

        if (knop) knop.innerHTML = "<b>🌙</b>";
        localStorage.setItem("theme", "dark");



        // anders (lichte modus)


    } else {


        // body terug naar normaal

        body.dataset.theme = "light";
        bodybackground.style.backgroundImage = "";
        body.style.color = "black";
        body.style.backgroundColor = "white"




        // navbar terug naar normaal

        const navbar = document.querySelector(".navbar");
        if (navbar) {
            navbar.style.boxShadow = "";
            navbar.style.background = "";
        }

        // verdigheden terug naar normaal

        const vaardigheden = document.getElementsByClassName("vaardigheid");
        for (let vaardigheid of vaardigheden) {
            vaardigheid.style.backgroundColor = "";
        }

        // grijsvlak 2 terug naar normaal

        const grijsvlak2 = document.getElementById("grijsvlak2");
        if (grijsvlak2) {
            grijsvlak2.style.background = "";
            grijsvlak2.style.backgroundColor = "";
            grijsvlak2.style.color = "";
        }

        // h1 weer normaal
        const h1 = document.querySelector("h1");
        if (h1) h1.style.color = "";


        // projecten weer normaal
        const projecten = document.querySelectorAll(".Project");
        for (let project of projecten) {
            project.style.backgroundColor = ""
        }

        //achtergrond kleur van projectenpage weer normaal
        const achtergrondkleurdiv = document.getElementById("achtergrondkleurdiv");
        if (achtergrondkleurdiv) {
            achtergrondkleurdiv.style.background = ""
        }


        //achtergrondfade weer terug naar normaal

        const achtergrondfade = document.getElementById("achtergrondfade");
        if (achtergrondfade) {
            achtergrondfade.style.background = "";
        }

        // contact vlak terug naar normaal

        const contactVlak = document.getElementById("contact-vlak");
        if (contactVlak) {
            contactVlak.style.backgroundColor = ""
        }


        // contact teksten weer terug naar normaal (zwart)

        const texts = body.querySelectorAll("p, h1"); // alle text in contact-vlak
        texts.forEach(el => el.style.color = "");
    

    if (knop) knop.innerHTML = "<b>☀️</b>";
    localStorage.setItem("theme", "light");
}
}


//lcht/donker onthouden bij alle tabs

window.onload = function () {
    const theme = localStorage.getItem("theme") || "light"; // thema is dark of light
    const knop = document.getElementById("anderthema"); // knop 

    if (theme === "dark") { // als thema dark is
        anderThema(); // activeer dark mode
    } else {
        if (knop) knop.innerHTML = "<b>☀️</b>"; // zonnetje - nu dagmode
    }
}
