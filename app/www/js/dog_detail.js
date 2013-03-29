var dog_detail = function() {

	var $container = $("#dog-detail");
	
	return {
		$container : $container,

		initialize : function() {
		},

		show : function(params){
			console.log("Showing dog detail page: " + params);
			//schema.Dog.
			$container.html("Dog details for id: " + params);
		}
	}
};