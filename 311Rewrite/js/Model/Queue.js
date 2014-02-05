var queuens = queuens || APP311.namespace("APP311.Queue");
var reportns = reportns || APP311.namespace("APP311.Reports");
var serverns = serverns || APP311.namespace("APP311.Server");

queuens.list = [];

queuens.list.localID = 0;

queuens.addTicket = function (ticket) {
    ticket.localID = queuens.list.localID++;
    queuens.list.push(ticket);
    serverns.syncTicket(ticket)
};

queuens.ticketUploaded = function (ticket) {
    for (var i = 0; i < queuens.list.length; i++) {
        if (ticket.localID == queuens.list[i].localID) {
            queuens.list = queuens.list.splice(i, 1);
            break;
        }
    };
    delete ticket.localID;
    reportns.list.push(ticket);
};