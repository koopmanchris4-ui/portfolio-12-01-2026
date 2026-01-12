
// chatgpt gebruikt

// zoek alle <img> in de galerij div


document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".galerij img");


    // loopt alles. wanneer plaatje ingeladen dan pas assignClass(img)
    images.forEach(img => {
        if (img.complete) {
            assignClass(img);
        } else {
            img.addEventListener("load", () => assignClass(img));
        }
    });

    // vergelijken van afmetingen

    function assignClass(img) {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        const ratio = width / height;

        // geeft class "rechthoek", "staand-rechthoek of "vierkant" zodat die fotos zelfde grootte krijgen
        if (ratio > 1.3) {
            img.classList.add("rechthoek"); // breder dan hoog, dan wordt class rechthoek
        } else if (ratio < 0.75) {
            img.classList.add("staand-rechthoek"); // hoger dan breed dan word class staand-rechthoek
        } else {
            img.classList.add("vierkant"); // ongeveer vierkant, dan wordt class vierkant
        }
    }
});