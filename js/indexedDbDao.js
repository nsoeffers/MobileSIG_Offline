define(["domain", "exports"], function(domain, exports) {
    "use strict";
    
    var db;
    
    exports.init = function() {
        // Deal with vendor prefixes
        if ( "webkitIndexedDB" in window ) {
          window.indexedDB      = window.webkitIndexedDB;
          window.IDBTransaction = window.webkitIDBTransaction;
          window.IDBKeyRange    = window.webkitIDBKeyRange;
          // ...
        } else if ( "moz_indexedDB" in window ) {
          window.indexedDB = window.moz_indexedDB;
        }
        if ( !window.indexedDB ) {
            throw 'IndexedDB Database is not supported in your browser';
        } 
        
        var dbRequest = window.indexedDB.open(
          'Groceries',        // Database ID
          'SIG Offline Storage Demo' // Database Description
        );        
        
        dbRequest.onsuccess = function () {
            db = dbRequest.result;
            if ( db.version === '') {                
                var versionRequest = db.setVersion( '1.0' );
                versionRequest.onsuccess = function (  ) {
                    alert('Creating new store');
                    db.createObjectStore(
                      "Item",  // The Object Store’s name
                      {keyPath: 'description'}
                    ); 
                };
                versionRequest.onerror = function() {
                    alert('Error occurred while creating indexedDb');
                };
//            } else if ( db.version === '1.0'){
//                alert('Trying to delete');
//                var dbDeleteRequest = window.indexedDB.deleteDatabase('Groceries');
//                dbDeleteRequest.onerror = function() { alert('Error deleting database'); };
//                dbDeleteRequest.onsuccess = function() { alert('Successfully deleting database'); };
            }
        };
        
        dbRequest.onerror = function() {
            alert('Error occurred while opening indexedDb');
        };
    };
    
    exports.daoDescription = "IndexedDB DAO";

    exports.retrieveItems = function (callback){
        if ( !db ) {
            setTimeout(function() { exports.retrieveItems(callback); }, 100);
            return;
        }
        var transaction = db.transaction([ 'Item' ], window.IDBTransaction.READ_ONLY);
        var store = transaction.objectStore('Item');
        var cursorRequest = store.openCursor();
        var items = [];
        cursorRequest.onsuccess = function(e) {
            if ( !e.target || !e.target.result ) {
                callback(items);
            }
            items.push(new domain.Item(e.target.result.key, e.target.result.value.checked));
            e.target.result.continue();
        };
        cursorRequest.onerror = function(){
            alert('Failed to retrieve items from IndexedDB');
        };
    };
    
    exports.saveItem = function (item, successCallback, failureCallback){
        var transaction = db.transaction([ 'Item' ], window.IDBTransaction.READ_WRITE);
        var store = transaction.objectStore("Item");        
        var saveRequest = store.add(item);
            
        saveRequest.onerror = function(){
            transaction.abort();
            failureCallback('Entry with description "' + item.description + '" already exists');
        };
        saveRequest.onsuccess = function() {
            successCallback(item);
        };
    };
    
    exports.removeAllItems = function(successCallback, failureCallback){
        var transaction = db.transaction([ 'Item' ], window.IDBTransaction.READ_WRITE);
        var store = transaction.objectStore("Item");        
        var clearRequest = store.clear();
        clearRequest.onsuccess = function() {
            successCallback();
        };
        clearRequest.onerror = function() {
            failureCallback('Unable to delete all items');
        };
    };
    
    exports.updateItem = function(item, failureCallback){
        var transaction = db.transaction([ 'Item' ], window.IDBTransaction.READ_WRITE);
        var store = transaction.objectStore("Item");        
        var putRequest = store.put(item);        
        putRequest.onerror = function() {
            failureCallback('Error updating item');            
        };
    };    
    
    exports.findItem = function(description, successCallback, failureCallback){
        var transaction = db.transaction([ 'Item' ], window.IDBTransaction.READ_WRITE);
        var store = transaction.objectStore("Item");        
        var getRequest = store.get(description);        
        getRequest.onsuccess = function(e) {
            successCallback(new domain.Item(e.target.result.description, e.target.result.checked));
        };
        getRequest.onerror = function() {
            failureCallback('Error retrieving item with description:' + description);
        };
    };  
});