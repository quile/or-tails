var park_map = function() {

	//var map;
	var $container = $("#park-map");
	var parkId = null;

	var showParkDetails = function(id){
		parkId = id;
		$container.html("Loading park: " + id);
	};

	var initMap = function() {

	}

	return {
		$container : $container,

		initialize : function() {
		},

		show : function(params){
			showParkDetails(params);
			initMap();
		},

		getState : function() {
			return parkId;
		}
	}
};