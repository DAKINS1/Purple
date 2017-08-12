// ******************************************************************

// 						Squpon Object

// *******************************************************************
var Squpon = {

	currentLocation: "",

	dealsLocation: [],

	queryLocation: "",

	queryQuery: "",

	queryCategory: "",

	pageNumber: 1,

	dealsFormattedAddress: [],

	ipLocation: "",

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
	},

	displayObject: function () {
		console.log('----------- queryLocation ---------')
		console.log(this.queryLocation);
		console.log('----------- queryQuery ---------')
		console.log(this.queryQuery);
		console.log('----------- queryCatagory ---------')
		console.log(this.queryCategory);
	}
}

var placeSearch, autocomplete;

var componentForm = {
	street_number: 'short_name',
	route: 'long_name',
	locality: 'long_name',
	administrative_area_level_1: 'short_name',
	country: 'long_name',
	postal_code: 'short_name'
};


// ******************************************************************

// 						Google Map Object

// *******************************************************************

var Gmap = {

	isCurrentLocation: false,

	currentLocation: "",

	// store latlng object from each deals
	dealsLocation: [],

	gmap: {},

	place: "",

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

	initMap: function ( mapData, addressData ) {

		var myLatLng = mapData;
		var address = addressData.address;

		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: myLatLng
		});

		// Save map object to recall later
		Gmap.gmap = map;

		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			animation: google.maps.Animation.DROP,
			title: 'deal location'
		})
		var infowindow = new google.maps.InfoWindow({
			content: ("<p>" + address + "<p>")
		});

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
		});

	},

	initAutoComplete: function () {

		// Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete((document.getElementById('location-input')),{types: ['geocode']});

		// When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', this.fillInAddress);
    },

    fillInAddress: function () {
		// Get the place details from the autocomplete object.
		var userPlace = autocomplete.getPlace();

		if (!userPlace.geometry) {
			return;
		}
		Gmap.place = autocomplete.getPlace();
		Squpon.queryLocation = autocomplete.getPlace().formatted_address;
		Gmap.currentLocation = autocomplete.getPlace().formatted_address;
		Gmap.isCurrentLocation = true;
		// else {
		// 	//formatted_address
		// 	$("#location-input").val(place.formatted_address);
		// }

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

// because google api is loaded asynchronously..
// use callback to wait unitl api is fully loaded.

init = {}

init.autocomplete = function () {
	Gmap.initAutoComplete();
}

// Changes title animation

function changeTitle() {

	var scoopThings = ['COUPONS', 'DEALS', 'DISCOUNTS', 'SAVINGS', 'THINGS'];
	var index = 0;

	var $change = $('#change')

	setInterval(function () {

		index++;

		$change.fadeOut(400, function () {
			$(this).text(scoopThings[index % scoopThings.length]).fadeIn(400);
		});
	}, 3000);
}  

// Generates Coupon Cards and returns div

var generateCards = function(id, object, isFirebase) {
	var couponDiv = $("<div class=\"col s12 m4 card-div\">");
	var card = $("<div class=\"card large sticky-action hoverable\" id=\"card-" + id + "\">");
	var moreInfoBtn = "<a class=\"btn-floating halfway-fab waves-effect waves-light activator purple\"><i class=\"material-icons\">more_vert</i></a>";
	var cardImage = $("<div class=\"card-image waves-effect waves-block waves-light\">");
	var couponImg = $("<img class=\"activator img-fit\">");
	var price = $("<span class=\"card-title coupon-price right-align\">").append("$" + object.price);

	couponImg.attr("src", object.image_url);
	cardImage.append(couponImg);
	cardImage.append(price);
	card.append(moreInfoBtn);
	card.append(cardImage);

	var cardContent = $("<div class=\"card-content\">");
	var cardMainTitle = $("<span class=\"card-title activator grey-text text-darken-4\">" + object.short_title + "</span>");

	cardContent.append(cardMainTitle);
	cardContent.append("<p>" + object.merchant.name + "</p>");
	card.append(cardContent);

	var cardAction = $("<div class=\"card-action center-align\">");
	var scoopBtn = $("<a href=\"#modal\" class=\"\">Scoop</a>");
	scoopBtn.attr("href", "#modal");

	if (isFirebase) {
		scoopBtn.addClass("scoop-btn");
   		// Add random animation to couponDiv
   		var animatedArray = ['animated bounceInUp', 'animated bounceInLeft', 'animated bounceInRight'];
   		var randNum = Math.floor((Math.random() * 4) + 0);
   		couponDiv.addClass(animatedArray[randNum]);
   	}

   	scoopBtn.addClass("waves-effect waves-purple btn deep-purple modal-trigger map-modal");
   	scoopBtn.html("<i class=\"material-icons left\">play_for_work</i>Scoop");

   	cardAction.append(scoopBtn);
   	card.append(cardAction);

   	var cardReveal = $("<div class=\"card-reveal\">");
   	var cardRevealTitle = $("<span class=\"card-title grey-text text-darken-4\">" + object.merchant.name + "<i class=\"material-icons right\">close</i></span>");
   	var finePrint = $("<p>" + object.fine_print + "</p>");

   	cardReveal.append(cardRevealTitle);
   	cardReveal.append("<h5>" + object.title + "</h5>");
   	cardReveal.append(finePrint);

   	card.append(cardReveal);

   	couponDiv.append(card);

    //store card info in JSON object
    var dataCard = {
    	'cardNum': id,
    	'shortTitle': object.short_title,
    	'description': object.title,
    	'url': object.untracked_url,
    	'address': object.merchant.address,
    	'id' : object.id,
    	'merchant' : object.merchant.name
    }

    // store map info in JSON object
    var latlng = {
    	'lat': object.merchant.latitude,
    	'lng': object.merchant.longitude
    };

    var formatted = {
    	'address': object.merchant.address
    }

    couponDiv.attr('data-card', JSON.stringify(dataCard));
    couponDiv.attr('data-map', JSON.stringify(latlng));
    couponDiv.attr('data-address', JSON.stringify(formatted));

    return couponDiv;
}


// ******************************************************************

// 						 DisplayInfo

// *******************************************************************


var displayInfo = function(location, query, category, page) {

	var queryURL = "https://api.sqoot.com/v2/deals/";

	if (category === ""){

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
   		queryURL += '?category_slugs=' + category + '&location=' + Squpon.querryLocation;
   	}

   }

   if ( page === "") {

   	queryURL += '&page=1' + '&per_page=9';

   } else {

   	queryURL += '&page=' + page + '&per_page=9';

   }

   $.ajax({
   	url: queryURL,
   	method: "GET",
   	headers: { "Authorization" : "api_key xlagn7" }
   }).done(function(response) {

   	var results = response.deals;

   	if(results.length === 0) {
   		$("#results").modal();
   		$("#results").modal("open");
   		return true;
   	}

   	$(".main-content").empty();
   	$(".firebase-content").empty();	
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

   	if (query && location) {

   		$(".main-content").append("<h3 class='main-content-header'>Deals for " + "<span class='query-uppercase'>" + query + "</span>"+ " in " + location + "<h3>");

   	} else if (!query && location){

   		$(".main-content").append("<h3 class='main-content-header'>Deals in " + location + "<h3>");

   	} else if (query && !location){

   		$(".main-content").append("<h3 class='main-content-header'>" + query + " near you<h3>");

   	} else {
   		$(".main-content").append("<h3 class='main-content-header'>Deals near you<h3>");
   	}


   	var couponNum = 0;

   		// Clean location array before pushing new location
   		Gmap.dealsLocation = [];

   		// Validate data
   		if (results[couponNum]) {
   			var row = $("<div class=\"row card-display\">");

   			for (var i = 0; i < results.length; i++) {

	   			// Validate Data
	   			if (results[i].deal.merchant.latitude){
	   				// get lat,lng from each deals and push into Squpon.dealsLocation array;
	   				Gmap.dealsLocation.push({'lat': results[i].deal.merchant.latitude, 'lng': results[i].deal.merchant.longitude});
	   			}

	   			// Validate data
	   			if (results[couponNum]) {

	   				var coupon = results[couponNum].deal;

	   				row.append(generateCards(couponNum, coupon, true));

	   				couponNum++;
	   			}

	   			$(".main-content").append(row);

				//display pagination
				$('.pagination').removeClass('hidden');
			}
		}
	});
}

