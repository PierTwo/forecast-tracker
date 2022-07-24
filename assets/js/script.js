// Gets elements from HTML
var searchBtnEl = $("#searchBtn")
var searchInputEl = $("#searchInput");
var weatherNow = $("#weatherNow");

// API key for OpenWeatherMap API
var apiKey = "99809bc32c8c7448097022421446e415";

// Gets coordinates for the city user searched for
function cityCoordinates(city) {
    // Promises to retrieve the API data for the city name the user searched for
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        // Returns the promise by getting API response
        .then(function (response) {
            // Formats the response to JSON
            return response.json();
        })
        // Returns promise with formatted JSON data
        .then(function (data) {
            // Creates an object of coordinates
            coordinates = {
                lat: data[0].lat,
                lon: data[0].lon,
            };
            // Calls cityWeather function and passes coordinates object to the function
            cityWeather(coordinates);
        });
};

// Retrieves weather data from coordinates
function cityWeather(coordinates) {
    // Promises to retrieve the API data for the weather at the city coordinates
    fetch(`https://api.openweathermap.org/data/2.5/onecall?&lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${apiKey}`)
        // Returns the promise by getting API response
        .then(function (response) {
            // Formats the response to JSON
            return response.json()
        })
        // Returns the promise with formatted JSON data
        .then(function (data) {
            // Creates variable with current weather data
            var currentWeather = data.current;
            // Calls renderWeather and passes the currentWeather variable to the function
            renderWeather(currentWeather);
        });
};

// Displays the current weather
function renderWeather(currentWeather) {
    // Formats unix timestamp to display the month, day, and year
    var currentDate = moment(currentWeather.dt * 1000).format("MM/DD/YY");

    // Creates a variable of HTML elements with current weather data to be appended to the webpage
    var weatherNowHTML = `<h2 class="fw-bold">${cityName} ${currentDate} <img src="http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png"></img></h2>` +
        `<p>Temp: ${Math.round(currentWeather.temp)}\u00B0F</p>` +
        `<p>Wind: ${Math.round(currentWeather.wind_speed)} MPH</p>` +
        `<p>Humidity: ${Math.round(currentWeather.humidity)}%</p>` +
        `<p>UV Index: <span class="bg-success text-white p-1">${currentWeather.uvi}</span></p>`;

    // Appends the weatherNowHTML to webpage 
    weatherNow.append(weatherNowHTML);
    // Adds Bootstrap classes to create a rounded border around the current weather container
    weatherNow.addClass("border border-dark rounded");

};

// Gets user input value from the city search input and calls cityCoordinates function to get the coordinates
function searchCity(event) {
    // Prevents the default event from occuring when button is clicked
    event.preventDefault();

    // Removes child elements of the current weather container in order to display the weather for a different city
    weatherNow.empty();

    // Creates a variable with the user input from the city search
    cityName = searchInputEl.val();
    // Calls the cityCoordinates function and passes the cityName variable to the function
    cityCoordinates(cityName);
};
// Adds event handler to the search button to call the searchCity function when user clicks the button
searchBtnEl.click(searchCity);
