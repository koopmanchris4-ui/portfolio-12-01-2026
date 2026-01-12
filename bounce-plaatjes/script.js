const API_KEY = '03Beqpa9pnVKxWsjJW8q2MBEAGRZwK1jkGPDZBxnGSHuDlnZI9gegSBD';
const galerij = document.querySelector('.galerij');
let pagina = 1;



// fotos ophalen van pexels


async function haalFotosOp() {

    const response = await fetch(`https://api.pexels.com/v1/curated?per_page=300&page=${pagina}`, {
        headers: { Authorization: API_KEY }
    });
    

    // zet API data om naar javascript data
    const data = await response.json();



    // Foto's op pagina laten zien
    const nieuweImgs = []; // in array tijdelijk
    data.photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.src.medium;
        nieuweImgs.push(img);
        galerij.appendChild(img);
    });
}


window.onload = haalFotosOp;