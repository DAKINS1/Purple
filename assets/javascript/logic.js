
// Squpon Object.

var Squpon = {

	currentLocation: "",

	locationInput: "",

	queryInput: "",

	// ajax call function with callback function so that you can handle response from ajax request on function call.
	getJSON: function ( url, callback ) {

		$.ajax({

			method: 'GET',
			url: url,
			headers: {
				'Authorization': 'api_key xlagn7'
			}

		}).done( function (response) {

			console.log('getJSON() success!');
			console.log(response);
			
			if( typeof callback === 'function') {
				callback(response);
			}
		});

	}
}

//Google Map Object.
var Gmap = {

	current_location_loaded: false,

	getLocation: function () {

		//Check if Geolocation is supported
		//If supported, run the getCurrentPosition() method. If not, display a message to the user
		if (navigator.geolocation) {

			//If the getCurrentPosition() method is successful, it returns a coordinates object to the function specified in the parameter (showPosition), second parameter is for displaying error
			navigator.geolocation.getCurrentPosition(this.getAddress, this.showError);

		} else {

			alert("Geolocation is not supported by this browser.");

		}

	},

	// This function outputs the Latitude and Longitude
	getAddress: function (position) {

		console.log(position);
	    // var latlon = position.coords.latitude + "," + position.coords.longitude;

	    // var img_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=14&size=400x300&sensor=false&key=AIzaSyBu-916DdpKAjTmJNIgngS6HL_kDIKU0aU";

	    // document.getElementById("map-holder").innerHTML = "<img src='"+img_url+"'>";

	    Gmap.coordinates_to_address(position.coords.latitude, position.coords.longitude)

	},

	coordinates_to_address: function (lat, lng) {

		var geocoder= new google.maps.Geocoder();
	    var latlng = new google.maps.LatLng(lat, lng);

	    geocoder.geocode({'latLng': latlng}, function(results, status) {
	        if(status == google.maps.GeocoderStatus.OK) {
	            if(results[0]) {

	            	//update current location variable.
	                Squpon.currentLocation = results[0].formatted_address;

	                //fill the inputbox
	                $('#location-input').val(Squpon.currentLocation);

	            } else {
	                alert('No results found');
	            }
	        } else {
	            var error = {
	                'ZERO_RESULTS': 'no adress'
	            }

	            alert('Geocoder failed due to: ' + error[status]);
	            // $('#address_new').html('<span class="color-red">' + error[status] + '</span>');
	        }
	    });
	},

	// It specifies a function to run if it fails to get the user's location
	showError: function (error) {

	    switch(error.code) {
	        case error.PERMISSION_DENIED:
	            x.innerHTML = "User denied the request for Geolocation."
	            break;
	        case error.POSITION_UNAVAILABLE:
	            x.innerHTML = "Location information is unavailable."
	            break;
	        case error.TIMEOUT:
	            x.innerHTML = "The request to get user location timed out."
	            break;
	        case error.UNKNOWN_ERROR:
	            x.innerHTML = "An unknown error occurred."
	            break;
	    }
	}
}




$(document).ready(function() {
	$(".button-collapse").sideNav();

	// Get current location, and fill the location input with current location.
	Gmap.getLocation();

	// Deal of the day to be displayed on page load
	var startPanelImages = [];

	var queryURL = "http://api.sqoot.com/v2/deals/?online=true&per_page=4";
		$.ajax({
			url: queryURL,
			method: "GET",
			headers: {
	      		"Authorization" : "api_key xlagn7" 
	      }
		}).done(function(response){
			console.log(response);

			for(var i=0; i<response.deals.length; i++) {
				var dealPic = $("<img>");
				dealPic.attr("src", response.deals[i].deal.image_url);
				var shortTitle = $("<h2>").html(response.deals[i].deal.short_title);
				
				$("#first").append(dealPic);
				$("#firstText").append(shortTitle);
				


			}
		})

	$('.carousel.carousel-slider').carousel({fullWidth: true});



	$(".map-modal").on("click", function() {

		$(".modal-content").empty();

		var title = $("<h4>" + "Dummy Title" + "</h4>");
		var row = $("<div class=\"row\">");
		var colLeft = $("<div class=\"col s12 m6\">");
		var map = $("<img src=\"assets/images/map.png\" class=\"responsive-img\">");
		var colRight = $("<div class=\"col s12 m6\">");
		var text = "<p>Dummy Description</p>";
		var link = $("<a class=\"modal-action waves-effect waves-green btn-large\">");
		link.attr("href", "#DummyLink");
		link.text("GO!")
		colLeft.append(map);

		colRight.append(text);
		colRight.append(link);

		row.append(colLeft);
		row.append(colRight);


		$(".modal-content").append(title);
		$(".modal-content").append(row);

		$('.modal').modal();
	})


	
	// $('.modal').modal();
});