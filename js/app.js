const container = document.querySelector(".container");
const loader = document.querySelector(".loader");
const images = document.querySelectorAll(".fas")
const popup = document.querySelector(".popup")
let search = "beer"
let index = 0;
let containerWidth = container.offsetWidth;

// constantes pour le popup
const modal = document.querySelector(".modal")
const closeModal = document.querySelector(".close");

// Terme de recherche des images
const regexSearch =/^[a-zA-Z](([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
let searchValue = document.querySelector("#search-value")
const form = document.querySelector(".search")
const errorMessage = document.querySelector(".error-search")


addMarginContainer = () => {
    const topBarHeight = document.querySelector(".top-bar").offsetHeight;
    const marginTopContainer = topBarHeight + 64;
    container.style.marginTop = `${marginTopContainer}px`;
}


// donne un chiffre entre 2 et 5
denominateur = () => {return Math.floor(Math.random()*4)+2}


// calcule la dimension (hauteur || largeur) de l'image
imageSize = (size, denom) => {
    return Math.floor(size/denom);
}

// on va chercher le terme de recherche
searchTerm = () => {
    const parameters = location.search.substring(1).split("&");

    if(parameters[0] !== ""){
        let temp = parameters[0].split("=");
        thevar = unescape(temp[0]);
        thevar = thevar.replace("-", " ");
        thevalue = unescape(temp[1]);
        thevalue = thevalue.replace("+", " ");
        search = thevalue
    }

    return search
}


/* Initialisation galerie lorsque le DOM est chargé */
loadContent = () => {
    window.scrollTo(0,0); 
    addMarginContainer();
    
    search = searchTerm()    

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    containerWidth = container.offsetWidth;
    
    for (let i = 0; i < 4; i++) {
        let denom = denominateur()      
        let height = imageSize(clientHeight, denom)
        let width = imageSize((containerWidth-(denom*20)), denom)
        addStuff(width, height, denom)
        index++
    }
}

// active/désactive les icons pour le loader
draw = (timePassed, i) => {
    let j = i+1;
    images[i].classList.remove("active")
    images[j].classList.add("active")
}

// animation du loader
animeLoader = () => {
    i = 0;

    let start = Date.now(); //défini le moment de départ

    let timer = setInterval(function() { 
        let timePassed = Date.now() - start; // calcule le temps écoulé

        if (timePassed >= 2500) {
            clearInterval(timer); // coupe l'animation après 2,5s
            return;
        }

        draw(timePassed, i);

     i++

    }, 500)
}


// enlever le loader en enlevant la classe active du loader
removeLoader = () => {
    loader.classList.remove("active")
}


loadElements = () => {
    // window.scrollTo(0,0);
    // On charge le contenu caché par le loader
    loadContent();
    // on anime le loader
    animeLoader();
    // on retire le loader après 2750ms
    setTimeout(removeLoader, 2750)
}


// Lorsque la fenêtre s'ouvre, on va exécuter les différentes fonctions dans loadElements
window.onload = loadElements();


window.addEventListener("scroll", () => {

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    if (clientHeight + scrollTop >= scrollHeight - 50) {
        let denom = denominateur()      
        let height = imageSize(clientHeight, denom)
        let width = imageSize((containerWidth-(denom*20)), denom)
        addStuff(width, height, denom)
    }
   
    if (index > 50){
        addPopup()
        index = 0;
    }

})


// fonction qui ajoute les images dans le container
function addStuff(width, height, denom){
    
    const newItem = document.createElement("div")
    newItem.classList.add("images");

    search = searchTerm()

    for (let i = 0; i < denom; i++) {
        const newImg = document.createElement('img');
        newImg.src = `https://loremflickr.com/${width}/${height}/${search}?random${index}`;
        newItem.appendChild(newImg)
        index++
    }

    container.appendChild(newItem)
}


// Popup recherche
addPopup = () => {
    modal.style.display = "block";
}

// Fermeture du popup
closeModal.onclick = function() {
  modal.style.display = "none";
}

// Si on clique n'importe où dans la fenêtre, le popup se ferme
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// lors d'un refresh on remonte au top de la page
window.onbeforeunload = () => {
    window.scrollTo(0,0);
    // return 
}


// on enlève le message d'erreur et le texte en rouge
searchValue.addEventListener("keyup", function(e) {
    if(searchValue.classList.contains("red")){
        searchValue.classList.toggle("red")
        errorMessage.classList.toggle("active")
    }
})


// eventListener sur le formulaire qu'on le submit
form.addEventListener("submit", function(e){

    // si la valeur de la recherche ne correspond pas au regex on active l'erreur et on envoie pas le formulaire
    if(searchValue.value.match(regexSearch) === null || searchValue.value === "C'est pas bon non'di'dju!"){
        searchValue.classList.add("red")
        errorMessage.classList.add("active")
        searchValue.value = "C'est pas bon non'di'dju!"
        e.preventDefault();
    } else {
        loadElements();
    }
})