/*
APP311 should be consulted in every file. When creating a module for this app, make sure to
register a namespace using the APP311.namespace(string) function!
*/
var APP311 = APP311 || {}; //Global object for our application

/*
APP311.namespace establishes a namespace for a submodule of the application.
    
Example Usage:
var namespace = APP311.namespace("APP311.View.ReportList")
namespace.Reports = {...}
namespace.Reports.sort = function() {...}
...
This will returns reference to APP311 -> View -> ReportList
We then declare an object in that namespace and give it a sorting function.
*/
APP311.namespace = function (namespace_string) {
    var path = namespace_string.toUpperCase().split('.'),    //Contains our namespace path components
        parent = APP311,                        //The parent namespace for our app
        i;                                      //Will be used as an iterator

    //Now lets rip out the redundant namespace "APP311" if it exists
    if (path[0] == "APP311") {
        path = path.slice(1);
    }

    for (i = 0; i < path.length; i++) {
        //Lets check if this part of the path exists
        if (typeof parent[path[i]] === "undefined") {
            parent[path[i]] = {}; //If it doesn't exist, create it!
        }
        parent = parent[path[i]];
    }
    
    return parent; //Return the namespace requested
}