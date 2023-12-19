const currentWeatherDiv = document.querySelector('.current-weather'); // assigning HTML element to the const variable with the .current-weather selector
const weatherCardsDiv = document.querySelector('.weather-cards'); // assigning HTML element to the const variable with the .weather-cards
const searchButton = document.querySelector('.search-btn'); // assigning HTML button element to the const variable with the .search-btn
const cityInput = document.querySelector('.city-input'); // assigning HTML input element to the const variable with the .city-input

const ApiKey = 'f22020df271a2b65dbf8c5da9ccb2070'; // random generated API key for the OpenWeatherMap API 



// Function for retrieving weather data based on parameters
const getWeatherData = (cityName, lat, lon) => {
    
    // constructed the API URL with param placeholders
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}`;

    //Making Fetch call from API with the URL 
    fetch(weatherApiUrl).then(res => res.json()).then(data => { // fetches response object data and converts to JSON format then processes JSON data so it can be used in code block below.

        // store the individual forecast days into an Array
        const individualForecastDays = [];

        // Using the filter method on the list of forecast hours to retrieve unique forecast days
        const fiveDayForecast = data.list.filter(forecast => {
            
            // create new date object using date and time information then calls .getDate method to extract the day of the month.
            const forecastDate = new Date(forecast.dt_txt).getDate();

            // check if the forecast date is not in the array already
            if(!individualForecastDays.includes(forecastDate)) {
                
                // if forecast date is not, push it into the array
                return individualForecastDays.push(forecastDate);
            }
        });   
   
            console.log(fiveDayForecast);
    }).catch(() => {
        alert('Error occured while fetching the weather forecast')

    })

}; /*!TODO We have the weather details but it gives us incriments of every 3 hours, so my next step is to sort this in a 5 day forecast. */























// function to get the city coordinates and name from the API response 
const retrieveCityCoordinates = function () {
    const cityName = cityInput.value.trim(); // get the name of the city entered in the box and pass it to cityName const. Input is a value. 
    if(!cityName) return; // if city name is empty, return 

    console.log(cityName) // checks if city name entered in box shows a value. 

    const GeocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${ApiKey}`;

    // get the city coordinates and name from the API response
    fetch(GeocodingApiUrl)
        .then(res => res.json()).then(data => { // fetches response object data and converts to JSON format then processes JSON data so it can be used in code block below.
           
            // error message incase array data is empty 
            if(!data.length) return alert(`Coordinates not found for ${cityName}`);
           
            // grabbing the specific properties we are looking for in the array element 0
            const { name, lat, lon } = data[0];
           
            getWeatherData(name, lat, lon); // calls function getWeatherData
        }).catch(() => {
            alert('Error occured while fetching the coordinates') // catch alert incase of error

        })

    
};






// event listener for the click of the search button to call the function retrieveCityCoordinates
searchButton.addEventListener('click', retrieveCityCoordinates);    