//Get our (ns) from the global server
var serverns = serverns || APP311.namespace("APP311.Server");

serverns.url = "http://127.0.0.1";
serverns.accesspoints = {};
serverns.accesspoints.ticket = "/ticket";
serverns.accesspoints.update = "/update";

/**
 * These are arrays of callback functions. We can register callback functions with
 * serverns to be called upon specific events occuring. The names indicate the events
 */
serverns.updateTicketCallback = [];
serverns.completeTicketCallback = [];
serverns.deleteTicketCallback = [];
serverns.updateCompleteCallback = [];

serverns.requestUpdate = function () {
    var serverRequest = new XMLHttpRequest(); //despite its name, not for xml. We will be getting JSON.
    serverRequest.onload = serverns.receivedUpdate;
    var url = serverns.url+serverns.accesspoints.update;
    if(serverns.currentTimestamp)
        url += "?timestamp=" + serverns.scrubTimestamp(serverns.currentTimestamp);
    console.log(url); //TODO REMOVE
    serverRequest.open("GET", url);
    serverRequest.send();
};

serverns.receivedUpdate = function() {
    var json = this.responseText; //DOMString === String
    var responseCode = this.status; //unsigned short
    if (responseCode != 200) { return;}
    var update = JSON.parse(json,function(k, v) { 
        return (typeof v === "object" || isNaN(v)) ? v : parseInt(v, 10); //Parse numbers as numbers, not strings
    });

    //Iterate through each ticket returned and call the appropriate callback function for our application
    update.tickets.forEach(function (element) {
        switch (element.status) {
            case 0:
                serverns.updateTicketCallback.forEach(function (callback) {
                    callback(element);
                });
                break;
            case 1:
                serverns.completeTicketCallback.forEach(function (callback) {
                    callback(element);
                });
                break;
            case 2:
                serverns.deleteTicketCallback.forEach(function (callback) {
                    callback(element);
                });
                break;

        }
    });

    serverns.updateCompleteCallback.forEach(function (callback) {
        callback();
    });

    console.log(json);
};

serverns.registerUpdateTicketCallback = function(func) {
    serverns.updateTicketCallback.push(func);
};

serverns.registerDeleteTicketCallback = function (func) {
    serverns.deleteTicketCallback.push(func);
};

serverns.registerCompleteTicketCallback = function (func) {
    serverns.completeTicketCallback.push(func);
};

serverns.registerUpdateCompleteCallback = function (func) {
    serverns.updateCompleteCallback.push(func);
};

serverns.scrubTimestamp = function (timestamp) {
    var t = timestamp.split(/[- :]/);
    return t[0]+t[1]+t[2]+t[3]+t[4]+t[5];
};

serverns.updateTimestamp = function (timestamp) {
    if(!serverns.currentTimestamp || parseInt(timestamp,10)>parseInt(serverns.currentTimestamp,10)) {
        serverns.currentTimestamp = timestamp;
    }
};

//Start the heartbeat update
window.setInterval(window.setTimeout(serverns.requestUpdate, 30000), 30000);
serverns.requestUpdate();