$(document).ready(function getWeather() {
  //Don't Want To Have Images Cached for Too Long
  $.ajaxSetup({ cache: false });

  //Get Background Image from Local Storage
  /*
  var dataImage = localStorage.getItem('imgData');  
  $('html').css({
    'background': 'url(' + dataImage + ') no-repeat center center fixed',
    'background-size': 'cover'
  });*/
    $('html').css({
      'background': 'url(' +localStorage.getItem('imgData') + ') no-repeat center center fixed',
      'background-size': 'cover'
  });
  // 

  //Stored To-Do List Data is Loaded Up
  if (localStorage.getItem('toDoData')) {
    $('#todolist').html(localStorage.getItem('toDoData'));
  }
  //

  //Stored Latitude and Longitude from Local Storage
  if (localStorage.getItem('geo')) {
    var str = (localStorage.getItem('geo')).split(",");
    var lat = str[0];
    var lon = str[1];

    //Get City Name from Latitude and Longitude 
    $.getJSON("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + (localStorage.getItem('geo')).split(",")[0] + "," + (localStorage.getItem('geo')).split(",")[1] + "&sensor=true", function (place) {
      console.log(place);
      for (var i = 0; i < place.results[0].address_components.length; i++) {
        if (place.results[0].address_components[i].types[0] === "locality" || place.results[0].address_components[i].types[0] === "political" || place.results[0].address_components[i].types[0] === "sublocality") {
          var city = place.results[0].address_components[i].long_name;
          $("#city").html(city.toUpperCase());
        }
      }
    });
    //

    //Get Weather Data From Latitude and Longitude 
    var weatherapiurl = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + appid
    console.log(weatherapiurl);
    $.getJSON(weatherapiurl, function (weatherdata) {
      var tempf = Math.round(weatherdata.main.temp);
      $("#temp").html(tempf + " °F");
      var icon;
      if (weatherdata.weather[0].main == "Rain" || weatherdata.weather[0].main == "Thunderstorm" || weatherdata.weather[0].main == "Drizzle") {
        icon = "rain";
      } else if (weatherdata.weather[0].main == "Snow") {
        icon = "snow";
      } else if (weatherdata.weather[0].main == "Atmosphere") {
        icon = "fog";
      } else if (weatherdata.weather[0].main == "Clear") {
        if ((weatherdata.weather[0].icon).indexOf("n") == -1) {
          icon = "clear-day"
        } else {
          icon = "clear-night"
        }
      } else if (weatherdata.weather[0].main == "Clouds") {
        icon = "cloudy"
      } else if (weatherdata.weather[0].main == "Extreme") {
        icon = "sleet"
      } else {
        icon = "wind"
      }
      var skycons = new Skycons({ "color": "#FFFFFF" });
      skycons.set("weather-icon", icon);
      skycons.play();
    });
  } 
  //If Nothing is Stored in Local Storage, Get that Latitude and Longitude then get City/Weather upon Success
  else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
    } else {
      alert("Geolocation services are not supported by your web browser.");
    }
  }
  

  //Success Function for getting City from Geocode
  function success(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var reversegeocodingapi = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&sensor=true"
    $.getJSON(reversegeocodingapi, function (place) {
      for (var i = 0; i < place.results[0].address_components.length; i++) {
        if (place.results[0].address_components[i].types[0] === "locality" || place.results[0].address_components[i].types[0] === "political" || place.results[0].address_components[i].types[0] === "sublocality") {
          var city = place.results[0].address_components[i].long_name;
          $("#city").html(city.toUpperCase());
        }
      }
    });
    var weatherapiurl = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + appid
    console.log(weatherapiurl);
    $.getJSON(weatherapiurl, function (weatherdata) {
      console.log(weatherdata);
      var tempf = Math.round(weatherdata.main.temp);
      console.log(tempf);
      $("#temp").html(tempf + " °F");
      var icon;
      console.log(weatherdata.weather[0].main)
      if (weatherdata.weather[0].main == "Rain" || weatherdata.weather[0].main == "Thunderstorm" || weatherdata.weather[0].main == "Drizzle") {
        icon = "rain";
      } else if (weatherdata.weather[0].main == "Snow") {
        icon = "snow";
      } else if (weatherdata.weather[0].main == "Atmosphere") {
        icon = "fog";
      } else if (weatherdata.weather[0].main == "Clear") {
        if ((weatherdata.weather[0].icon).indexOf("n") == -1) {
          icon = "clear-day"
        } else {
          icon = "clear-night"
        }
      } else if (weatherdata.weather[0].main == "Clouds") {
        icon = "cloudy"
      } else if (weatherdata.weather[0].main == "Extreme") {
        icon = "sleet"
      } else {
        icon = "wind"
      }
      var skycons = new Skycons({ "color": "#FFFFFF" });
      skycons.set("weather-icon", icon);
      skycons.play();
    });
  }
  function error() {
    alert("You are probably not connected to the internet.");
  }
  //


  $('form').submit(function (e) {
    e.preventDefault();
    var storedValue = $('.form-control').val();
    var completed = '<span class="check"></span>';
    var remove = '<span class="remove"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-264.1 348.6 58.3 74.1" enable-background="new -264.1 348.6 58.3 74.1"><path d="M-210.9 353.6h-18.7v-5h-10.7v5H-259v6.7h48.1zM-210.9 364h-53.2v6.7h5.5l3.3 52h40.8l3.3-52h5.5V364h-5.2zm-38.1 51.9l-2.8-45.2h6l.9 45.2h-4.1zm16.1 0h-4.1l-.9-45.2h6l-1 45.2zm12 0h-4.1l.9-45.2h6l-2.8 45.2z" fill="#fff"/></svg></span>';

    if (storedValue !== '') {
      $('ul').append('<li class="animated bounceInLeft ">' + completed + storedValue + remove + '</li>')
      $('input').val('');
      $('li').removeClass("animated bounceInLeft")
      localStorage.setItem('toDoData', $('#todolist').html());
    };
  });

  $('ul').on('click', 'li', function () {
    $(this).toggleClass('fadeOut');
    $(this).find('.check').addClass('check-checked');
    localStorage.setItem('toDoData', $('#todolist').html());
  });

  $('ul').on('click', '.remove', function () {
    $(this).parent().addClass('bounceOutLeft').fadeOut();
    $(".bounceOutLeft").remove();
    localStorage.setItem('toDoData', $('#todolist').html());
  });

  //Quote Adding
  var quo = (localStorage.getItem('q')).split("[/]");
  $("footer").html("<p>" + quo[0] + "</p>" + "<p> — " + quo[1] + "</p>")
  //

  //Quick Link Menu
  $(".menu-link").click(function (e) {
    e.preventDefault();
    $(".menu").toggleClass("open");
    $(".menu-overlay").toggleClass("open");
  });
  
  //
  $('#work').on("click", function() {
    var go_to_url = "https://www.google.com/search?q="+$("#city").text()+"+"+"weather";
    var win = window.open(go_to_url, '_blank');
  });


});
