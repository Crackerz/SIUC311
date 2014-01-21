//Get our namespace (ns) from global application
var reportns = reportns || APP311.namespace("APP311.Reports");

//reportns.list is the list of reports stored in our application
reportns.list = [];

//reportns.newItem generates an object for storing in our report list
reportns.newItem = function (reportType, studentID, description, latitude, longitude, image, timeStamp) {
    return {
        type: reportType,
        dawgtag: studentID,
        desc: description,
        lat: latitude,
        long: longitude,
        imageFile: image,
        time: timeStamp,
    };
}

//reportns.add adds a new item to reportns.list
reportns.add = function (reportType, studentID, description, latitude, longitude, image, timeStamp) {
    this.list.push(this.newItem(reportType, studentID, description, latitude, longitude, image, timeStamp));
}