/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    views : {},

    viewStack : [],

    currentView : "login",

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        
        console.log("Device ready");
        
        Parse.initialize( ORTails.credentials.API_KEY, ORTails.credentials.JAVASCRIPT_KEY );

        app.views["park-detail"] = new static_view("park-detail");
        app.views["park-map"] = new park_map();        
        
        app.views["login"] = new view_login();
        app.views["park"] = new view_park();
        app.views["checkin"] = new view_checkin();
        app.views["map"] = new view_map();

        app.views["dog-detail"] = new dog_detail();
        app.views["doglist"] = new list_view("dog-list", "Dog", "dog-detail", "");


        $("#btn_back").on("touchstart", function() {
            app.goBack();
        });

        $("#btn_login").on("touchstart", function() {
            console.log("showing login view");
            app.showView("login");
        });

        $("#btn_map").on("touchstart", function() {
            console.log("showing map view");
            app.showView("map");
        });

        $("#btn_park").on("touchstart", function() {
            console.log("showing park view");
            app.showView("park-map");
        });


        for(var view in app.views){
            console.log("INIT: " + view);

            app.views[view].initialize();
        }

        console.log("App initialized done.");

        $(".nav").on("touchstart", function() {
            var target = $(this).attr("data-target");
            if(app.views[target]){
                app.showView(target);
            }
        });

        // set initial page.
        app.showView("login");
    },

    loadViews : function() {
         //app.views["login"] = new view_login();
        //app.views["park"] = new view_park();
        //app.views["map"] = new view_map(); ij  

        console.log("views initialized 1.");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      /*  var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    },

    setTitle : function(title){
        $("#app-title").html(title);
    },

    showView : function(view, params, skipHistory) {

        if(!skipHistory){
            app.viewStack.push( {"view" : view, "params" : params } );
        }

        $(".visible").removeClass("visible");
        app.views[view].$container.addClass("visible");
        app.views[view].show(params);
        
        console.log("Done with showView, container:" + app.views[view].$container.hasClass("visible"));
    },

    goBack : function() {
        if(app.viewStack.length >= 1){
            app.viewStack.pop();
            var data = app.viewStack[app.viewStack.length - 1];
            app.showView(data.view, data.params, true);
        } else {
            console.log("no history to pop..");
        }
    }

};
