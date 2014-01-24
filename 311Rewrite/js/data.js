(function () {
    "use strict";
    var list = new WinJS.Binding.List();
    var reports = APP311.namespace("APP311.Reports");

    reports.list.forEach(function (item) {
        list.push(item);
    });

    WinJS.Namespace.define("Data", {
        items: list,
        onUserUpdate: useradd,
        onServerUpdate: serveradd
    });

    function useradd(callback) {
        
    }

    function serveradd(callback) {

    }
})();
