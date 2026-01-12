

// open dropdown-menu
function openmenu() {
    var dropdown = document.querySelector('.dropdown-menu');
    if (dropdown.style.display == "block") {
        dropdown.style.display = "none";
    }

    else {
        dropdown.style.display = "block";
    }

}


// Open puntjes-menu
document.querySelectorAll('.puntjes').forEach(function (puntjes) {
    puntjes.addEventListener('click', function () {
        const puntjesMenu = puntjes.querySelector('.puntjes-menu');
        puntjesMenu.style.display = (puntjesMenu.style.display === 'block') ? 'none' : 'block';
    });
});


//Menu submenu instellingen
function expand(event) {
    event.stopPropagation();
    var dropdown = document.getElementById("instellingen");

    if (dropdown.style.display == "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
}


// open subMenu Uiterlijk
function expand2(event) {
    event.stopPropagation();
    var dropdown = document.getElementById("uiterlijk");

    if (dropdown.style.display == "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
}


// open subMenu startpagina
function expand3(event) {
    event.stopPropagation();
    var dropdown = document.getElementById("startpagina");

    if (dropdown.style.display == "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
}

