
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {

  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    $('#lat-val').html(lat);
    $('#lng-val').html(lng);
  });
}

    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDzS4zkJ-lF8-Z-7WNAarxNYR20X0DR-LM&libraries=places&callback=initMap"
        async defer></script>
