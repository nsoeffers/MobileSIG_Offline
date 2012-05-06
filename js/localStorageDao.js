define(function(require, exports, module){
    "use strict";

    var items = [];        

    exports.init = function() {
        if ( !window.localStorage ) {
           throw 'LocalStorage is not supported in your browser';
        }        
    };
    
    exports.daoDescription = "LocalStorage DAO";
    
    exports.retrieveItems = function (callback){    
        items = [];
        if ( window.localStorage.items) {
            items = JSON.parse(window.localStorage.items);       
        }       
        callback(items);
    };

    exports.saveItem = function(item, successCallback, failureCallback){
        this.findItem(item.description, 
                      function(item) { 
                          failureCallback('Entry with description "' + item.description + '" already exists');                           
                      },
                      function() {
                          items.push(item);
                          syncItems();
                          successCallback(item);
                      });
    };
    
    exports.removeAllItems = function(successCallback){
        items = [];
        syncItems();
        successCallback();
    };
    
    exports.updateItem = function(item) {
        syncItems();
    };
    
    exports.findItem = function(description, successCallback, failureCallback){
        for(var index in items){
            if ( description === items[index].description ) {
                successCallback(items[index]);
                return;
            }
        }
        failureCallback('Cannot find item with description' + description);
    };
    
    var syncItems = function(){
        window.localStorage.items = JSON.stringify(items);
    };

});