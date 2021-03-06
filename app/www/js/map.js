var view_map = function() {

	var map;
	var parks = [];

	var $container = $("#map");

	function createMap(){
		
		if(!map){
			console.log("Creating map?");
			
			var mapOptions = {
		      center: new google.maps.LatLng(45.52594, -122.65595),
		          zoom: 14,
		          disableDefaultUI: true,
		           mapTypeId: 'styled',
		           mapTypeControlOptions: {
            			mapTypeIds: [ 'styled']
          		  }
		    };

		    map = new google.maps.Map( $("#map-container").get(0), mapOptions );

		    var styledMapType = new google.maps.StyledMapType(app.map_style, { name: 'styled' });
       	    map.mapTypes.set('styled', styledMapType);
        }
        // locate user and move map
        /*
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
		*/

		// remove markers
		for(var i = 0; i < parks.length; i++){
			parks[i].marker.setMap(null);
		}
		parks = [];

		schema.Park.all( function(error, result) {
			if(!error){
				for(var i = 0; i < result.length; i++){
					var marker = new google.maps.Marker( {
						map : map,
						animation: google.maps.Animation.DROP,
						position: new google.maps.LatLng( result[i].get("location").latitude, result[i].get("location").longitude )
					})
					registerMarkerEvents(marker, result[i].id);
					parks.push({"id" : result[i].id, "marker" : marker });
				}
			}
		});
		
	}

	var registerMarkerEvents = function(marker, id ){
		var uid = id;
		google.maps.event.addListener(marker, 'click', function() {
			app.showView("park-map", uid);
		});
	}

	return {
		$container : $container,

		initialize : function() {
			//createMap();
            
            $("check-in").click(function(el) {
                var self = this;
                e.preventDefault();
                self.checkIn();
            });
		},

		show : function(params) {
			console.log("Showing map.");
			app.setTitle("Find a Park");
			createMap();
		},

		getState : function() {
			return {};
		}
	} 
};