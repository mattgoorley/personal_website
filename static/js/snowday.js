$(document).ready(function() {
    // Autocomplete Address Search
    google.maps.event.addDomListener(window, 'load', initAutocomplete);
    function initAutocomplete() {
        var card = document.getElementById('pac-card');
        var input = document.getElementById('pac-input');

        var defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng('40.612597','74.147848'),
          new google.maps.LatLng('40.871894','73.822983'));
        var options = {
          "bounds": defaultBounds,
        }

        var autocomplete = new google.maps.places.Autocomplete(input, options);

        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();
            wrapper.lat = lat;
            wrapper.lng = lng;
        });
    }

    // Wrappers for url creation
    var wrapper = {
        venueSearch: "https://api.foursquare.com/v2/venues/search?",
        venueUnique: "https://api.foursquare.com/v2/venues/",
        lat : "41.399856",
        lng : "2.158286999999973",
        clientId: "client_id=XVODQ5S2KJJ0BORRXJLTGKOIFMYOLCW0YHABIFKFQPQTINRU",
        clientSecret: "client_secret=FI1YNOKL5YPEMOK3ITQS5U3DRBWWJNMIWMO05WJVTAATUOF2",
        radius: "radius=100",
    }
    var categories = {
        cat : "categoryId=",
        food: "4d4b7105d754a06374d81259",
        nightlife: "4d4b7105d754a06376d81259",
        convenience : "4d954b0ea243a5684a65b473",
        drugstore: "5745c2e4498e11e7bccabdbd",
        foodDrinkShop: "4bf58dd8d48988d1f9941735"
    }

    // submit button action for category search
    $('#cat-selector').submit( function() {
        $('.container-results div').empty();
        cat = "categoryId=";
        getCategories()
        var myUrl = urlAssembler(cat)
        searchVenues(myUrl)
        return false
    });
    // Category builder
    var getCategories = function() {
        if ($('#changetype-food').prop("checked")) {
            cat += (categories.food + "&")
        };
        if ($('#changetype-nightlife').prop("checked")) {
            cat += (categories.nightlife + "&")
        };
        if ($('#changetype-convenience').prop("checked")) {
            cat += (categories.convenience + "&")
        };
        if ($('#changetype-drugstore').prop("checked")) {
            cat += (categories.drugstore + "&")
        };
        if ($('#changetype-shops').prop("checked")) {
            cat += (categories.foodDrinkShop + "&")
        };
    };
    // URL Assembler
    var urlAssembler = function(cat) {
        myUrl = wrapper.venueSearch + "ll=" + wrapper.lat + "," + wrapper.lng + "&" + wrapper.clientId + "&" + wrapper.clientSecret + "&v=20170101"
            + "&" + cat + wrapper.radius
        return myUrl
    }

    var getVenue = function(id) {
        var tag = '#' + id
        venueUrl = wrapper.venueUnique + id + '/photos?'+ wrapper.clientId + "&" + wrapper.clientSecret + '&v=20170101'
        $.ajax({
            method: "GET",
            url: venueUrl,
            datatype: "json",
            success: function(response){
                if (response.response.photos.items.length > 0) {
                var imgPrefix = response.response.photos.items[0].prefix
                var imgSuffix = response.response.photos.items[0].suffix
                var img = imgPrefix + "250x250" + imgSuffix
                console.log(img)
                $(tag).attr('src', img)
                }
                else {
                    var img = "https://lh3.googleusercontent.com/81tvpT59weJbOGWT9jQ8_9RtcGXKCcVv59BU7Wl6PnS7okIgrS4iTCgwWpPQY2FRKw=w300"
                    $(tag).attr('src', img)
                }
            }
        })
    }


    // Ajax call to Foursquare API
    var searchVenues = function (myUrl) {
        var idArray = []
        $.ajax({
            method: "GET",
            url: myUrl,
            datatype: "json",
            success: function(response){
                len = response.response.venues.length;
                if (len == 0) {
                    var template = $('#no-results').html();
                    var display = {'result': 'No results for your search, please try something else!'};
                    Mustache.parse(template, ["<%","%>"])
                    $(".container-results").append(Mustache.render(template, display))
                }
                for(var i=0; i < len; i++) {
                    var name = response.response.venues[i].name;
                    var address = response.response.venues[i].location.address;
                    var phone = response.response.venues[i].contact.formattedPhone;
                    var url = response.response.venues[i].url;
                    var id = response.response.venues[i].id;
                    getVenue(id);
                    var template = $('#venue-slides').html();
                    var display = {'name':name,'address':address,'phone':phone,'url':url,'id':id}
                    Mustache.parse(template, ["<%","%>"])
                    $(".container-results").append(Mustache.render(template, display))
                }
            }
        })
    };


});


