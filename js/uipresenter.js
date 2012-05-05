define(["jquery", "exports", "domain"], function($, exports, domain) {
    "use strict";
        
    // Public function to show errorMessage
    exports.showError = function showError(message) {
        this.showMessage(message, 'error');
    };
    
    // Public function to show infoMessage
    exports.showInfo = function showInfo(message) {
        this.showMessage(message, 'info');
    };
    
    // Private function to show feedback message
    this.showMessage = function showMessage(message, type){
        $('#feedbackZone').append('<div class="' + type + '">' + message + '<span class="delete">&#x2718;</span></div>');
        if ( $('#feedbackZone > div').size() > 0){
            $('.listContainer').css('top', '7em');
        }        
    };   
    
    // Private function add an Item (model) to the UI (view)
    this.addItem = function(item){
        if ( $('.listContainer ul li.noItems').size() == 1 ){
            $('.listContainer ul').html('<li><input type="checkbox"' + (item.checked? 'checked' : '') + '/>' + item.description + '</li>');                
        } else {
            $('.listContainer ul').append('<li><input type="checkbox"' + (item.checked? 'checked' : '') + '/>' + item.description + '</li>');                
        }
        $('#newTask').val('');                 
    };

    // Private function to refresh the item list in the UI (view)
    this.refreshItemList = function(){
        try {
            var items = this.dao.retrieveItems();
            for(var index in items){
                this.addItem(items[index]);
            }
        } catch (error){
            this.showError(error);
        }        
    };
    
    // Public method which will be called from the controller
    exports.start = function(dao){
        this.dao = dao;
        var that = this;
        
        $('#newTask').keypress(function(event) {
            if ( event.which == 13 ) {            
                var item = new domain.Item($('#newTask').val(), false);
                try {
                    dao.saveItem(item);
                    that.addItem(item);
                } catch (error ){
                    that.showError(error);
                }
            }
        });
        
        $('input[type="checkbox"]').live('click', function(event) {
           var checkedItem = dao.findItem($(event.target).parent().text());
           if( checkedItem === null){
               exports.showError('Cannot find item with description' + $(event.target).parent().text());
           }
           checkedItem.checked = event.target.checked;       
           dao.syncItems();
        });
        
        $('.clearAll').click(function(){
           dao.removeAllItems();
           that.refreshItemList();
        });        
        
        $('#feedbackZone .delete').live('click', function(event){
           $(event.target).parent().detach();
            if ( $('#feedbackZone > div').size() === 0){
                $('.listContainer').css('top', '5em');
            }        
        });
        
        this.refreshItemList();
    };
        
});