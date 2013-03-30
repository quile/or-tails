var list_view = function(elementId, objectType, detailView, title) {
	
	var $container = $("#" + elementId);
	var $list = $container.find(".list-container");
	
	var data = schema[objectType];
	var dataTypeName = objectType;

	var detailViewName = detailView;

	var pageTitle = (title != null) ? title : "";

	function loadList() {
		
		console.log("getting data: " + dataTypeName);
		
		$list.empty();

		data.all( function( error, result ) {
			console.log("data callback" + dataTypeName);
			
			if(!error){
				
				console.log("Results: " + result.length);

				for(var i = 0; i < result.length; i++){
					console.log("Row: " + result[i].id  + " = " + result[i].get("name"));
					
					var $row = $(document.createElement("div"));

					$row.addClass("row");
					$row.addClass(dataTypeName + "-row");
					$row.attr("data-id", result[i].id );
					$row.html('<div class="row-title">' + result[i].get("name") + '</div><div class="arrow">&gt;&gt;</div>');

					$row.on("touchstart", function() {
						console.log( $(this).attr("data-id") );
						app.showView(detailViewName, $(this).attr("data-id"));
						$(this).addClass("touched");
					});

					$row.on("touchend", function() {
						$(this).removeClass("touched");
					});

					$list.append( $row );
				}
			} else{
				console.log("error!");
			}

		});
	}

	return {
		$container : $container,

		initialize : function() {
		},

		show : function(state){
			loadList();
			app.showBackButton();
			app.setTitle(pageTitle);
		},

		getState : function() {
			return {};
		}
	}
};