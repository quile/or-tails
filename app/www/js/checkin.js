var view_checkin = function(id) {

	var $container = $("#checkin");
	
	return {
		$container : $container,

		initialize : function() {
            console.log("checkin view");
		},

		show : function(params) {
            console.log("show checkin view");
		}
	}
};