(function () {
    "use strict";

    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var watchid;

    ui.Pages.define("/pages/add/add.html", {

        _items: null,
        _itemSelectionIndex: -1,
        _wasSingleColumn: false,

        // This function is called to initialize the page.
        init: function (element, options) {
            // Store information about the group and selection that this page will
            // display.
            this._items = Data.items;
            this.itemDataSource = this._items.dataSource;
            this._itemSelectionIndex = (options && "selectedIndex" in options) ? options.selectedIndex : -1;
            this.selectionChanged = ui.eventHandler(this._selectionChanged.bind(this));
        },

        // This function is called whenever a user navigates to this page.
        ready: function (element, options) {
            element.querySelector("header[role=banner] .pagetitle").textContent = "Tickets";

            this._updateVisibility(element);

            //Lets go ahead and grab the user's dawgtag if it is accessible
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
        },

        unload: function () {
            navigator.geolocation.clearWatch(watchid);
            delete queuens.map;
        },

        updateLayout: function (element) {
            var isSingleColumn = this._isSingleColumn();
            if (this._wasSingleColumn === isSingleColumn) {
                return;
            }

            var listView = element.querySelector(".itemlist").winControl;
            var firstVisible = listView.indexOfFirstVisible;
            this._updateVisibility(element);

            var handler = function (e) {
                listView.removeEventListener("contentanimating", handler, false);
                e.preventDefault();
            }

            if (isSingleColumn) {
                listView.selection.clear();
                if (this._itemSelectionIndex >= 0) {
                    // If the app has snapped into a single-column detail view,
                    // add the single-column list view to the backstack.
                    nav.history.current.state = {
                        selectedIndex: this._itemSelectionIndex
                    };
                    nav.history.backStack.push({
                        location: "/pages/split/split.html"
                    });
                    element.querySelector(".articlesection").focus();
                } else {
                    listView.addEventListener("contentanimating", handler, false);
                    if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                        listView.indexOfFirstVisible = firstVisible;
                    }
                    listView.forceLayout();
                }
            } else {
                // If the app has unsnapped into the two-column view, remove any
                // splitPage instances that got added to the backstack.
                if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/pages/split/split.html") {
                    nav.history.backStack.pop();
                }

                listView.addEventListener("contentanimating", handler, false);
                if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                    listView.indexOfFirstVisible = firstVisible;
                }
                listView.forceLayout();
                listView.selection.set(this._itemSelectionIndex >= 0 ? this._itemSelectionIndex : Math.max(firstVisible, 0));
            }

            this._wasSingleColumn = isSingleColumn;
        },

        // This function checks if the list and details columns should be displayed
        // on separate pages instead of side-by-side.
        _isSingleColumn: function () {
            return document.documentElement.offsetWidth <= 767;
        },

        _selectionChanged: function (args) {
           
        },

        // This function toggles visibility of the two columns based on the current
        // view state and item selection.
        _updateVisibility: function (element) {
        }
    });
})();
/****************
 * END WIN.CRAP *
 ****************/
var queuens = queuens || APP311.namespace("APP311.Queue");

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
    queuens.map = queuens.map || new L.map('basicMap');
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, { minZoom: 12, maxZoom: 19});

    // start the map in South-East England
    queuens.map.setView(new L.LatLng(lat, long), 24);
    queuens.map.addLayer(osm);
}
