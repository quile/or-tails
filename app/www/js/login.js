var view_login = function() {

	return {
		$container : $("#login"),

		initialize : function() {
            var self = this;
            $("#login-button").click( function(e) {
                console.log("login");
                e.preventDefault();
                self.login();
            });
		},

        login: function() {
            var username = $("#username").val();
            var password = $("#password").val();
            
            console.log("login function");
            if (username && password) {
                console.log("trying to log user " + username + " in with " + password);
                Parse.User.logIn( username, password, {
                    success: function( user ) {
                        $("login-messages").hide();
                        console.log("logged " + username + " in");
                        app.showView("map");
                    },
                    error: function( error ) {
                        console.log("login failed " + error);
                        $("login-message").html( error.message ).show();
                    }
                });
            } else {
                $("login-message").html( "You must enter a valid user name and password" );
            }
        },
        
		show : function(params){
			console.log("Showing login.");
            var me = Parse.User.current();
            if (me) {
                console.log("User " + me.get("name") + " is already authenticated");
                app.showView("map");
            }
		},

		getState : function() {
			return {};
		}
	}
};