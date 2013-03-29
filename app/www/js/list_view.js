var list_view = function(elementId, objectType) {
	
	var $container = $(elementId);
	var data = schema[objectType];

	function loadList() {
		$container.empty();
			console.log("getting dogs..");
			
			data.all( function( error, result ) {
				console.log("data callback");
				
				if(!error){
					console.log("Results: " + result.length);
					for(var i = 0; i < result.length; i++){
						console.log("Row: " + result[i].get("name"));
						var row = document.createElement("div");
						row.innerHTML = result[i].get("name");
						$container.append( row );
					}
				} else{
					console.log("error!");
				}

			});

			console.log("done.");
	}

	return {
		$container : $container,

		initialize : function() {
		},

		show : function(state){
			loadList();
		},

		getState : function() {
			return {};
		}
	}
};