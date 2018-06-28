//Start app, show start display
function appStart() {
  $('.start-button').click(function(event) {
    $('.home-page').hide();
    $('.js-start-display').prop('hidden', false);
  });
}

//get autocomplete city query from google API
function autocompleteQuery() {
  let input = $('#search-term');
  let autocomplete = new google.maps.places.Autocomplete(input[0]);
}

//get current weather results from Openweathermap API
function getWeatherResults() {
  $('.js-search-form').submit(function(event) {
    event.preventDefault();
    $('html, body').animate(
      {
        scrollTop: $('#weather-results').offset().top
      },
      1500
    );
    let city = $('.search-query').val();

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=7113abbcc3d0ba25223772c94f923152`,
      type: 'GET',
      dataType: 'jsonp',
      success: function(data) {
        console.log(data);
        let widget = showWeatherData(data);

        $('.js-weather-results').html(widget);
        $('.js-navigation-tabs').prop('hidden', false);
        $('.js-results').html('');
        $('.error').html('');
      },
      error: function(error) {
        $('.error').prop('hidden', false);
        $('.error').html('No results, please choose another city!');
      }
    });
  });
}

//show weather data on DOM
function showWeatherData(data) {
  return `
    <div class="weather-results row">
      <h2 class="results-title">Results for the current weather in ${
        data.name
      }:</h2>
      <img class="weather-gif" src="https://openweathermap.org/img/w/${
        data.weather[0].icon
      }.png" alt="picture of weather icon">
      <h3 class="weather">Current Weather:</span> ${data.weather[0].main}</h3>
      <h3 class="weather">Description: ${data.weather[0].description}</h3>
      <h3 class="weather">Tempurature: ${data.main.temp} °C</h3>
      <h3 class="weather">Humidity: ${data.main.humidity}</h3>
      <h3 class="weather">Min. Temp: ${data.main.temp_min} °C</h3>
      <h3 class="weather">Max. Temp: ${data.main.temp_max} °C</h3>
    </div>
  `;
}

//get venue results from Foursquare Places API
function getPlacesResults() {
  $('.category-tab').click(function(event) {
    $('html, body').animate(
      {
        scrollTop: $('#foursquare-results').offset().top
      },
      1500
    );
    let category = $(this).text();
    let city = $('.search-query').val();

    $.ajax({
      url: `https://api.foursquare.com/v2/venues/explore?&near=${city}&section=${category}&venuePhotos=1&limit=12&client_id=FPRD2S2RFIB4QLBNBBHNAMLYOUF2AZSZ21ZK53QYASWCRJ1Z&client_secret=FEFA44EG0YDZ0XKA1UWX5ZWLZJLE30E2GYRLGB44PKE5KZ0E&v=20180625`,
      type: 'GET',
      dataType: 'jsonp',
      success: function(data) {
        console.log(data);
        let results = data.response.groups[0].items.map(function(item, index) {
          return showPlacesData(item);
        });

        $('.js-results').html(results);
      }
    });
  });
}

//show places data on DOM
function showPlacesData(result) {
  console.log(result);
  let venueLocation = result.venue.name;
  let venueLink = `https://www.google.com/maps/search/${venueLocation} + ${
    result.venue.location.formattedAddress[1]
  }`;

  const FOURSQUARE_PHOTO_URL =
    'https://api.foursquare.com/v2/venues/' +
    result.venue.id +
    '/photos?&client_id=FPRD2S2RFIB4QLBNBBHNAMLYOUF2AZSZ21ZK53QYASWCRJ1Z&client_secret=FEFA44EG0YDZ0XKA1UWX5ZWLZJLE30E2GYRLGB44PKE5KZ0E&v=20180625';

  //ajax call for separate photos endpoint for each item in previous ajax call
  $.ajax(FOURSQUARE_PHOTO_URL, {
    data: {
      limit: 1
    },
    dataType: 'json',
    type: 'GET',
    async: false,
    success: function(data) {
      console.log(data);
      myPhotoResult = data;
      const venuePhoto =
        'https://igx.4sqi.net/img/general/width960' +
        data.response.photos.items[0].suffix;
      console.log(venuePhoto);
    }
  });

  let venuePhoto =
    'https://igx.4sqi.net/img/general/width960' +
    myPhotoResult.response.photos.items[0].suffix;
  let venueName = result.venue.name;
  //console.log(venueName);
  venueName = venueName.replace(/["'()-]/g, '');
  venueName = venueName.replace(/&-/g, ' ').trim();
  //console.log(venueName);

  return `
            <div class="result col-3">
                <div class="result-image" style="background-image: url(https://igx.4sqi.net/img/general/width960${
                  myPhotoResult.response.photos.items[0].suffix
                })" ;>
                </div>
                <div class="result-description">
                    <h2 class="result-name">${venueName}</h2>
                    <span class="icon">
                        <img src="${
                          result.venue.categories[0].icon.prefix
                        }bg_32${
    result.venue.categories[0].icon.suffix
  }" alt="category-icon">
                    </span>
                    <span class="icon-text">
                        ${result.venue.categories[0].name}
                    </span>
                    <p class="result-address">${
                      result.venue.location.formattedAddress[1]
                    }</p>
                    <p class="result-address">${
                      result.venue.location.formattedAddress[2]
                    }</p>
                    <a class="venue-directions" href="${venueLink}" target="_blank">Get Directions</a>
                </div>
            </div>
        `;
}

$(appStart);
$(getWeatherResults);
$(getPlacesResults);
$(autocompleteQuery);
