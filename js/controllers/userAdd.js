/**
 * Created by Такси on 16.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.userAdd = (function(){
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
        parameters.storage.userSave(
            vm,
            function(){
                router.routeToHash("#users:list", "Читатели | Поиск", null, true);
            }
        );
    };

    var onCancelBtnPressed = function(){
        router.goBack();
    };

    var deactivate = function(){
        view.show(false);
    };

    var fetchState = function(state) {
        if ((state && state.userId) || (state && state.user && state.user.id)) {
            var userId = state && state.userId ? state.userId : state.user.id;
            parameters.storage.getUser(
                userId,
                function(user){
                    parameters.storage.getUserBooks(user.id, function(userBooks){
                        view.setViewModel({user: user, action: "edit", books: userBooks});
                    });
                }
            );
        } else {
            view.setViewModel(state)
        }
    };

    var getState = function(){
        return view.getViewModel();
    };

    return {
        start: start,
        onSubmitBtnPressed: onSubmitBtnPressed,
        onCancelBtnPressed: onCancelBtnPressed,
        deactivate: deactivate,
        fetchState: fetchState,
        getState: getState,
        uniqueId: "userAddCtrl"
    }
})();