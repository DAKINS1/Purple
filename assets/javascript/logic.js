$(document).ready(function() {
	$(".button-collapse").sideNav();

	$('.carousel.carousel-slider').carousel({fullWidth: true});

// Deal of the day to be displayed on page load
var startPanelImages = [];

var queryURL = "https://api.sqoot.com/v2/deals/?online=true&per_page=4";

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
		dealPic.addClass("deal-link");
		dealPic.attr("src", response.deals[i].deal.image_url);
		var shortTitle = $("<h2>").html(response.deals[i].deal.short_title);

		

		var newDiv = $("<div>");
		newDiv.append(dealPic);
		newDiv.append(shortTitle);
		$("#" + slideIds[i]).append(newDiv).wrap($("<a/>").attr("href", response.deals[i].deal.untracked_url));

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
  var searchRef = database.ref('/searchQuery');
  var cardsRef = database.ref('/cards');

  var location = "";


   // Whenever a user clicks the add train submit button
   $("#search-submit").on("click", function(event){

   	event.preventDefault();

   	//display pagination
   	$('.pagination').removeClass('hidden');

   	var location = $("#location-input").val().trim();
   	console.log(location);
   	var query = $("#search-input").val().trim();
   	console.log(query);

   	searchRef.push({
   		location: location,
   		query: query,
   		dateAdded: firebase.database.ServerValue.TIMESTAMP
   	});

   	displayInfo(location, query);
     // clear text-boxes for next entry
     $("#location-input").val("");
     $("#search-input").val("");
     return false;

  });


   function displayInfo(location, query, category) {

   	var queryURL = "https://api.sqoot.com/v2/deals/";

   	if (category === undefined){
   		//when query input is empty, but not location input
	   	if (query === "" && location !== "") {
	   		queryURL += '?location=' + location;
	   	}

	   	//when query input is not empty, but location is empty
	   	//w/o location, search for online deals
	   	if (query !== "" && location === "") {
	   		queryURL += '?query=' + query + '&online=true';
	   	}

	   	//when both input is entered
	   	if (query !== "" && location !== "") {
	   		queryURL += '?query=' + query + '&location=' + location;
	   	}

   	} else {

   		// If user allow geolocation, use it for searching category
   		if (Gmap.isCurrentLocation){
   			queryURL += '?category_slugs=' + category + '&location=' + location;

   			//If user blocks geolocation, search for online deals.
   		} else {
   			queryURL += '?category_slugs=' + category + '&online=true';
   		}

   	}

   	$.ajax({
   		url: queryURL,
   		method: "GET",
   		headers: {
   			"Authorization" : "api_key xlagn7"
   		}
   	}).done(function(response) {

   		var results = response.deals;
   		console.log(results);

   		// Remove duplicates coupons
   		var seenCoupons = {};
   		results = results.filter(function(currentObject) {
   			if (currentObject.deal.short_title in seenCoupons) {
   				return false;
   			} else {
   				seenCoupons[currentObject.deal.short_title] = true;
   				return true;
   			}
   		});

   		$(".main-content").empty();
   		$(".main-content").html("<h3>Coupons for " + query + " in " + location + "<h3>")

   		var couponNum = 0;

   		for (var i = 0; i < results.length; i++) {

   			// Validate Data
   			if (results[i].deal.merchant.latitude){
   				// get lat,lng from each deals and push into Squpon.dealsLocation array;
   				Gmap.dealsLocation.push({'lat': results[i].deal.merchant.latitude, 'lng': results[i].deal.merchant.longitude});

   			}

			// Validate data
			if (results[couponNum]) {
				var row = $("<div class=\"row\">");
			}

			for (var j = 0; j < 3; j++) {

   				// Validate data
   				if (results[couponNum]) {

   					var coupon = results[couponNum].deal;

   					var couponDiv = $("<div class=\"col s12 m4 card-div\">");
   					var card = $("<div class=\"card sticky-action hoverable\" id=\"card-" + couponNum + "\">");
   					var cardImage = $("<div class=\"card-image\">");
   					var couponImg = $("<img class=\"activator responsive-img\">");
   					var couponPrice = coupon.price;
   					var price = $("<span class=\"card-title coupon-price right-align\">").append("$" + couponPrice);
   					var moreInfoBtn = "<a class=\"btn-floating halfway-fab waves-effect waves-light activator purple\"><i class=\"material-icons\">more_vert</i></a>";

   					couponImg.attr("src", coupon.image_url);
   					cardImage.append(couponImg);
   					cardImage.append(moreInfoBtn);
   					cardImage.append(price);
   					card.append(cardImage);   					

   					var cardContent = $("<div class=\"card-content\">");
   					var shortTitle = coupon.short_title;
   					var merchantName = coupon.merchant.name;
   					
   					var cardMainTitle = $("<span class=\"card-title activator grey-text text-darken-4\">" + shortTitle + "</span>");

   					cardContent.append(cardMainTitle);
   					cardContent.append("<p>" + merchantName + "</p>");
   					card.append(cardContent);


   					var cardAction = $("<div class=\"card-action center-align\">");
   					var scoopBtn = $("<a href=\"#modal\" class=\"waves-effect waves-teal btn deep-purple modal-trigger map-modal\"><i class=\"material-icons left\">play_for_work</i>Scoop</a>");
   					var categoryName = coupon.category_name;

   					cardAction.append(scoopBtn);
   					card.append(cardAction);

   					var categoryName = coupon.category_name;
   					var cardReveal = $("<div class=\"card-reveal\">");
   					var cardRevealTitle = $("<span class=\"card-title grey-text text-darken-4\">" + merchantName + "<i class=\"material-icons right\">close</i></span>");
   					var description = coupon.title;
   					var finePrint = $("<p>" + coupon.fine_print + "</p>"); 

   					// var toggleMenuTemp = '<div class="fixed-action-btn horizontal click-to-toggle"><a class="btn-floating btn-large red"><i class="material-icons">add</i></a><ul>'
   					// + '<li><a class="btn-floating modal-trigger red map-modal" href="#modal"><i class="material-icons">place</i></a></li>' 
   					// + '<li><a class="btn-floating yellow darken-1"><i class="material-icons">link</i></a></li>'
   					// + '<li><a class="btn-floating green"><i class="material-icons">share</i></a></li>'
   					// + '<li><a class="btn-floating blue"><i class="material-icons">file_download</i></a></li>'
   					// + '</ul></div>'

   					cardReveal.append(cardRevealTitle);
   					cardReveal.append("<h5>" + description + "</h5>");
   					cardReveal.append(finePrint);
   					//cardReveal.append(toggleMenuTemp);

   					card.append(cardReveal);

   					couponDiv.append(card);
   					row.append(couponDiv);

   					var couponURL = coupon.untracked_url


   					//store card info in JSON object
   					var dataCard = {
   						'shortTitle': shortTitle,
   						'description': description,
   						'url': couponURL
   					}

   					couponDiv.attr('data-card', JSON.stringify(dataCard));


   					// Write card data into firebase.
   					database.ref('cards/' + couponNum).set({
   						cardNum: couponNum,
   						merchantName: merchantName,
   						description: description,
   						url: couponURL
   					})

   					couponNum++;
   				}
   			}

   			$(".main-content").append(row);
   		}
   		console.log("======== Gmap latlng object ===========");
   		console.log(Gmap.dealsLocation);
   	});
}


});
// Squpon Object.

