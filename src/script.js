import { getMovieDataAPI, getCountryDataAPI } from "./data.js";

const btn = document.querySelector(".btn");
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
	movieCard.insertAdjacentText("beforeend", message);
}

function renderCountry(data) {
	const html = `
	<div class="country-inf">
		<img src="${data.flag}"/>
		<h3 class="country-name">${data.name}</h3>
		<p class="country-currency">${data.currency}</p>
	</div>
    `;

	countries.insertAdjacentHTML("beforeend", html);
}

async function getMovieData(movie) {
	const movieData = await getMovieDataAPI(movie).then((data) => ({
		name: data.Title,
		actors: data.Actors.split(" "),
		country: data.Country.split(", "),
		releasedYear: data.Year,
	}));

	const countryData = await Promise.all(
		movieData.country.map((countryName) => getCountryDataAPI(countryName)),
	).then((countryData) =>
		countryData.map((d) => ({
			name: d[0].name,
			flag: d[0].flags.png,
			currency: d[0].currencies[0].name,
		})),
	).catch((err) => {
		renderError(`Something went wrong for 1 ${err.message}. Try again!`);
	});

	movieContainer.style.display = "flex";
	const actorsNamesArr = [];
	movieData.actors.forEach((el, i) => {
		if (i % 2 === 0) {
			actorsNamesArr.push(el);
		}
	});
	const actorsNames = actorsNamesArr.join(", ");

	console.log(movieData);
	movieNameClass.textContent = movieData.name;
	actorsClass.textContent = `Actors: ${actorsNames}`;
	dateClass.textContent = `The movie was realised ${new Date().getFullYear() - +movieData.releasedYear} years ago`;
	countryData.forEach(el => {
		renderCountry(el);
	});
}

btn.addEventListener("click", function () {
	if (input.value !== "") {
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

async function get4Movies(movies) {
	let moviesData = await Promise.all(
		movies.map((movieName) => getMovieDataAPI(movieName)),
	).then((movies) =>
		movies.map((d) => ({ runtime: parseInt(d.Runtime), countries: d.Country.split(", ") })),
	);
	const totalRuntime = moviesData.reduce((a, c) => a + c.runtime, 0);

	const countriesArr = [];
	moviesData.forEach((el) => {
		el.countries.forEach(co => countriesArr.push(co));
	});

	const countriesSet = new Set(countriesArr);
	const countriesArray = Array.from(countriesSet);

	const countryData = await Promise.all(
		countriesArray.map((countryName) => getCountryDataAPI(countryName))
	).then((country) => country.map((d) => ({population: d[0].population})));

	const totalPopulation = countryData.reduce((a, c) => a + c.population, 0);
	container3Movies.style.display = "flex";

	lengthId.textContent = `The length of all the movies combined in minutes: ${totalRuntime} minutes`;


	populationId.textContent = `Sum of population of all the countries in which the movies where made: ${(
		totalPopulation / 1000000
	).toFixed(1)} million`;
}

btn3Movies.addEventListener("click", function () {
	if (
		inputs[0].value !== "" &&
		inputs[1].value !== "" &&
		inputs[2].value !== ""
	) {
		warningDiv1.innerHTML = "";
		warningDiv2.innerHTML = "";

		let inputText = [];
		inputs.forEach((e) => inputText.push(e.value));
		get4Movies(inputText);

		inputs.forEach((el) => (el.value = ""));
	} else {
		warningDiv2.innerHTML = `<p class="warning">Please fill all the inputs to approve your search!</p>`;
	}
});