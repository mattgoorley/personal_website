$(document).ready(function() {

    var wrapper = {
        explore : "https://api.foursquare.com/v2/venues/explore?",
        lat : "40.7",
        lng : "-74",
        version : "&v=20170214",
        price : '1,2,3,4',
        section : '',
        query : '',
        venuePhotos : '1',
        openNow : '1',
        sortByDistance : '1',
        radius : '5000',
        limit : '',
        offset : 0,
        zOffset : 500
    };


    // get location
    google.maps.event.addDomListener(window, 'load', initAutocomplete);
    function initAutocomplete() {
        var card = document.getElementById('pac-card');
        var input = document.getElementById('pac-input');


        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();
            wrapper.lat = lat;
            wrapper.lng = lng;
        });
    };

    // get user info on load up
    var getUser = function() {
        $.ajax({
            method: 'GET',
            url: 'https://api.foursquare.com/v2/users/self?oauth_token=' + oauth_token + '&v=20170213',
            datatype: 'json',
            success: function(response) {
                var user = response.response.user
                var name = user.firstName + " " + user.lastName
                $('.jumbotron > h1').html('Hi ' + name)
                var photo = user.photo.prefix + "64x64" + user.photo.suffix
                $('#user-photo').attr('src', photo)

            }
        })
    }

    getUser()
    // dropdown filters
var priceOptions = [];

$( '#price a' ).on( 'click', function( event ) {

    var $target = $( event.currentTarget ),
        val = $target.attr( 'data-value' ),
        $inp = $target.find( 'input' ),
        idx;

    if ( ( idx = priceOptions.indexOf( val ) ) > -1 ) {
        priceOptions.splice( idx, 1 );
        setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
    } else {
        priceOptions.push( val );
        setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
    }

    $( event.target ).blur();

    return false;
});

$( '#cats a' ).on( 'click', function( event ) {
    catsOptions = []
    var $target = $( event.currentTarget ),
        val = $target.attr( 'data-value' ),
        $inp = $target.find( 'input' );

    $( '#cats input' ).prop('checked', false);
    catsOptions.pop()
    $inp.prop('checked', true);
    catsOptions.push( val );

    $( event.target ).blur();

    wrapper.section = catsOptions.join()

    return false;
});

// get explore results
    var explore = function (url) {
        $.ajax({
            method: 'GET',
            url: url,
            datatype: 'json',
            success: function(response) {
                var defaults = {price:'N/A', menu:false, url: false ,phone:'N/A',photo:'http://conference.cla-net.org/2015/wp-content/uploads/2015/05/sunday-funday-300x195.jpg'}
                var items = response.response.groups[0].items
                len = items.length;

                for(var i=0; i < len; i++) {
                    var venueItem = items[i].venue;
                    var venue = {
                        name: venueItem.name,
                        url: venueItem.url,
                        rating: venueItem.rating,
                        price: (venueItem.price ? venueItem.price.message:defaults.price),
                        phone: (venueItem.contact.formattedPhone ? venueItem.contact.formattedPhone:defaults.phone),
                        category: venueItem.categories[0].shortName,
                        address: venueItem.location.address,
                        city: venueItem.location.city,
                        distance: venueItem.location.distance,
                        menu: (venueItem.menu ? venueItem.menu.mobileUrl:defaults.menu),
                        photo: (venueItem.photos.groups[0] ? (venueItem.photos.groups[0].items[0].prefix + '300x300' + venueItem.photos.groups[0].items[0].suffix):defaults.photo),
                        pane : wrapper.zOffset - i
                    };
                    var template = $('#venue-cards').html();
                    var display = {'name':venue.name,'url':venue.url,'rating':venue.rating,'price':venue.price,'phone':venue.phone,'category':venue.category,'address':venue.address,'distance':venue.distance,'menu':venue.menu,'photo':venue.photo,'pane':venue.pane};
                    Mustache.parse(template,["<%","%>"]);
                    $(".content").append(Mustache.render(template,display))

                }
            }

        })
    }

// build URL

    var urlBuilder = function() {
        console.log(wrapper.offset)
        var foursquareUrl = wrapper.explore + 'll=' + wrapper.lat + "," +  wrapper.lng + '&venuePhotos=1' + '&oauth_token=' + oauth_token + '&offset=' + wrapper.offset.toString() + wrapper.version
        if (priceOptions.length > 0) { foursquareUrl += '&price=' + priceOptions.join() }
        if (wrapper.section.length > 1) { foursquareUrl += '&section=' + wrapper.section }
        console.log(foursquareUrl)
        wrapper.offset += 1
        console.log(wrapper.offset)
        return foursquareUrl
    }

// submit btn
    $('#submit-button').on( 'click', function(event) {
        $('.content').empty()
        $('.marketing').empty()
        var url = urlBuilder()
        explore(url)
        addNextButton()
    })


    var addNextButton = function() {
        var template = $('#next-btn').html()
        $('.marketing').append(Mustache.render(template))
        $(document).on('click', '#next-button', function() {
            var listElement = $('.content').children(':first')
            listElement.remove()
            if ( $('.content').children().length == 0 ) {
                var url = urlBuilder()
                explore(url)
            }
        })
    }

})


