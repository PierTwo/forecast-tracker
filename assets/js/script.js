// Gets elements from HTML
var searchBtnEl = $("#searchBtn");
var searchInputEl = $("#searchInput");
var weatherNow = $("#weatherNow");
var fiveDayForecast = $("#fiveDayForecast");
var historyContainer = $("#historyContainer");
var clearHistoryEl = $("#clearHistoryBtn");

// API key for OpenWeatherMap API
var apiKey = "99809bc32c8c7448097022421446e415";

// Defines a variable to be used to store the city name
var cityName;

// When the document loads run this function
$(document).ready(function () {
    // Loops through every local storage item
    for (let i = 0; i < localStorage.length; i++) {
        // And if that local storage item is truthy...
        if (localStorage.getItem(i)) {
            // Create a variable that contains the HTML for the history button using the value of i to get that storage item and it's id
            var historyBtnHTML = `<button id="${localStorage.key(i)}"class="border-0 rounded col-12 p-1 historyBtn mb-3">${localStorage.getItem(i)}</button>`;
            // Place the historyBtnHTML within the historyContainer on the page before other child elements
            historyContainer.prepend(historyBtnHTML);
        };
    };
});

// Gets coordinates for the city user searched for
function cityCoordinates() {
    // Promises to retrieve the API data for the city name the user searched for
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
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
            // Creates variable with forecast data
            var forecast = data.daily;

            // Calls renderWeather and passes the currentWeather variable to the function
            renderWeather(currentWeather);
            // Calls renderForecast and passes the forecast variable to the function
            renderForecast(forecast);
        });
};

// Displays the current weather
function renderWeather(currentWeather) {
    // Formats unix timestamp to display the month, day, and year
    var currentDate = moment(currentWeather.dt * 1000).format("MM/DD/YY");

    // Creates a variable of HTML elements with current weather data to be appended to the page
    var weatherNowHTML = `<h2 class="fw-bold">${cityName} ${currentDate} <img src="http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png"></img></h2>` +
        `<p>Temp: ${Math.round(currentWeather.temp)}\u00B0F</p>` +
        `<p>Wind: ${Math.round(currentWeather.wind_speed)} MPH</p>` +
        `<p>Humidity: ${Math.round(currentWeather.humidity)}%</p>` +
        `<p>UV Index: <span class="bg-success text-white p-1">${currentWeather.uvi}</span></p>`;

    // Appends the weatherNowHTML to page 
    weatherNow.append(weatherNowHTML);
    // Adds Bootstrap classes to create a rounded border around the current weather container
    weatherNow.addClass("border border-dark rounded");
};

// Renders the 5 day forecast to the page
function renderForecast(forecast) {
    // Creates a variable of a h2 tag
    var forecastTitle = `<h2 class="row fw-bold">5 Day Forecast:</div>`;
    // Appends the forecastTitle variable to the page
    fiveDayForecast.append(forecastTitle);

    // Creates for loop to display five days of forecast
    for (let i = 0; i < 5; i++) {
        // Creates a variable to display each date for the forecast
        forecastDate = moment(forecast[i].dt * 1000).format("MM/DD/YY");

        // Creates a variable of HTML elements to display forecast cards
        var forecastHTML = `<div class="m-4 mt-2 card card-bg text-white" style="height: 16rem; width: 12rem;">` +
            `<h2 class="fw-bold">${forecastDate}</h2>` +
            `<img src="http://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png" style="width: 50px;">` +
            `<p>Temp: ${Math.round(forecast[i].temp.max)}\u00B0F</p>` +
            `<p>Wind: ${Math.round(forecast[i].wind_speed)} MPH</p>` +
            `<p>Humidity: ${Math.round(forecast[i].humidity)}%</p>` +
            `<p>UV Index: <span class="bg-success text-white p-1">${forecast[i].uvi}</span></p>` +
            `</div>`;

        // Appends the forecastHTML variable to the page 
        fiveDayForecast.append(forecastHTML);
    };
};

// Gets user input value from the city search input and calls cityCoordinates function to get the coordinates
function searchCity(event) {
    // Prevents the default event from occuring when button is clicked
    event.preventDefault();

    // Calls emptyWeather function
    emptyWeather();

    // Sets cityName to the search input value
    cityName = searchInputEl.val();

    // Calls the cityCoordinates function
    cityCoordinates();
    // Calls the saveHistory function
    saveHistory();
};

// Removes the displayed weather to be replaced with new weather data
function emptyWeather() {
    // Removes child elements of the current weather container in order to display the weather for a different city
    weatherNow.empty();
    // Removes previous forecast so it is only displayed once
    fiveDayForecast.empty();
};

// Saves the user's search history and places history button on page
function saveHistory() {
    // Loops through all the children of historyContainer
    for (let i = 0; i < historyContainer.children().length; i++) {
        // Creates a variable with HTML in it and sets the id to i and the text to the cityName variable
        var historyBtnHTML = `<button id="${i}" class="border-0 rounded col-12 p-1 historyBtn mb-3">${cityName}</button>`;
    };
    // Places the historyBtnHTML before any other child elements
    historyContainer.prepend(historyBtnHTML);

    // For each element matching the class of historyBtn
    $(".historyBtn").each(function (index) {
        // Set local storage key equal to the index value and the item with the current index id
        localStorage.setItem(index, $(`#${index}`).text());
    });
};

// Removes the search history
function removeHistory() {
    // Removes all sibling elements of the clearHistoryEl button
    clearHistoryEl.siblings().remove();
    // Clears local storage
    localStorage.clear();
};

// Gets the name of the history button you clicked on to give to the cityCoordinates function and calls it
function historyWeather(event) {
    // Prevents the default event when clicking on the button
    event.preventDefault();

    // Calls the emptyWeather function
    emptyWeather();

    // Sets cityName the the text of the button the user clicked
    cityName = $(this).text()
    // Calls the cityCoordinates function to get weather data for the history button
    cityCoordinates();
};

// Adds event handler to the search button to call the searchCity function when user clicks the button
searchBtnEl.click(searchCity);

// Adds event handler to the clear history button to call the removeHistory function when clicked
clearHistoryEl.click(removeHistory);

// Adds event handler to all the buttons with the class of historyBtn to call the historyWeather function when clicked
$(document).on("click", ".historyBtn", historyWeather);
