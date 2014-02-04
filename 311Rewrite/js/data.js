(function () {
    "use strict";
    var list = new WinJS.Binding.List();
    var reports = APP311.namespace("APP311.Reports");
    var serverns = serverns || APP311.namespace("APP311.Server");

    function dataChange() {
        list.length = 0;
        reports.list.forEach(function (item) {
            list.push(item);
        });
    }

    serverns.registerUpdateCompleteCallback(dataChange);

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