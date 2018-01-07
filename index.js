function autocompleteQuery() {
  let input = document.getElementById('search-term');
  let autocomplete = new google.maps.places.Autocomplete(input);
}

function getWeatherResults() {
  $('.js-search-form').submit(function(event) {
    event.preventDefault();
    let city = $('.search-query').val();

    $.ajax({

      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=7113abbcc3d0ba25223772c94f923152`,
      type: 'GET',
      dataType: 'jsonp',
      success: function(data) {
        let widget = showWeatherData(data);

        $('.js-weather-results').html(widget);
        $('.js-navigation-buttons').prop('hidden', false);
        $('.js-results').html('');
      }

    });

 });

}

function showWeatherData(data) {
  return `
    <h2 class="results-title">Results for the current weather in ${data.name}:</h2>
    <img class="weather-icon" src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
    <h3 class="weather">Current Weather: ${data.weather[0].main}</h3>
    <h3 class="weather">Description: ${data.weather[0].description}</h3>
    <h3 class="weather">Tempurature: ${data.main.temp} °C</h3>
    <h3 class="weather">Humidity: ${data.main.humidity}</h3>
    <h3 class="weather">Min. Temp: ${data.main.temp_min} °C</h3>
    <h3 class="weather">Max. Temp: ${data.main.temp_max} °C</h3>

  `;
}

function getPlacesResults() {
  $('.category-button').click(function(event) {
    let category = $(this).text();
    let city = $('.search-query').val();

      $.ajax({

        url: `https://api.foursquare.com/v2/venues/explore?&near=${city}&section=${category}&venuePhotos=1&limit=12&client_id=02S31L2GILSBQDIMCCDQS5YYMWJW4PZRA0DN2NIZDYZUNC3I&client_secret=B2SUFTUSBX2D5W2UVXN4BVAT1WYUKTIP1MHZNQZWWIYBEGQ2&v=20180103`,
        type: 'GET',
        dataType: 'jsonp',
        success: function(data) {
          console.log(data);
          let results = data.response.groups[0].items.map(function (item, index) {
            return showPlacesData(item);
           });
          $('.js-results').html(results);
        }

      });

  });
}

function showPlacesData(result) {
  return `
    <div class="venue-results col-3">
      <img class="venue-photo" src="https://igx.4sqi.net/img/general/width333${result.venue.featuredPhotos.items[0].suffix}">
      <h3 class="venue"><a href="${result.venue.url}" target="_blank">${result.venue.name}</a></h3>
    </div>
  `;
}

$(getWeatherResults);
$(getPlacesResults);
$(autocompleteQuery);



