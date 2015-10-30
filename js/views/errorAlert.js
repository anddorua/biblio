/**
 * Created by Такси on 13.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.errorAlert = (function(){
    var controller;
    var message;
    var clickHandler = function() {
        controller.alertTouch();
    };

    var setMessage = function(msg){
        message = msg;
        var container = document.querySelector("#section-error-alert div");
        container.innerHTML = message;
        show(true);
    };

    var handlers = [
        {selector: "#section-error-alert", event: "click", handler: clickHandler}
    ];

    var init = function(aController){
        controller = aController;
        biblio.services.html.eventBind(handlers);
        message = "";
    };

    var show = function(isShow) {
        document.querySelector("#section-error-alert").style.display = isShow && message ? "block" : "none";
    };

    return {
        init: init,
        setMessage: setMessage,
        show: show
    }
})();