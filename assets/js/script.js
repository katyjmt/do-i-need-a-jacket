// TO DO: Set select variables for HTML elements with data that will update

const $citySearchForm = $('#city-search-form');
let $cityInput = $('#city-search-input'); 
const $citySearchButton = $('#city-search-button'); // Select search button
const $previousSearches = $('#previous-searches'); // Select container with previous search buttons
const $currentCityName = $('#current-city-name');
const $forecastDateEls = $('.forecast-date');
const $currentIcon = $('#current-icon');
let weatherData;
const $tempEls = $('.temp'); // Select spans containing temp data
const $windEls = $('.wind'); // Select spans containing wind data
const $humidityEls = $('.humidity'); // Select spans containing humidity data
const $5DayForecastCards = $('.card'); // Select 5 day forecast cards - populate using jQuery
let geocodeAPIURL = 'http://api.openweathermap.org/geo/1.0/direct?q=Melbourne&limit=1&appid=b168a8425ac9f53cc7568f543dca6de4';
let fiveDayForecastAPIURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=-37.8142176&lon=144.9631608&units=metric&cnt=6&appid=b168a8425ac9f53cc7568f543dca6de4'
let cityName; // Variable to store the currently-searched city nane
let cityNameState;
let cityLat; // Variables to store current lat / long
let cityLon;
let searchedCities = [];

// Function to render recent search buttons
function renderLastSearched() {
    const lastSearches = JSON.parse(localStorage.getItem("cities"));
    if (!lastSearches) {
        return;
    }
    for (i = 0; i < lastSearches.length; i++) {
        const newButton = $('<button>').addClass('previous-cities').attr('id', lastSearches[i]).text(lastSearches[i]);
        $previousSearches.prepend(newButton);
    };
  }
renderLastSearched();

// Populate current date and next 5 days on page load
let currentDay = dayjs();
$forecastDateEls.each(function (i, date) {
    let dateReturned = currentDay.add(i, 'day').format('DD/MM/YYYY');
    $(date).text(dateReturned);
});


// On submit event handler to check if city entered then add to API Geocoding URL & fetch data

$citySearchButton.on("click", function(event) {
    event.preventDefault();
    if ($cityInput.val()) { //[TO DO]*******NEED TO ENSURE SEARCH QUERY IS VALID */
        const userSearch = $cityInput.val().trim();
        searchedCities.push(userSearch); // Add search query to searchedCities array
        localStorage.setItem("cities", JSON.stringify(searchedCities)); // Save newly-updated searchedCities variable to local storage
        const newButton = $('<button>').addClass('previous-cities').attr('id', userSearch).text(userSearch);
        $previousSearches.prepend(newButton);
        geocodeAPIURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + userSearch + '&limit=1&appid=b168a8425ac9f53cc7568f543dca6de4';
        fetch(geocodeAPIURL)
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data);
            cityName = data[0].name;
            cityNameState = data[0].name + ', ' + data[0].state;
            $currentCityName.text(cityNameState);
            cityLat = data[0].lat;
            cityLon = data[0].lon; 
            // Feed lat/long into 5 Day Forecast API using lat/long retrieved
            fiveDayForecastAPIURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&units=metric&cnt=6&appid=b168a8425ac9f53cc7568f543dca6de4';  
            fetch(fiveDayForecastAPIURL)
            .then(res => {
                return res.json();
            })
            .then(data => {
                weatherData = data;
                console.log(weatherData);
                weatherData.list.forEach(function (day, i) {
                    let temp = day.main.temp;
                    let wind = day.wind.speed;
                    let humidity = day.main.humidity;
                    $tempEls.eq(i).text(temp);
                    $windEls.eq(i).text(wind);
                    $humidityEls.eq(i).text(humidity);
                });
            });
        });
    };
    $cityInput.val("");
})

// On click event handler for previous search buttons to trigger API calls
const $previousCities = $('.previous-cities'); // Select previous search buttons
$previousCities.on("click", function() {
    geocodeAPIURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + $previousCities.text() + '&limit=1&appid=b168a8425ac9f53cc7568f543dca6de4';
        fetch(geocodeAPIURL)
        .then(res => {
            console.log(res.json());
            return res.json();
        })
        .then(data => {
            console.log(data);
            cityName = data[0].name;
            cityNameState = data[0].name + ', ' + data[0].state;
            $currentCityName.text(cityNameState);
            cityLat = data[0].lat;
            cityLon = data[0].lon; 
            // Feed lat/long into 5 Day Forecast API using lat/long retrieved
            fiveDayForecastAPIURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&units=metric&cnt=6&appid=b168a8425ac9f53cc7568f543dca6de4';  
            fetch(fiveDayForecastAPIURL)
            .then(res => {
                return res.json();
            })
            .then(data => {
                weatherData = data;
                console.log(weatherData);
                weatherData.list.forEach(function (day, i) {
                    let temp = day.main.temp;
                    let wind = day.wind.speed;
                    let humidity = day.main.humidity;
                    $tempEls.eq(i).text(temp);
                    $windEls.eq(i).text(wind);
                    $humidityEls.eq(i).text(humidity);
                });
            });
        });
    });