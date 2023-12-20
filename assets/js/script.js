const currentWeatherDiv = document.querySelector('.current-weather'); // assigning HTML element to the const variable with the .current-weather selector
const weatherCardsDiv = document.querySelector('.weather-cards'); // assigning HTML element to the const variable with the .weather-cards
const searchButton = document.querySelector('.search-btn'); // assigning HTML button element to the const variable with the .search-btn
const cityInput = document.querySelector('.city-input'); // assigning HTML input element to the const variable with the .city-input
const historyButtonsContainer = document.querySelector('.history-buttons'); // assigning HTML element to the const variable with the .history-buttons

const searchHistoryKey = 'searchHistory'; // searchHistory string value is assigned to the searchHistory key, used for storing and retrieving search history
// Retrieve the current search history from local storage or initialize an empty array
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];


const ApiKey = 'f22020df271a2b65dbf8c5da9ccb2070'; // personal generated API key for the OpenWeatherMap API 




// function to retrieve day of the week from datestring
const getDayOfWeek = ( dateString => {
    
    //Array of days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // create a new date object using the date string information 
    const date = new Date(dateString); 
    
    // retrieve the day index from date object
    const dayIndex = date.getDay();
    
    // return the day of the week based on the index 
    return daysOfWeek[dayIndex];

})




// generate HTML for the data content  of the weather cards  (add date and year for the dayoftheweek data)
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML of the main weather display
        return ` <div class="details">
                    <h3>${cityName} (${getDayOfWeek(weatherItem.dt_txt)})</h3>  
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon"> 
                    <h4>Temp: ${weatherItem.main.temp.toFixed(0)}°C</h4>
                    <h4>Feels Like: ${weatherItem.main.feels_like.toFixed(0)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity} %</h4>
                    </div>`;
    } else {  // HTML for the 5 day forecast card 
        return `<li class="card">
                <h3>${getDayOfWeek(weatherItem.dt_txt)}</h3> 
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <h4>Temp: ${weatherItem.main.temp.toFixed(0)}°C</h4>
                <h4>Feels Like: ${weatherItem.main.feels_like.toFixed(0)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity} %</h4>
                </li>`;

    }
    
};




// Function for retrieving weather data based on parameters to start building 5 day forecast
const getWeatherData = (cityName, lat, lon) => {
    
    // constructed the API URL with param placeholders
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`;

    

    //Making Fetch call from API with the URL 
    fetch(weatherApiUrl).then(res => res.json()).then(data => { // fetches response object data and converts to JSON format then processes JSON data so it can be used in code block below.

        // Getting only one forecast per day 
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
   

            cityInput.value = ''; // clear the previous input value
            weatherCardsDiv.innerHTML = ''; // Clear existing cards content 
            currentWeatherDiv.innerHTML = ''; // Clear existing cards content 

            // Generating a weather card for each forecast day
            fiveDayForecast.forEach((weatherItem, index) => {
                // check to see if its the first day 
                if(index === 0) {
                     console.log('Current Day Weather Item:', weatherItem);
                    // Insert the HTML content for the CURRENT days weather into 'currentWeatherDiv'
                     currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                } else {
                    // Insert the HTML content for the fivedays weather into the 'weatherCardsDiv'
                    weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }  
            });
    
            // Convert the city name to lowercase for case-insensitive comparison
            const lowercaseCityName = cityName.toLowerCase();

         // Checks to see if the city already exists in the search history
         if (!searchHistory.includes(lowercaseCityName)) {

            // Adding the searched city to the history
            searchHistory.push(lowercaseCityName);

            // Save the updated history to local storage
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

         }
         
         
    
    
    
    
    
    
    
         // catch any errors that occur during the fetching of the weather data
    }).catch(() => {
        alert('Baboon: Error occured while fetching the weather forecast')

    })

}; 






// function to get the city coordinates and name from the API response 
const retrieveCityCoordinates = function () {
    const cityName = cityInput.value.trim(); // get the name of the city entered in the box and pass it to cityName const. Input is a value. 
    if(!cityName) return; // if city name is empty, return 

    console.log(cityName) // checks if city name entered in box shows a value. 


    // Add the searched city to the history
    searchHistory.push(cityName);

    // Save the updated history to local storage
    localStorage.setItem(searchHistoryKey, JSON.stringify(searchHistory));

  

    const GeocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${ApiKey}`; // refactor 

    // get the city coordinates and name from the API response
    fetch(GeocodingApiUrl)
        .then(res => res.json()).then(data => { // fetches response object data and converts to JSON format then processes JSON data so it can be used in code block below.
           
            // error message incase array data is empty will return a alert message
            if(!data.length) return alert(`Coordinates not found for ${cityName}`);
           
            // grabbing the specific properties we are looking for in the array element 0
            const { name, lat, lon } = data[0];
           
            getWeatherData(name, lat, lon); // calls function getWeatherData
        }).catch(() => {
            alert('Horse: Error occured while fetching the coordinates') // catch alert incase of error

        })

    
};





const updateHistoryButtons = () => {
    /*
    1a) Access the search history array and filter unique searches so duplicates wont populate the buttons. Can use the SET data structure since it ensures unique properties. 
    2b) Iterate over the new created SET , and then create a button element for each city in the array
    3c) Set the text content for the buttons to match city names searched 
    4d) Add css class to the button element for styling 
    5e) Add click event to the button element , mimic the search event behavior 
            - When button is clicked, 
            -Sets the City name in the search bar and triggers the search
    6f) Append the dynamically generated buttons to the historyButtonsContainer 
    7g) Call the function updateHistoryButtons() 
     */

/* create a function (Y) that accepts cityname as input and populates the DOM 

 on click of the search button call function (x), get the input value and call function (y) with cityName fron input.value

 for side buttons, when adding eventlisteners , Get cityName by using event.target.innerHTML and then call function (y) with cityNam

function Y manipulate DOM elements 

init function should be intermediate function for the click event search button. Only accessed when search button is clicked. 

*/





}









// event listener for the click of the search button to call the function retrieveCityCoordinates
searchButton.addEventListener('click', retrieveCityCoordinates);    