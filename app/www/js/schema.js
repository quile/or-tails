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
    },
    
    withId: function( what, id, callback ) {
        var query = new Parse.Query(what);
        query.get(id, {
            success: function(result) { callback( null, result ) },
            error:   function(error)   { callback( error, null ) }
        });
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
        withId: function( id, callback ) {
            utils.withId( schema.Dog, id, callback );
        },
        
        all: function(callback) {
            var query = new Parse.Query(schema.Dog);
            utils.find( query, callback );
        },
        active: function(callback) {
            var query = new Parse.Query(schema.Dog);
            utils.find( query, function( error, dogs ) {
                if (error) {
                    callback( error, [] );
                    return;
                }
                var active = [];
                for (var i = 0; i < dogs.length; i++) {
                    var park = dogs[i].get("park");
                    if (park) {
                        active.push(park);
                    }
                }
                callback( null, active );
            });
        },
        mine: function( callback ) {
            var me = Parse.User.current();
            if (!me) {
                callback("Not logged in", []);
                return;
            }
            callback( null, me.get("dogs") );
        }
    }),

    // park
    Park: Parse.Object.extend("Park", {
        setLocation: function( lat, lng ) {
            this.set("location", new Parse.GeoPoint({ latitude: lat, longitude: lng}));
        },
        location: function() {
            return this.get("location");
        },
        dogs: function( callback ) {
            schema.Dog.active( function(error, results) {
                var parkDogs = [];
                for (var i=0; i<results; i++) {
                    if (results[i].get("park").id === this.id) {
                        parkDogs.push(results[i]);
                    }
                }
                callback( error, parkDogs );
            });
        }
    }, {
        withId: function( id, callback ) {
            utils.withId( schema.Park, id, callback );
        },
        all: function(callback) {
            var query = new Parse.Query(schema.Park);
            utils.find( query, callback );
        },
        active: function(callback) {
            var query = new Parse.Query(schema.Dog);
            utils.find( query, function( error, dogs ) {
                if (error) {
                    callback( error, [] );
                    return;
                }
                var parks = {};
                var active = [];
                for (var i = 0; i < dogs.length; i++ ) {
                    var park = dogs[i].get("park");
                    if (park && !parks[park.id]) {
                        active.push(park);
                        parks[park.id] = true;
                    }
                }
                callback( null, active );
            });
        },
        near: function( callback ) {
            var me = Parse.User.current();
            if (!me) {
                callback("Not logged in", []);
            }
            me.nearbyParks( callback );
        }
    })
};
