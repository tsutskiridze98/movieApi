'use strict';

const btn = document.querySelector('.btn');
const input = document.querySelector(".input");
const movieContainer = document.querySelector(".movie-container");
const countries = document.querySelector(".countries");
const movieCard = document.querySelector(".movie-card");

const forSearch1 = document.querySelector(".for-search1");
const warningDiv1 = document.querySelector(".warning-div1");
const warningDiv2 = document.querySelector(".warning-div2");

const movieNameClass = document.querySelector(".movie-name");
const dateClass = document.querySelector(".date");
const actorsClass = document.querySelector(".actors");

function renderError(message) {
    movieCard.insertAdjacentText('beforeend', message);
}

function renderCountry(data) {

    const html = `
    <div class="country-inf">
        <img src="${data[0].flag}"/>
        <h3 class="country-name">${data[0].name}</h3>
        <p class="country-currency">${data[0].currencies[0].name}</p>
    </div>
    `;

    countries.insertAdjacentHTML("beforeend", html);

}

function renderMovie(data) {
    const actorsFullNames = data.Actors.split(" ");
    //console.log(actorsFullNames);
    const actorsNamesArr = [];
    actorsFullNames.forEach((el, i) => {
        if(i % 2 === 0) {
            actorsNamesArr.push(el);
        }
    })

    const actorsNames = actorsNamesArr.join(", ")

    //console.log(actorsNames);
    movieContainer.style.display= "flex";

    movieNameClass.textContent = data.Title;
    dateClass.textContent = `The movie was realised ${new Date().getFullYear() - +data.Year} years ago`;
    actorsClass.textContent = `Actors: ${actorsNames}`;
}


function getMovieData(movie) {
    // Country 1
    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1b7a4e59&t=${movie}`)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        renderMovie(data);
        const countries = data.Country.split(", ");
        console.log(countries);
        const promises = [];
        for(let i = 0; i < countries.length; i++) {
            promises.push(fetch(`https://restcountries.com/v2/name/${countries[i]}`));
        }
        //console.log(promises);
        return Promise.all(promises)
    })
    .then(async(aa) => {
        //console.log(aa);
        for(let i = 0; i < aa.length; i++) {
           const a = await aa[i].json();
           //console.log(a);
            //console.log(a[0].name);
            renderCountry(a);
        }
      })
    .catch(err => {
        renderError(`Something went wrong for 1 ${err.message}. Try again!`);
    })
};

btn.addEventListener("click", function() {
    if(input.value !== "") {
        warningDiv1.innerHTML = "";
        warningDiv2.innerHTML = "";
        const movieName = input.value;
        getMovieData(movieName);

        input.value = "";
        countries.innerHTML = "";
    } else {
        warningDiv1.innerHTML = `<p class="warning">Please write a movie name inside an input to search a movie</p>`;
    }
    
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// 3 movies Search Functionality /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Selectors 
const container3Movies = document.querySelector(".movie-container-3movie");
const inputs = document.querySelectorAll(".input-movie");
const btn3Movies = document.querySelector(".btn-3-movie");

const lengthId = document.querySelector("#length");
const populationId = document.querySelector("#population");

let movieLengthSum = 0;
let populationSum = 0;

function renderPopulation(data) {
    const pop = data[0].population;
    populationSum += pop;
    populationId.textContent = `Sum of population of all the countries in which the movies where made: ${(populationSum / 1000000).toFixed(1)} million`;
}


function get3Movies(movie) {
    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1b7a4e59&t=${movie}`)
    .then(response => response.json())
    .then(data => {
        const movieLength = data.Runtime.split(" ");
        movieLengthSum += +movieLength[0];
        lengthId.textContent = `The length of all the movies combined in minutes: ${movieLengthSum} minutes`;

        const countries = data.Country.split(", ");
        //console.log(countries);
        const promises = [];
        for(let i = 0; i < countries.length; i++) {
            promises.push(fetch(`https://restcountries.com/v2/name/${countries[i]}`));
        }
        //console.log(promises);
        return Promise.all(promises)
    })
    .then(async(aa) => {
        //console.log(aa);
        for(let i = 0; i < aa.length; i++) {
           const a = await aa[i].json();
           //console.log(a);
            renderPopulation(a);
            container3Movies.style.display = "flex";
        }
    })
    .catch(err => {
        renderError(`Something went wrong for 1 ${err.message}. Try again!`);
    })
}


btn3Movies.addEventListener("click", function() {
    if(inputs[0].value !== "" && inputs[1].value !== "" && inputs[2].value !== "") {
        warningDiv1.innerHTML = "";
        warningDiv2.innerHTML = "";
        inputs.forEach(el => get3Movies(el.value));

        inputs.forEach(el => el.value = "");
        movieLengthSum = 0;
        populationSum = 0;
    } else {
        warningDiv2.innerHTML = `<p class="warning">Please fill all the inputs to approve your search!</p>`;
    }
    
});