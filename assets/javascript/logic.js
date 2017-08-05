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

		for(var i=0; i<response.deals.length; i++) {
			var dealPic = $("<img>");
			dealPic.attr("src", response.deals[i].deal.image_url);
			var shortTitle = $("<h2>").html(response.deals[i].deal.short_title);
			
			$("#first").append(dealPic);
			$("#firstText").append(shortTitle);
			


		}
	})





	$('.carousel.carousel-slider').carousel({fullWidth: true});
});