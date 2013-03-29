var view_map = function() {

	var map;

	function createMap(){
		console.log("Creating map?");
		var mapOptions = {
	      center: new google.maps.LatLng(45.52594, -122.65595),
	          zoom: 14,
	          disableDefaultUI: true,
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	        
	    map = new google.maps.Map($("#map-container").get(0), mapOptions);

	    console.log("Map created.");
	}

	return {
		$container : $("#map"),

		initialize : function() {
			createMap();
		},

		show : function(params) {
			console.log("Showing map.");

			createMap();
		}
	} 
};