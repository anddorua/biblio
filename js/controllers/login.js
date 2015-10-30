/**
 * Created by Такси on 16.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.login = (function(){
    var view;
    var router;
    var parameters;
    var start = function(aView, aRouter, aParameters){
        view = aView;
        router = aRouter;
        parameters = aParameters;
        view.init(this);
    };

    var onSubmitBtnPressed = function(){
        var vm = view.getViewModel();
        parameters.storage.auth(
            vm,
            function(data){
                if (data.isAuthenticated) {
                    router.setUser(data.login, data.firstname, data.lastname, data.isAdmin, data.requireChangePassword);
                    router.goDefaultPage();
                } else {
                    view.displayAuthFailMessage(true);
                }
            }
        );
    };

    var deactivate = function(){
        view.show(false);
    };

    var getState = function(){
        return view.getViewModel();
    };

    var fetchState = function(state) {
    };

    return {
        start: start,
        onSubmitBtnPressed: onSubmitBtnPressed,
        deactivate: deactivate,
        getState: getState,
        fetchState: fetchState,
        uniqueId: "loginCtrl"
    }
})();