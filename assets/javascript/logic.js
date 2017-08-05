$(document).ready(function() {
	$(".button-collapse").sideNav();

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