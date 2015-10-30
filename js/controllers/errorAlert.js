/**
 * Created by Такси on 14.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.errorAlert = (function(){
    var view;
    var router;
    var message;
    var start = function(aView, aRouter){
        view = aView;
        router = aRouter;
        message = "";
        view.init(this);
    };

    var alertTouch = function(){
        setStateHidden();
    };

    var setStateHidden = function () {
        message = "";
        view.setMessage(message);
    };

    var setStateVisible = function (msg) {
        message = msg;
        view.setMessage(message);
    };

    var fetchState = function(state) {
        if (state) {
            setStateVisible(state);
        } else {
            setStateHidden();
        }
    };

    var getState = function(){
        return message;
    };

    var deactivate = function(){
        view.show(false);
    };

    var displayError = function(msg){
        fetchState(msg);
    };

    return {
        start: start,
        alertTouch: alertTouch,
        deactivate: deactivate,
        fetchState: fetchState,
        getState: getState,
        setStateVisible: setStateVisible,
        displayError: displayError,
        uniqueId: "errorAlertCtrl"
    }
})();