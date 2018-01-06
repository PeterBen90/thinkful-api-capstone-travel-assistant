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
      }

    });

 });

}

function showWeatherData(data) {
  return `
    <h3>Current Weather: ${data.weather[0].main}</h3>
    <h3>Description: ${data.weather[0].description}</h3>
    <h3>Tempurature: ${data.main.temp} °C</h3>
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
    <h3>${result.venue.name}</h3><p>${result.venue.url}</p>
  `
}

$(getWeatherResults);
$(getPlacesResults);
$(autocompleteQuery);



