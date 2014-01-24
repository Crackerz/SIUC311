//Get our namespace (ns) from global application
var reportns = reportns || APP311.namespace("APP311.Reports");

//reportns.list is the list of reports stored in our application
reportns.list = [];

//reportns.newItem generates an object for storing in our report list
reportns.list.newItem = function (reportType, studentID, description, latitude, longitude, image, timeStamp, uniq_id) {
    return {
        id: uniq_id,
        type: reportType,
        dawgtag: studentID,
        desc: description,
        lat: latitude,
        long: longitude,
        imageFile: image,
        time: timeStamp,
    };
}

//reportns.add adds a new item to reportns.list, uniq_id is optional.
reportns.list.add = function (reportType, studentID, description, latitude, longitude, image, timeStamp, uniq_id) {
    uniq_id = uniq_id || -1; // a uniq_id should only exist if being pulled from server
    this.push(this.newItem(reportType, studentID, description, latitude, longitude, image, timeStamp));
}

reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());
reportns.list.add("A/C Broke", "SIU850955916", "It's hot as balls in here!", 52.0, 52.0, null, (new Date()).toISOString());