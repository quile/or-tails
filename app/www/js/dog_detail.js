var dog_detail = function() {

	var $container = $("#dog-detail");
	var dogId = null;
	
	return {
		$container : $container,

		initialize : function() {
		},

		show : function(params){
			dogId = params;
			
			$container.html("Fetching hound data...");

			schema.Dog.withId(params, function(error, result){
				if(!error){
					$container.html("Details for: " + result.get("name"));
				}	
			});
			
		}, 

		getState : function(){
			return dogId;
		}
	}
};