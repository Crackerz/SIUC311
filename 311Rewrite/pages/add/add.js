/******************
 * Begin WIN.CRAP *
 ******************/

if (!(typeof WinJS === 'undefined'))
(function () {
    "use strict";

    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var watchid;

    ui.Pages.define("/pages/add/add.html", {

        // This function is called to initialize the page.
        init: function (element, options) {
            
        },

        // This function is called whenever a user navigates to this page.
        ready: function (element, options) {
            onReady();
        },

        unload: function () {
            onUnload();
        }
    });
})();

/****************
 * END WIN.CRAP *
 ****************/
var queuens = queuens || APP311.namespace("APP311.Queue"); //Needed to add ticket to the queue before leaving this page.
var map;

function addToQueue() {
    var dawgTag = document.getElementById("dawgTag").value || "null";
    var reportType = document.getElementById("reportType").value || "other";
    var description = document.getElementById("description").value || "";
    var longitude = document.getElementById("longitude").value || 0;
    var latitude = document.getElementById("latitude").value || 0;
    queuens.addTicket({
        dawgTag: dawgTag,
        reportType: reportType,
        description: description,
        longitude: longitude,
        latitude: latitude
    });
    var nav = WinJS.Navigation;
    nav.back(1); //go back to where we came from
};

function setMap(long, lat, plong, plat, accuracy) {
    map = map || new L.map('basicMap');
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, { minZoom: 12, maxZoom: 19});

    // start the map in South-East England
    map.setView(new L.LatLng(lat, long), 24);
    map.addLayer(osm);
}

function onReady() {

    //Lets go ahead and grab the user's dawgtag if it is accessible
    if(!(typeof Windows === 'undefined'))
    Windows.System.UserProfile.UserInformation.getDomainNameAsync().done(function (result) {
        if (result) {
            result = result.split("\\");
            document.getElementById("dawgTag").value = result[result.length - 1];
        } else {

        }
    });

    //Grab the user's current location
    var geolocation = window.navigator.geolocation;
    if (geolocation != null) {
        //this call will prompt for access.
        geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            document.getElementById("latitude").value = lat;
            document.getElementById("longitude").value = long;
            setMap(long, lat, long, lat, position.coords.accuracy);
            document.getElementById("accuracy").innerHTML = "Accurrate up to: " + position.coords.accuracy + " meters";
        });
    }

    //Update location as the user moves
    watchid = window.navigator.geolocation.watchPosition(function (position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = long;
        setMap(long, lat, long, lat, position.coords.accuracy);
        document.getElementById("accuracy").innerHTML = "Accurrate up to: " + position.coords.accuracy + " meters";
    });
    setMap(-89.219241, 37.717491);

    //Properly handle the "Back" action
    document.getElementById("navigateBack").onclick = function () {
        if (!(typeof WinJS === 'undefined'))
            WinJS.Navigation.back();
        else
            console.log("No way to go back from here!");
    }
}

function onUnload() {
    navigator.geolocation.clearWatch(watchid);
    map = undefined;
}
