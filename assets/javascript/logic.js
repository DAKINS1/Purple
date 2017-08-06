$(document).ready(function() {
	$(".button-collapse").sideNav();

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

	var slideIds = ["first", "second", "third", "fourth"];
	for(var i=0; i<response.deals.length; i++) {
		var dealPic = $("<img>");
		dealPic.attr("src", response.deals[i].deal.image_url);
		var shortTitle = $("<h2>").html(response.deals[i].deal.short_title);

		var newDiv = $("<div>");
		newDiv.append(dealPic);
		newDiv.append(shortTitle);
		$("#" + slideIds[i]).append(newDiv);
	}
})

// THIS IS WHERE MY CODE STARTS WITH FIREBASE INITIATION
//initiating firebase to hold the search & location information
var config = {
	apiKey: "AIzaSyDODJ70GzuA3CF8kKG2JIyr1242t7P0qRE",
	authDomain: "foodfinder-1dd71.firebaseapp.com",
	databaseURL: "https://foodfinder-1dd71.firebaseio.com",
	projectId: "foodfinder-1dd71",
	storageBucket: "foodfinder-1dd71.appspot.com",
	messagingSenderId: "883513307329"
};
firebase.initializeApp(config);
  // Create a variable to reference the database
  var database= firebase.database();

  var location = "";


   // Whenever a user clicks the add train submit button
   $("#search-submit").on("click", function(event){

   	event.preventDefault();

   	var location = $("#location-input").val().trim();
   	console.log(location);

   	database.ref().push({
   		location: location,
   		dateAdded: firebase.database.ServerValue.TIMESTAMP
   	});

   	displayInfo(location);
     // clear text-boxes for next entry
     $("#location-input").val("");
     return false;

 });



   function displayInfo(location) {

   	var queryURL = "http://api.sqoot.com/v2/deals/?location=" + location + " &parent_slug=activities&events";
   	$.ajax({
   		url: queryURL,
   		method: "GET",
   		headers: {
   			"Authorization" : "api_key xlagn7"
   		}
   	}).done(function(response) {
   		console.log(response);
   		var results = response.deals;
   		console.log(results);
   		$(".main-content").empty();
   		$(".main-content").html("<h3>Coupons in " + location + "<h3>")

   		var couponNum = 0;
   		var couponNextNum = 1;

   		for (var i = 0; i < results.length; i++) {

			// Validate data
			if (results[couponNum]) {
				var row = $("<div class=\"row\">");
			}

			for (var j = 0; j < 3; j++) {

   				// Validate data
   				if (results[couponNum]) {

   					var coupon = results[couponNum].deal;

   					var couponDiv = $("<div class=\"col s12 m4\">");
   					var card = $("<div class=\"card\">");
   					var cardImage = $("<div class=\"card-image waves-effect waves-block waves-light\">");
   					var couponImg = $("<img class=\"activator responsive-img\">");

   					couponImg.attr("src", coupon.image_url+"?geometry=400x");
   					cardImage.append(couponImg);
   					card.append(cardImage);

   					var cardContent = $("<div class=\"card-content\">");
   					var shortTitle = coupon.short_title;
   					var cardMainTitle = $("<span class=\"card-title activator grey-text text-darken-4\">" + shortTitle + "<i class=\"material-icons right\">more_vert</i></span>");

   					cardContent.append(cardMainTitle);
   					card.append(cardContent);

   					var cardAction = $("<div class=\"card-action\">");
   					var categoryName = coupon.category_name;
   					

   					cardAction.append(categoryName);
   					card.append(cardAction);

   					var merchantName = coupon.merchant.name;
   					var categoryName = coupon.category_name;
   					var cardReveal = $("<div class=\"card-reveal\">");
   					var cardRevealTitle = $("<span class=\"card-title grey-text text-darken-4\">" + merchantName + "<i class=\"material-icons right\">close</i></span>");
   					var description = coupon.title;
   					var finePrint = $("<p class=\"truncate\">" + coupon.fine_print + "</p>"); 

   					var toggleMenuTemp = '<div class="fixed-action-btn horizontal click-to-toggle"><a class="btn-floating btn-large red"><i class="material-icons">add</i></a><ul>'
   					+ '<li><a class="btn-floating modal-trigger red map-modal" href="#modal"><i class="material-icons">place</i></a></li>' 
   					+ '<li><a class="btn-floating yellow darken-1"><i class="material-icons">link</i></a></li>'
   					+ '<li><a class="btn-floating green"><i class="material-icons">share</i></a></li>'
   					+ '<li><a class="btn-floating blue"><i class="material-icons">file_download</i></a></li>'
   					+ '</ul></div>'

   					cardReveal.append(cardRevealTitle);
   					cardReveal.append("<h5>" + description + "</h5>");
   					cardReveal.append(finePrint);
   					cardReveal.append(toggleMenuTemp);

   					card.append(cardReveal);

   					couponDiv.append(card);
   					row.append(couponDiv);

   					// Avoid repeated coupons in sequence
   					while (results[couponNum].deal.short_title === results[couponNextNum].deal.short_title) {
   						couponNum++;
   					}

   					couponNum++;
   					couponNextNum++;
   				}
   			}

   			$(".main-content").append(row);
   		}

   	});
   }

   $('.carousel.carousel-slider').carousel({fullWidth: true});



   $(".main-content").delegate("click", ".map-modal", function() {

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


	$(document).on('click', '.map-modal', function() {

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