// Object schema for Parse objects

var utils = {
    find: function( query, callback ) {
        query.find({
            success: function(results) { callback( null, results ) },
            error:   function(error)   { callback( error, null ) }
        });
    },
    nearest: function( what, location, callback ) {
        var query = new Parse.Query(what);
        query.near("location", location);
        utils.find( query, callback );
    }
};

var schema = {
    // user
    User: Parse.User.extend("User", { 
        setLocation: function( lat, lng ) {
            this.set("location", new Parse.GeoPoint({ latitude: lat, longitude: lng}));
        },
        location: function() {
            return this.get("location");
        },
        nearbyParks: function( callback ) {
            utils.nearest( schema.Park, this.get("location"), callback );
        }
    }, {

    }),

    // dog
    Dog: Parse.Object.extend("Dog", {
        owner: function() {

        },
        
        activate: function( park, callback ) {
            this.set("park", park );
            this.save({ park: park }, {
                success: function(o) {
                    callback( null, o );
                },
                error: function(e) {
                    callback( e, null );
                }
            });
        },
        
        deactivate: function( callback ) {
            this.save({ park: null }, {
                success: function(o) {
                    callback( null, o );
                },
                error: function(e) {
                    callback( e, null );
                }
            });            
        }
    }, {
        all: function(callback) {
            var query = new Parse.Query(schema.Dog);
            utils.find( query, callback );
        }
    }),

    // park
    Park: Parse.Object.extend("Park", {
        setLocation: function( lat, lng ) {
            this.set("location", new Parse.GeoPoint({ latitude: lat, longitude: lng}));
        },
        location: function() {
            return this.get("location");
        }
    }, {
        all: function(callback) {
            var query = new Parse.Query(schema.Park);
            utils.find( query, callback );
        },
    })
};
