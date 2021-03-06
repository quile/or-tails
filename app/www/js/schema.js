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
        },
        nearestPark: function( callback ) {
            this.nearbyParks( function( error, results ) {
                if (error) { callback(error, null); return }
                if (results.length > 0) {
                    callback( null, results[0] );
                }
            });
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
                        active.push(dogs[i]);
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
            var self = this;
            schema.Dog.active( function(error, results) {
                console.log("found " + results.length + " active dogs yeah");
                var parkDogs = [];
                $(results).each( function(index, item) {
                    if (item.get("park").id === self.id ) {
                        parkDogs.push(item);
                    }
                });
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
