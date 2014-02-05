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
    console.log((new Date()).toISOString() + ": Requesting Update...");
    var serverRequest = new XMLHttpRequest(); //despite its name, not for xml. We will be getting JSON.
    serverRequest.onload = serverns.receivedUpdate;
    var url = serverns.url+serverns.accesspoints.update;
    if(serverns.currentTimestamp)
        url += "?timestamp=" + serverns.scrubTimestamp(serverns.currentTimestamp);
    serverRequest.open("GET", url);
    serverRequest.send();
};

serverns.receivedUpdate = function() {
    var json = this.responseText; //DOMString === String
    var responseCode = this.status; //unsigned short
    if (responseCode != 200) { return;}
    var update = JSON.parse(json);

    //Iterate through each ticket returned and call the appropriate callback function for our application
    for(var i = 0; i < update.tickets.length; i++) {
        var element = update.tickets[i];
        switch (element.status) {
            case 0:
                for (var j = 0; j < serverns.updateTicketCallback.length; j++) {
                    serverns.updateTicketCallback[j](update.tickets[i]);
                }
                break;
            case 1:
                for (var j = 0; j < serverns.completeTicketCallback.length; j++) {
                    serverns.completeTicketCallback[j](update.tickets[i]);
                }
                break;
            case 2:
                for (var j = 0; j < serverns.deleteTicketCallback.length; j++) {
                    serverns.deleteTicketCallback[j](update.tickets[i]);
                }
                break;

        }
    }

    for (var i = 0; i < serverns.updateCompleteCallback.length; i++) {
        serverns.updateCompleteCallback[i]();
    }
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
serverns.requestUpdate();