var Squpon = {

	currentLocation: "",

	dealsLocation: [],

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

	isCurrentLocation: false,

	currentLocation: "",

	// store latlng object from each deals
	dealsLocation: [],

	gmap: {},

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
	            	Gmap.currentLocation = results[0].formatted_address;

	                //fill the inputbox
	                $('#location-input').val(Squpon.currentLocation);

	                Gmap.isCurrentLocation = true;

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

	 initMap: function () {

	 	console.log("initMap function");

	 	console.log(Gmap.dealsLocation[0]);

	 	var myLatLng = Gmap.dealsLocation[0];

	 	var map = new google.maps.Map(document.getElementById('map'), {
	 		zoom: 11,
	 		center: myLatLng
	 	});

		// Save map object to recall later
		Gmap.gmap = map;

		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: 'deal location'
		})

	},

	// It specifies a function to run if it fails to get the user's location
	showError: function (error) {

		switch(error.code) {
			case error.PERMISSION_DENIED:
				console.log("User denied the request for Geolocation.");
			break;
			case error.POSITION_UNAVAILABLE:
				console.log("Location information is unavailable.");
			break;
			case error.TIMEOUT:
				console.log("The request to get user location timed out.");
			break;
			case error.UNKNOWN_ERROR:
				console.log("An unknown error occurred.");
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

	var queryURL = "https://api.sqoot.com/v2/deals/?online=true&per_page=4";
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

	$(".main-content").delegate('.map-modal', 'click', function() {
		console.log("test");

		//grab cardData from its parent div.
		//data will be automatically converted to JSON object
		var cardData = $(this).closest("div[data-card]").data('card');

		$(".modal-content").empty();

		// Fill modal contents
		var title = $("<h4 class='modal-content-title'>" + cardData['shortTitle'] + "</h4>");
		var row = $("<div class=\"row\">");
		var colLeft = $("<div class=\"col s12 m6 map-container\">");
		// var map = $("<img src=\"assets/images/map.png\" class=\"responsive-img\">");
		var map = $('<div>');
		var colRight = $("<div class=\"col s12 m6\">");
		var text = "<p class='modal-content-description'>" + cardData['description'] +"</p>";
		var link = $("<a class=\"modal-action waves-effect waves-green btn-large\">");

		link.attr("href", cardData['url']);
		link.attr('target','_blank');
		link.text("GO!")

		map.attr('id', 'map');
		colLeft.append(map);
		// colLeft.append(map);

		colRight.append(text);
		colRight.append(link);

		row.append(colLeft);
		row.append(colRight);


		$(".modal-content").append(title);
		$(".modal-content").append(row);


		// Modal Triggers here
		$('.modal').modal({

			// Callback for modal open
			// When modal is opened, load google map
			ready: function(modal, trigger){
				
				google.maps.event.addDomListener(window, 'load', Gmap.initMap);

				// Center google map on brower resize
				google.maps.event.addDomListener(window, 'resize', function () {

					// grab current map object
					var map = Gmap.gmap;
					var center = map.getCenter();
					google.maps.event.trigger(map, "resize");
					map.setCenter(center); 
				})

				// Load map
				Gmap.initMap();
			}
		});

		
	})

	// $('.modal').modal();
});