var firebaseCards = function(id) {

	var queryURL = "https://api.sqoot.com/v2/deals/" + id;

	$.ajax({
		url: queryURL,
		method: "GET",
		headers: {"Authorization" : "api_key xlagn7"}
	}).done(function(response) {

		var coupon = response.deal;
		var couponNum = id;

         // Validate Data
         if (coupon.merchant.latitude) {
            // get lat,lng from each deals and push into Squpon.dealsLocation array;
            Gmap.dealsLocation.push({'lat': coupon.merchant.latitude, 'lng': coupon.merchant.longitude});
        }

         // Validate data
         if (coupon) {
            // generateCards(couponNum, coupon, false);
            $(".firebase-content").children().prepend(generateCards(couponNum, coupon, false)[0]);   					
        }

    });

}

// Populate front page with coupons by location from IP address
var ipLocation = function() {
	queryURL = "https://freegeoip.net/json/";

	$.ajax({
		url : queryURL,
		method : "GET"
	}).done(function(ip) {
		Squpon.ipLocation = ip.city;
		Squpon.queryLocation = ip.city + ", " + ip.region_code;
		displayInfo(ip.city + ", " + ip.region_code, "", "","");
	});
}

// ******************************************************************

// 				Next Arrow Event Handler

// *******************************************************************

