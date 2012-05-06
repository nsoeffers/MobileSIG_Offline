define(["jquery", "exports", "domain"], function($, exports, domain) {
    "use strict";
        
    // Public function to show errorMessage
    exports.showError = function showError(message) {
        showMessage(message, 'error');
    };
    
    // Public function to show infoMessage
    exports.showInfo = function showInfo(message) {
        showMessage(message, 'info');
    };
    
    // Private function to show feedback message
    var showMessage = function showMessage(message, type){
        $('#feedbackZone').append('<div class="' + type + '">' + message + '<span class="delete">&#x2718;</span></div>');
        if ( $('#feedbackZone > div').size() > 0){
            $('.listContainer').css('top', '7em');
        }        
    };   
    
    // Private function add an Item (model) to the UI (view)
    var addItem = function(item){
        if ( $('.listContainer ul li.noItems').size() == 1 ){
            $('.listContainer ul').html('<li><input type="checkbox"' + (item.checked? 'checked' : '') + '/>' + item.description + '</li>');                
        } else {
            $('.listContainer ul').append('<li><input type="checkbox"' + (item.checked? 'checked' : '') + '/>' + item.description + '</li>');                
        }
        $('#newTask').val('');                 
    };

    // Private function to refresh the item list in the UI (view)
    var refreshItemList = function(){
        dao.retrieveItems(function(items){
            if ( !items || items === null || items.length === 0 ){
                $('.listContainer ul').html('<li class="noItems">No items stored yet, please add some</li>');
            } else {
                for(var index in items){
                    addItem(items[index]);
                }
            }
        });
    };
    
    var dao;
    
    // Public method which will be called from the controller
    exports.start = function(injectedDao){
        dao = injectedDao;
        var that = this;
        
        try { 
            dao.init();
        } catch (error){
            this.showError(error);
        }                    
        
        $('#newTask').keypress(function(event) {
            if ( event.which == 13 ) {            
                var item = new domain.Item($('#newTask').val(), false);
                dao.saveItem(item, 
                             function() { addItem(item); }, 
                             function(errorMessage) { that.showError(errorMessage); });
            }
        });
                
        $('input[type="checkbox"]').live('click', function(event) {
           dao.findItem($(event.target).parent().text(),
                        function(checkedItem){ // success callback
                           checkedItem.checked = event.target.checked;       
                           dao.updateItem(checkedItem, 
                                          function(errorMessage) { that.showError(errorMessage); });
                        },
                        function(errorMessage) { // failure callback
                           exports.showError(errorMessage);                                              
                        });
        });
        
        $('.clearAll').click(function(){
           dao.removeAllItems(function() { refreshItemList(); }, 
                              function(errorMessage) { that.showError(errorMessage); });
        });        
        
        $('#feedbackZone .delete').live('click', function(event){
           $(event.target).parent().detach();
            if ( $('#feedbackZone > div').size() === 0){
                $('.listContainer').css('top', '5em');
            }        
        });
        
        refreshItemList();
        $('.daoInfo').text(dao.daoDescription).css('display', 'block');
    };
        
});