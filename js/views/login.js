/**
 * Created by Такси on 16.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.login = (function(){
    var controller;
    var vmLogin = {};

    var submitHandler = function(){
        controller.onSubmitBtnPressed()
    };

    var failAlertClickHandler = function () {
        displayAuthFailMessage(false);
    };

    var show = function(isShow) {
        document.getElementById("section-login").style.display = isShow ? "block" : "none";
    };

    var handlers = [
        {selector: "#lf-submit", event: "click", handler: submitHandler},
        {selector: "#lf-form", event: "submit", handler: submitHandler},
        {selector: "#lf-fail-alert", event: "click", handler: failAlertClickHandler}
    ];

    var getViewModel = function(){
        return vmLogin;
    };

    var init = function(aController){
        controller = aController;
        show(true);
        displayAuthFailMessage(false);
        biblio.services.html.viewModelBind("#lf-form input", vmLogin);
        biblio.services.html.eventBind(handlers);
    };

    var displayAuthFailMessage = function (isShow) {
        document.getElementById("lf-fail-alert").style.display = isShow ? "block" : "none";
    };

    return {
        init: init,
        show: show,
        getViewModel: getViewModel,
        displayAuthFailMessage: displayAuthFailMessage
    }
})();