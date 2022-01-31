"use strict";
export function getMovieDataAPI(name) {
	return fetch(
		`http://www.omdbapi.com/?i=tt3896198&apikey=1b7a4e59&t=${name}`,
	).then((response) => response.json());
}

export function getCountryDataAPI(name) {
	return fetch(`https://restcountries.com/v2/name/${name}`).then((response) =>
		response.json(),
	);
}