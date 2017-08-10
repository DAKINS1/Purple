$(document).ready(function() {

	function firebaseCards(id) {

      console.log('---------------0------firebaseCards() called---------------------------------r')

		var queryURL = "https://api.sqoot.com/v2/deals/" + id;

		$.ajax({
			url: queryURL,
			method: "GET",
			headers: {
				"Authorization" : "api_key xlagn7"
			}
		}).done(function(response) {

			var coupon = response.deal;
			var couponNum = id;
			var couponDiv;

   			// Validate Data
   			if (coupon.merchant.latitude){
   				// get lat,lng from each deals and push into Squpon.dealsLocation array;
   				Gmap.dealsLocation.push({'lat': coupon.merchant.latitude, 'lng': coupon.merchant.longitude});

   				console.log("== start map info ==");
   				console.log(coupon.merchant.latitude);
   				console.log(coupon.merchant.longitude);
   				console.log("== end map info ==");
   			}

      		// Validate data
      		if (coupon) {

      			couponDiv = $("<div class=\"col s12 m4 card-div\">");
      			var card = $("<div class=\"card large sticky-action hoverable\" id=\"card-" + couponNum + "\">");
      			var moreInfoBtn = "<a class=\"btn-floating halfway-fab waves-effect waves-light activator purple\"><i class=\"material-icons\">more_vert</i></a>";
      			var cardImage = $("<div class=\"card-image waves-effect waves-block waves-light\">");
      			var couponImg = $("<img class=\"activator img-fit\">");
      			var couponPrice = coupon.price;
      			var price = $("<span class=\"card-title coupon-price right-align\">").append("$" + couponPrice);


      			couponImg.attr("src", coupon.image_url);
      			cardImage.append(couponImg);   					
      			cardImage.append(price);
      			card.append(moreInfoBtn);
      			card.append(cardImage);

      			var cardContent = $("<div class=\"card-content\">");
      			var shortTitle = coupon.short_title;
      			var merchantName = coupon.merchant.name;

      			var cardMainTitle = $("<span class=\"card-title activator grey-text text-darken-4\">" + shortTitle + "</span>");

      			cardContent.append(cardMainTitle);
      			cardContent.append("<p>" + merchantName + "</p>");
      			card.append(cardContent);

      			var cardAction = $("<div class=\"card-action center-align\">");
      			var scoopBtn = $("<a href=\"#modal\" class=\"\">Scoop</a>");
      			scoopBtn.attr("href", "#modal");
      			scoopBtn.addClass("waves-effect waves-purple btn deep-purple modal-trigger map-modal");
      			scoopBtn.html("<i class=\"material-icons left\">play_for_work</i>Scoop");

      			var categoryName = coupon.category_name;

      			cardAction.append(scoopBtn);
      			card.append(cardAction);

      			var categoryName = coupon.category_name;
      			var cardReveal = $("<div class=\"card-reveal\">");
      			var cardRevealTitle = $("<span class=\"card-title grey-text text-darken-4\">" + merchantName + "<i class=\"material-icons right\">close</i></span>");
      			var description = coupon.title;
      			var finePrint = $("<p>" + coupon.fine_print + "</p>");

      			cardReveal.append(cardRevealTitle);
      			cardReveal.append("<h5>" + description + "</h5>");
      			cardReveal.append(finePrint);

      			card.append(cardReveal);

      			couponDiv.append(card);

      			var couponURL = coupon.untracked_url;

   					//store card info in JSON object
   					var dataCard = {
   						'cardNum': couponNum,
   						'shortTitle': shortTitle,
   						'description': description,
   						'url': couponURL,
   					}

                  var latlng = {
                     'lat': coupon.merchant.latitude, 
                     'lng': coupon.merchant.longitude
                  };

   					couponDiv.attr('data-card', JSON.stringify(dataCard));
                  couponDiv.attr('data-map', JSON.stringify(latlng));

   					$(".main-content").children().prepend(couponDiv[0]);   					
   				}

   			});

	}

	// Create a variable to reference the database
	var database = firebase.database();
	var cardsRef = database.ref('/cards');

	$("#live-view").on("click", function() {
		$(".main-content").empty();

		var row = $("<div class=\"row\">");
		$(".main-content").append(row);

		//Invisible pagination
		$('.pagination').addClass('hidden');

		cardsRef.on("child_added", function(snapshot) {
			var childKey = snapshot.key;
			var childData = snapshot.val();
			firebaseCards(childData.couponID);
		});

	});


});