function next(event) {

	event.preventDefault();

	// Clean contents before appending.
	$('h3.main-content-header').remove();
	$('div.card-display').remove();

	// Grab location, query, category for searching
	var location = Squpon.queryLocation;
	var query = Squpon.queryQuery;
	var category = Squpon.queryCategory;

	var curr = Squpon.pageNumber + 1;
	var prev = curr -1;

	var $prevPage = $('.pagination').find('a[data-page=' + prev + ']');
	var $currPage = $('.pagination').find('a[data-page='+ curr +']');

	console.log("page:  " + curr);

	// When curr number reaches 5, disable next arrow
	if ( curr === 5 ) {

		// fade out arrow
		$(this).closest('li').removeClass('waves-effect').addClass('disabled');

		// unbind click handler.
		$(this).off('click');

		// change active class
		$prevPage.closest('li').removeClass('active').addClass('waves-effect');
		$currPage.closest('li').removeClass('waves-effect').addClass('active');

		Squpon.pageNumber++;
		displayInfo(location, query, category, curr);

	} else {

		// Enable click effect on previous arrow
		if ( curr === 2 ) {

			$('#previous').closest('li').removeClass('disabled').addClass('waves-effect');
			$('#previous').off('click');
			$('#previous').on('click', previous);

		}

		$prevPage.closest('li').removeClass('active').addClass('waves-effect');
		$currPage.closest('li').removeClass('waves-effect').addClass('active');

		Squpon.pageNumber++;
		displayInfo(location, query, category, curr);

	}

	console.log('Squpon.pageNumber:    ' + Squpon.pageNumber);
}

// ******************************************************************

// 				Previous Arrow Event Handler

// *******************************************************************

function previous(event) {

	event.preventDefault();

	// Grab location, query, category for searching
	var location = Squpon.queryLocation;
	var query = Squpon.queryQuery;
	var category = Squpon.queryCategory;

	var curr = Squpon.pageNumber - 1;
	var prev = curr + 1;

	var $prevPage = $('.pagination').find('a[data-page=' + prev + ']');
	var $currPage = $('.pagination').find('a[data-page='+ curr +']');

	console.log("page:    " + curr);

	// if curr = 0, nothing will happen
	if ( curr !== 0 ) {

		// Clean contents before appending.
		$('h3.main-content-header').remove();
		$('div.card-display').remove();

		// when current number reaches 1, disable previous arrow
		if ( curr === 1 ) {

			// fade out previous arrow when curr page is 1
			$(this).closest('li').removeClass('waves-effect').addClass('disabled');

			// disable click handler
			$(this).off('click');

			// change active class
			$prevPage.closest('li').removeClass('active').addClass('waves-effect');
			$currPage.closest('li').removeClass('waves-effect').addClass('active');
			Squpon.pageNumber--;
			displayInfo(location, query, category, curr);

		} else {

			// re-enable next arrow
			if ( curr === 4 ) {
				$('#next').closest('li').removeClass('disabled').addClass('waves-effect');
				$('#next').on('click', next);
			}

			$prevPage.closest('li').removeClass('active').addClass('waves-effect');
			$currPage.closest('li').removeClass('waves-effect').addClass('active');
			Squpon.pageNumber--;
			displayInfo(location, query, category, curr);
		}
	}
}


