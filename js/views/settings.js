/**
 * Created by Такси on 16.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.settings = (function(){
    var controller;
    var vmOper = {};

    var submitHandler = function(){
        controller.onSubmitBtnPressed()
    };

    var passInputHandler = function(){
        controller.dropErrorMessage();
    };

    var show = function(isShow) {
        document.getElementById("oper-settings-section").style.display = isShow ? "block" : "none";
    };

    var handlers = [
        {selector: "#os-submit", event: "click", handler: submitHandler},
        {selector: "#settings-form", event: "submit", handler: submitHandler},
        {selector: "#os-password-new1", event: "change", handler: passInputHandler},
        {selector: "#os-password-new2", event: "change", handler: passInputHandler}
    ];

    var getViewModel = function(){
        return vmOper;
    };

    var setViewModel = function(vm){
        biblio.services.html.extendStrict(vmOper, vm);
        vmOper["password"] = "";
        vmOper["password-new1"] = "";
        vmOper["password-new2"] = "";
    };

    var init = function(aController){
        controller = aController;
        show(true);
        biblio.services.html.viewModelBind("#settings-form input", vmOper);
        biblio.services.html.eventBind(handlers);
    };

    return {
        init: init,
        show: show,
        getViewModel: getViewModel,
        setViewModel: setViewModel
    }
})();