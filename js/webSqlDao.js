define(["domain", "exports"], function(domain, exports){
    "use strict";
    
    var db;
    var dbReady = false;
    
    exports.init = function() {
        if ( !window.openDatabase ) {
           throw 'WebSQL Database is not supported in your browser';
        }     
        db = window.openDatabase("Groceries", "1.0", "SIG Offline Storage Demo", 2*1024*1024);
        dbReady = false;
        if ( !db || db === null ) {
            throw "Unable to open database";
        }
        
        db.transaction( function(transaction){
                            transaction.executeSql("SELECT 1 FROM Item LIMIT 1");
                        },
                        function(){ // Failed initialize database
                            createDatabase(); 
                        }, 
                        function(){ // Success database is initialized and can be used
                            dbReady = true;
                        }
        );
    };
    
    exports.daoDescription = "WebSQL DAO";
    
    exports.retrieveItems = function (callback){
        db.transaction(function(transaction){            
            transaction.executeSql("SELECT * FROM Item", [],
                                   function(transaction, result) {
                                        var items = [];
                                        for( var i = 0; i < result.rows.length; i++) {
                                            items.push(new domain.Item(result.rows.item(i).description,  JSON.parse(result.rows.item(i).checked)));
                                        }
                                        callback(items);
                                   }, 
                                   function(transaction, error) {
                                       alert(error.message);
                                   });
        });
    };
    
    exports.saveItem = function (item, successCallback, failureCallback){
        db.transaction(function(transaction){
                transaction.executeSql("INSERT INTO Item(description, checked) VALUES (?, ?)", 
                                       [ item.description, item.checked ],
                                       function() { successCallback(item); }, 
                                       function(transaction, error) { 
                                           failureCallback('Entry with description "' + item.description + '" already exists'); 
                                       });
        });
    };
    
    exports.removeAllItems = function(successCallback, failureCallback){
        db.transaction(function(transaction){
                transaction.executeSql("DELETE FROM Item", [],
                                       function() { successCallback(); }, 
                                       function(transaction, error) { failureCallback('Unable to delete all items:' + error.code); });
        });
    };

    exports.updateItem = function(item, failureCallback){
        db.transaction(function(transaction){
            transaction.executeSql("UPDATE Item SET checked=? WHERE description = ?", 
                                   [ item.checked, item.description],
                                   null,
                                   function(transaction, error){
                                       failureCallback(error.message);
                                   });
        });
    };
    
    exports.findItem = function(description, successCallback, failureCallback){
        db.transaction(function(transaction){
            transaction.executeSql("SELECT * FROM Item WHERE description = ?", 
                                   [ description],
                                   function(transaction, result){
                                       if ( result.rows.length == 1 ) {
                                            successCallback(new domain.Item(result.rows.item(0).description, JSON.parse(result.rows.item(0).checked)));
                                       } else {
                                            failureCallback('Cannot find item with description' + description);
                                       }
                                   },
                                   function(transaction, error){
                                       failureCallback(error.message);
                                   });
        });        
    };
 
    var createDatabase = function(){
        db.transaction(function(transaction){            
            var createItem = "";
            createItem += "CREATE TABLE Item (";
            createItem += "     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,";
            createItem += "     description VARCHAR(20) NOT NULL UNIQUE,";
            createItem += "     checked CHAR(1)";
            createItem += ")";
            transaction.executeSql(createItem, [], 
                                   function(){ dbReady = true; }, 
                                   function(transaction, error){ 
                                       alert('Unable to create groceries db:' + error.message); 
                                   });
        });
    };


});