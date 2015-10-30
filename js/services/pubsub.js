/**
 * Publish/Subscribe pattern module
 */

window.biblio = window.biblio || {};
window.biblio.services = window.biblio.services || {};
window.biblio.services.events = (function(){
    var subscribers = [];
    var publish = function(channel, data) {
        for(var i = 0; i < subscribers.length; i++) {
            if(subscribers[i].channel == channel) {
                subscribers[i].handles.forEach(function(handle){
                    handle(data || {});
                });
                break;
            }
        }
    };

    var subscribe = function(channel, handle) {
        for(var i = 0; i < subscribers.length && subscribers[i].channel != channel; i++) {
        }
        if (i == subscribers.length) {
            subscribers.push({channel: channel, handles: []});
        }
        if (subscribers[i].handles.indexOf(handle) == -1){
            subscribers[i].handles.push(handle);
        }
        return {
            remove: function(){
                for(var i = 0; i < subscribers.length; i++) {
                    if(subscribers[i].channel == channel) {
                        var index = subscribers[i].handles.indexOf(handle);
                        if (index != -1) {
                            subscribers[i].handles.splice(index, 1);
                        }
                        if (subscribers[i].handles.length == 0) {
                            subscribers.splice(i, 1);
                        }
                        break;
                    }
                }
            }
        }
    };

    return {
        publish: publish,
        subscribe: subscribe
    }
})();