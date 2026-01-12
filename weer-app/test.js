fetch("https://dog.ceo/api/breeds/image/random")
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // document.body.innerHTML = `<img src="${data.message}" alt="hondje">`;
  });
