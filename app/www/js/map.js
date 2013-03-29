var view_map = function() {

	var map;
	var $container = $("#map");

	function createMap(){

		console.log("Creating map?");
		        
		var mapOptions = {
	      center: new google.maps.LatLng(),
	          zoom: 14,
	          disableDefaultUI: true,
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	       
	    map = new google.maps.Map( $("#map-container").get(0), mapOptions );
        
        // locate user and move map
        var me = Parse.User.current();
        var currentPosition = navigator.geolocation.getCurrentPosition(
            function(point) {
                map.setCenter( new google.maps.LatLng( point.coords.latitude, point.coords.longitude ) );
                me.setLocation( point.coords.latitude, point.coords.longitude, function(error, result) {
                    console.log("Changed user's location to " + point.coords.latitude + " / " + points.coords.longitude );
                });
            },
            function(error) {
                console.log("Couldn't get GPS position");
            }
        );
	}

	return {
		$container : $container,

		initialize : function() {
			createMap();
            
            if (!me) {
                app.showView("login");
            }
            
            $("check-in").click(function(el) {
                var self = this;
                e.preventDefault();
                self.checkIn();
            });
		},

		show : function(params) {
			console.log("Showing map.");

			createMap();
		},

		getState : function() {
			return {};
		},
        
        checkIn: function() {
            var me = Parse.User.current();
            if (!me) {
                app.showView("login");
            }
            var location = me.location();
            
        }
	} 
};