// ******************************************************************

// 						Main Function

// *******************************************************************


$(document).ready(function() {

	//change header title content in every 2 sec
	changeTitle();

	//initiate parallax
	$('.parallax').parallax();

	//menu for mobile devices
	$(".button-collapse").sideNav({
		closeOnClick: true,
		draggable: true, 
	});

	ipLocation();

	$("#search-input, #location-input").keypress(function(event){
		if (event.keyCode === 10 || event.keyCode === 13)
			event.preventDefault();
	});

	$("#location-input").on("click", function() {		
		// Get current location, and fill the location input with current location.
		Gmap.getLocation();
	});

	// ******************************************************************

	// 					Search Submit Click Handler

	// *******************************************************************

	$("#search-submit").on("click", function(event){

		event.preventDefault();
		$("#nav-mobile li").removeClass("active");

		var location = $("#location-input").val().trim();

		if (!location) {
			location = Squpon.ipLocation;
			Gmap.isCurrentLocation = false;
		}

		if (Gmap.isCurrentLocation) {
			var location = Gmap.currentLocation;
		}

		//var location = Gmap.place.formatted_address;
		var query = $("#search-input").val().trim();

		// when search btn is clicked, change page to first page.
		Squpon.pageNumber = 1;

		// update active class to display
		$('.pagination li').removeClass('active').addClass('waves-effect');
		$('.pagination').find('a[data-page=1]').closest('li').removeClass('waves-effect').addClass('active');
		$('#next').parent('li').removeClass('disabled').addClass('waves-effect');
		$('#previous').parent('li').removeClass('waves-effect').addClass('disabled');
		Squpon.queryLocation = location;
		Squpon.queryQuery = query;

		displayInfo(location, query, "", "");

		// clear text-boxes for next entry
		$("#search-input").val("");

		// Squpon.displayObject();
		return false;

	});

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

	// ******************************************************************

	// 				Categories in Navbar Click Handler

	// *******************************************************************

	$('.nav-category').on('click', function(event) {

		event.preventDefault();

		var category = $(this).data('slug');
		var location;
		if (Gmap.isCurrentLocation) {
			location = Gmap.currentLocation;
		} else {
			location = Squpon.queryLocation;
		}

		console.log("this is location " + location);

		Squpon.pageNumber = 1;

		$("#nav-mobile li").removeClass("active");
		$(this).parent().addClass("active");
		$('[data-page]').closest('li').removeClass('active').addClass('waves-effect');
		$('.pagination').find('a[data-page=1]').closest('li').removeClass('waves-effect').addClass('active');
		$('#next').parent('li').removeClass('disabled').addClass('waves-effect');
		$('#previous').parent('li').removeClass('waves-effect').addClass('disabled');
		Squpon.queryLocation = location;
		Squpon.queryCategory = category;

		query = "";

		displayInfo(location, query, category, "");

		Squpon.displayObject();
	});

	// ******************************************************************

	// 				Page Number Click Handler

	// *******************************************************************

	$('.page-number').on('click', function (event) {

		event.preventDefault();

		// Clean contents before appending.
		$('h3.main-content-header').remove();
		$('div.card-display').remove();

		var $li = $('.pagination li');

		// Change active class to current page
		$li.removeClass('active').addClass('waves-effect');
		$(this).closest('li').removeClass('waves-effect').addClass('active');

		// Grab query info from previous search
		var location = Squpon.queryLocation;
		var query = Squpon.queryQuery;
		var category = Squpon.queryCategory;
		var page = $(this).closest("a[data-page]").data('page');
		Squpon.pageNumber = page;

		if (page === 1) {
			// fade out previous arrow when curr page is 1
			$('#previous').closest('li').removeClass('waves-effect').addClass('disabled');

			// disable click handler
			$('#previous').off('click');
		}

		if (page === 2 || page === 3 || page === 4 || page === 5) {

			$('#previous').closest('li').removeClass('disabled').addClass('waves-effect');
			$('#previous').off('click');
			$('#previous').on('click', previous);

		}

		if (page === 4 ) {

			$('#next').closest('li').removeClass('disabled').addClass('waves-effect');
			$('#next').on('click', next);

		}

		if (page === 5) {
			// fade out next arrow when curr page is 1
			$('#next').closest('li').removeClass('waves-effect').addClass('disabled');

			// disable click handler
			$('#next').off('click');
		}

		console.log('page:  ' + page);

		displayInfo(location, query, category, page);

	});

	$('#next').on('click', next);
	$('#previous').on('click', previous);


	// ******************************************************************

	// 				Scoop Button Click Handler

	// *******************************************************************

	$(".main-content, .firebase-content").delegate('.map-modal', 'click', function() {

		//grab cardData from its parent div.
		//data will be automatically converted to JSON object
		var cardData = $(this).closest("div[data-card]").data('card');
		var mapData = $(this).closest("div[data-map]").data('map');
		var addressData = $(this).closest("div[data-address]").data('address');

		console.log('this is map-data')
		console.log(mapData);

		var cardNum = cardData['cardNum'];
		console.log("This is the cardNum : " + cardNum);

		$("#modal>.modal-content").empty();

		// Fill modal contents
		var title = $("<i class=\"material-icons right\">close</i>" + "<span>" + "<h4 class='modal-content-title'>" + cardData['shortTitle'] + "</h4></span>");
		var row = $("<div class=\"row\">");
		var colLeft = $("<div class=\"col s12 m6 map-container\">");
		// var map = $("<img src=\"assets/images/map.png\" class=\"responsive-img\">");
		var map = $('<div>');
		var colRight = $("<div class=\"col s12 m6\">");
		var merchant = $("<h4>" + cardData['merchant'] + "</h4>");
		var text = "<h5 class='modal-content-description'>" + cardData['description'] +"</h5>";
		var link = $("<br><a class=\"modal-action waves-effect waves-purple deep-purple btn-large\">");

		link.attr("href", cardData['url']);
		link.attr('target','_blank');
		link.text("Scoop it!")

		$("#modal").delegate(".right", "click", function() {
			$(".bottom-sheet").modal("close");
		})

		map.attr('id', 'map');
		colLeft.append(map);
		// colLeft.append(map);

		colRight.append(merchant);
		colRight.append(text);
		colRight.append(link);

		row.append(colLeft);
		row.append(colRight);

		$("#modal>.modal-content").append(title);
		$("#modal>.modal-content").append(row);

		// Modal Triggers here
		$('#modal').modal({

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
				Gmap.initMap( mapData, addressData );
			}
		});
	});

	

	$(".main-content").delegate('.scoop-btn', 'click', function() {

		var cardData = $(this).closest("div[data-card]").data('card');
		var couponID = cardData['id'];

		// Write card data into firebase.
		var cardsRef = database.ref('/cards');
		cardsRef.update({
			[couponID]: firebase.database.ServerValue.TIMESTAMP
		});

	});

	$("#live-view").on("click", function(event) {

		event.preventDefault();
		$("#nav-mobile li").removeClass("active");

		$(".main-content").empty();
		$(".firebase-content").empty();		

		var row = $("<div class=\"row recent-view\">");
		$(".firebase-content").append(row);

      	//Invisible pagination
      	$('.pagination').addClass('hidden');

      	var cardsRef = database.ref('/cards');
      	cardsRef.orderByValue().limitToLast(9).on("child_added", function(snapshot) {
      		firebaseCards(snapshot.key);
      	}, function (error) {
      		console.log("Error: " + error.code);
      	});

      });
});
