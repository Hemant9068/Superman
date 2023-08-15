let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");
searchBar.addEventListener("input", () => searchHeros(searchBar.value));
async function searchHeros(textSearched) {
    if (textSearched.length == 0) {
        searchResults.innerHTML = ``;
        return;
   }
  
   await fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${textSearched}&apikey=f87c00a9d2410f6adf1dd72df153fa67&hash=b85ba3d0d0010081a5d0bcdaf702bdf0&ts=1691548842040`)
   .then(res => res.json()) //Converting the data into JSON format
   .then(data => showSearchedResults(data.data.results))
}
function showSearchedResults(searchedHero) { 
    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
    if(favouritesCharacterIDs == null){
         favouritesCharacterIDs = new Map();
    }
    else if(favouritesCharacterIDs != null){
         // If the we got the favouritesCharacterIDs in localStorage then parsing it and converting it to map
         favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
    }

    searchResults.innerHTML = ``;
    // count is used to count the result displayed in DOM
    let count = 1;

    // iterating the searchedHero array using for loop
    for (const key in searchedHero) {
         // if count <= 5 then only we display it in dom other results are discarded
         if (count <= 5) {
              // getting the single hero 
              // hero is the object that we get from API
              let hero = searchedHero[key];
              // Appending the element into DOM
              searchResults.innerHTML +=
                   `
              <li class="flex-row single-search-result">
                   <div class="flex-row img-info">
                        <img src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
                        <div class="hero-info">
                             <a class="character-info" href="./heroinfo.html">
                                  <span class="hero-name">${hero.name}</span>
                             </a>
                        </div>
                   </div>
                   <div class="flex-col buttons">
                        <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                        <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
                   </div>
                   <div style="display:none;">
                        <span>${hero.name}</span>
                        <span>${hero.description}</span>
                        <span>${hero.comics.available}</span>
                        <span>${hero.series.available}</span>
                        <span>${hero.stories.available}</span>
                        <span>${hero.thumbnail.path+'/portrait_uncanny.' + hero.thumbnail.extension}</span>
                        <span>${hero.id}</span>
                        <span>${hero.thumbnail.path+'/landscape_incredible.' + hero.thumbnail.extension}</span>
                        <span>${hero.thumbnail.path+'/standard_fantastic.' + hero.thumbnail.extension}</span>
                   </div>
              </li>
              `
         }
         count++;
    }
    // Adding the appropritate events to the buttons after they are inserted in dom
    events();
}
function events() {
     let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
     favouriteButton.forEach((btn) => btn.addEventListener("click", addToFavourites));

    let characterInfo = document.querySelectorAll(".character-info");
    characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage))
}
function addToFavourites() {

    // If add to favourites button is cliked then
    if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites') {

         // We cretate a new object containg revelent info of hero and push it into favouritesArray
         let heroInfo = {
              name: this.parentElement.parentElement.children[2].children[0].innerHTML,
              description: this.parentElement.parentElement.children[2].children[1].innerHTML,
              comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
              series: this.parentElement.parentElement.children[2].children[3].innerHTML,
              stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
              portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
              id: this.parentElement.parentElement.children[2].children[6].innerHTML,
              landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
              squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
         }

         // getting the favourites array which stores objects of character  
         // We get null is no such array is created earlier i.e user is running the website for the first time
         let favouritesArray = localStorage.getItem("favouriteCharacters");

         // If favouritesArray is null (for the first time favourites array is null)
         if (favouritesArray == null) {
              // favourites array is null so we create a new array
              favouritesArray = [];
         } else {
              // if it is not null then we parse so that it becomes an array 
              favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
         }

         // favouritesCharacterIDs is taken from localStorage for adding ID of the character which is added in favourites
         // It is created because when we search for the characters which is already added in favourites we check that if the id of the character exist in this array then we display "Remove form favourites" insted of "Add to favourites"
         let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

         
         if (favouritesCharacterIDs == null) {
         // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
              favouritesCharacterIDs = new Map();
         } else {
              // getting the map as object from localStorage and pasrsing it and then converting into map 
              favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
              // favouritesCharacterIDs = new Map(Object.entries(favouritesCharacterIDs));
         }

         // again setting the new favouritesCharacterIDs array to localStorage
         favouritesCharacterIDs.set(heroInfo.id, true);
         // console.log(favouritesCharacterIDs)

         // adding the above created heroInfo object to favouritesArray
         favouritesArray.push(heroInfo);

         // Storing the new favouritesCharactersID map to localStorage after converting to string
         localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
         // Setting the new favouritesCharacters array which now has the new character 
         localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));

         // Convering the "Add to Favourites" button to "Remove from Favourites"
         this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';
         
         // Displaying the "Added to Favourites" toast to DOM
         document.querySelector(".fav-toast").setAttribute("data-visiblity","show");
         // Deleting the "Added to Favourites" toast from DOM after 1 seconds
         setTimeout(function(){
              document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
         },1000);
    }
    // For removing the character form favourites array
    else{
         
         // storing the id of character in a variable 
         let idOfCharacterToBeRemoveFromFavourites = this.parentElement.parentElement.children[2].children[6].innerHTML;
         
         // getting the favourites array from localStorage for removing the character object which is to be removed
         let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
         
         // getting the favaourites character ids array for deleting the character id from favouritesCharacterIDs also
         let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
         
         // will contain the characters which should be present after the deletion of the character to be removed 
         let newFavouritesArray = [];
         // let newFavouritesCharacterIDs = [];
         
         // deleting the character from map using delete function where id of character acts as key
         favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);
         
         // creating the new array which does not include the deleted character
         // iterating each element of array
         favouritesArray.forEach((favourite) => {
              // if the id of the character doesn't matches the favourite (i.e a favourite character) then we append it in newFavourites array 
              if(idOfCharacterToBeRemoveFromFavourites != favourite.id){
                   newFavouritesArray.push(favourite);
              }
         });
         
         // console.log(newFavouritesArray)
         
         // Updating the new array in localStorage
         localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
         localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
         
         
         // Convering the "Remove from Favourites" button to "Add to Favourites" 
         this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';
         
         // Displaying the "Remove from Favourites" toast to DOM
         document.querySelector(".remove-toast").setAttribute("data-visiblity","show");
         // Deleting the "Remove from Favourites" toast from DOM after 1 seconds
         setTimeout(function(){
              document.querySelector(".remove-toast").setAttribute("data-visiblity","hide");
         },1000);
         // console.log();
    }     
}

function addInfoInLocalStorage() {

    // This function basically stores the data of character in localStorage.
    // When user clicks on the info button and when the info page is opened that page fetches the heroInfo and display the data  
    let heroInfo = {
         name: this.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
         description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
         comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
         series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
         stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
         portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
         id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
         landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
         squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
    }

    localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
