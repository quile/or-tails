var park_map = function() {

	var map;
	var $container = $("#park-map");
	var $list = $("#parkmap-dogs");
	var parkId = null;

	var showParkDetails = function(id){
		parkId = id;
		//$container.html("Loading park: " + id);
		schema.Park.withId(id, function(error, result) {
			if(!error){

				//app.setTitle("Park: " + result.get("name"));
				$("#parkmap-title").html( result.get("name") );
				var parkLocation = new google.maps.LatLng( result.get("location").latitude, result.get("location").longitude );
				
				map.setCenter(parkLocation);

				var marker = new google.maps.Marker( {
					map : map,
					animation: google.maps.Animation.DROP,
					title : result.get("name"),
					position: parkLocation
				});

				$list.html("Loading hounds..");
				result.dogs( function(error, result){
					if(!error){
						console.log(result.length + " dogs at the park");
						if(result.length == 0){
							$list.html('<div class="row">There aren\'t any dogs at this park.</div>');
						}
						else{
							for(var i = 0; i < result.length; i++){
								var row = document.createElement("div");
								row.className = "row";
								row.innerHTML = result[i].get("name");
								$list.append(row);
							}
						}
					}
				});
			}
		});

		//schema.Park.dogs
	};

	var initMap = function() {
		if(!map){
			var mapOptions = {
		      center: new google.maps.LatLng(45.52594, -122.65595),
		          zoom: 16,
		          disableDefaultUI: true,
		          mapTypeId: 'styled',
		           mapTypeControlOptions: {
            			mapTypeIds: [ 'styled']
          		  }
		    };
		        
		    map = new google.maps.Map( $("#parkmap-container").get(0), mapOptions );

		    var styledMapType = new google.maps.StyledMapType(app.map_style, { name: 'styled' });
       		map.mapTypes.set('styled', styledMapType);
		}
	}

	return {
		$container : $container,

		initialize : function() {
		},

		show : function(params){
			initMap();
			showParkDetails(params);
		},

		getState : function() {
			return parkId;
		}
	}
};