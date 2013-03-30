var view_checkin = function(id) {

	var $container = $("#checkin");
	
	return {
		$container : $container,

		initialize : function() {
            console.log("checkin view");
		},

		show : function(params) {
            console.log("show checkin view");
            
            var me = Parse.User.current();

            console.log( me );
            var dogsList = $("#checkin-dogs");
            console.log( me.get("dogs") );
            var dogs = {};

            $( me.get("dogs") ).each(function(index, item) {
                console.log( item );
                schema.Dog.withId( item.objectId, function( error, result ) {
                    dogsList.append("<li> <input type='checkbox' name='dog-id' value='" + result.id + "' checked='checked' /> " + result.get("name") + "</li>");
                } );
            });
            
            var parksList = $("#checkin-parks");
            
            var parks = {};
            
            schema.Park.all( function(error, results) {
                $( results ).each( function( index, result) {
                    parks[result.id] = result;
                    var p = $("<li id='" + result.id + "'> " + result.get("name") + "</li>");
                    p.on("touchstart", function(e) {
                        var dogIds = [];
                        $("input[name='dog-id']:checked").each(function(index,item){
                            dogIds.push( $(this).val() );
                        });
                        console.log(dogIds);
                        var parkId = $(this).attr("id");
                        console.log(parkId);
                        
                        // check dogs in
                        var thisPark = parks[parkId];
                        
                        console.log( thisPark );
                        
                        console.log( dogs );
                        $(dogIds).each( function(index, item) {
                            console.log( item );
                            schema.Dog.withId( item, function( error, result ) {
                                result.activate( thisPark, function( error, result ) {
                                    console.log("activated dog " + result.get("name") + " in park");
                                });
                            });
                        });
                        app.showView("park-map", parkId);
                    });
                    parksList.append(p);
                });
            });
		}
	}
};2