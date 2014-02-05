//Get our namespace (ns) from global application
var reportns = reportns || APP311.namespace("APP311.Reports");
var serverns = serverns || APP311.namespace("APP311.Server");

//reportns.list is the list of reports stored in our application
reportns.list = [];
reportns.callbacks = [];

reportns.registerCallback = function (func) {
    reportns.callbacks.push(func);
};

reportns.serverUpdate = function (ticket) {
    reportns.list.push(ticket); //TODO handle delete
    for (var i = 0; i < reportns.callbacks.length; i++) {
        reportns.callbacks[i]();
    }
};

reportns.updateTicket = function (ticket) {
    for (var i = 0; i < reportns.list.length; i++) {
        if (reportns.list[i].id == ticket.id) {
            reportns.list[i] = ticket;
            return;
        }
    }
    reportns.list.push(ticket);
};

reportns.deleteTicket = function (ticket) {
    for (var i = 0; i < reportns.list.length; i++) {
        if (reportns.list[i].id == ticket.id) {
            reportns.list = reportns.list.splice(i, 1);
        }
    }
};

reportns.updateTimestamp = function () {
    reportns.list.forEach(function (ticket) {
        serverns.updateTimestamp(ticket.timestamp);
    });
};

serverns.registerUpdateTicketCallback(reportns.updateTicket);
serverns.registerDeleteTicketCallback(reportns.deleteTicket);
serverns.registerCompleteTicketCallback(reportns.deleteTicket);
serverns.registerUpdateCompleteCallback(reportns.updateTimestamp);