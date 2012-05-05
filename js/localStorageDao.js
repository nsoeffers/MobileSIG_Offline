define(function(require, exports, module){
    "use strict";

    exports.retrieveItems = function (){
       if ( !window.localStorage ) {
           throw 'LocalStorage is not supported in your browser';
       }
    
       window.items = [];
       if ( !window.localStorage.items || window.localStorage.items === "[]" ) {
            $('.listContainer ul').html('<li class="noItems">No items stored yet, please add some</li>');
       } else {
            window.items = JSON.parse(window.localStorage.items);       
            return window.items;
       }       
    };

    exports.saveItem = function saveItem(item){
        if ( this.findItem(item.description) !== null ){
            throw 'Entry with description "' + item.description + '" already exists';
        }
        window.items.push(item);
        exports.syncItems();
    };
    
    exports.removeAllItems = function(){
        window.items = [];
        exports.syncItems();
    };
    
    this.findItem = function (description){
        for(var index in window.items){
            if ( description === window.items[index].description ) {
                return window.items[index];
            }
        }
        return null;
    };
    
    exports.syncItems = function(){
        window.localStorage.items = JSON.stringify(window.items);
    };

});