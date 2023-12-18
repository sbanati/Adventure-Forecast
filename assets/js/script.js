const currentWeatherDiv = document.querySelector('.current-weather'); // assigning HTML element to the const variable with the .current-weather selector
const weatherCardsDiv = document.querySelector('.weather-cards'); // assigning HTML element to the const variable with the .weather-cards
const searchButton = document.querySelector('.search-btn'); // assigning HTML button element to the const variable with the .search-btn
const cityInput = document.querySelector('.city-input'); // assigning HTML input element to the const variable with the .city-input


// function to get the city coordinates 
const retrieveCityCoordinates = function () {
    const cityName = cityInput.value.trim(); // get the name of the city entered in the box and pass it to cityName const. Input is a value. 
    if(!cityName) return; // if city name is empty, return 

    console.log(cityName) // checks if city name entered in box shows a value. 

};







// event listener for the click of the search button to call the function retrieveCityCoordinates
searchButton.addEventListener('click', retrieveCityCoordinates);    
