/**
 * Created by Такси on 15.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.userList = (function(){
    var view;
    var router;
    var parameters;
    var start = function(aView, aRouter, aParameters){
        view = aView;
        router = aRouter;
        parameters = aParameters;
        view.init(this);
    };

    var onSearchBtnPressed = function(){
        var vm = view.getViewModel();
        parameters.storage.userSearch(vm.searchParameters["user-search-surname"], function(foundUsers){
            view.setViewModel({searchParameters: vm.searchParameters, users: foundUsers});
        });
    };

    var onAddBtnPressed = function(){
        router.routeToHash("#users:add", "Читатели | Новый", null, true);
    };

    var onActionButtonPressed = function(action, userId, user){
        switch (action) {
            case "edit":
                router.routeToHash("#users:add", "Читатели | Редактировать", {userAddCtrl:{userId: userId}}, true);
                break;
            case "out":
                router.routeToHash("#users:issue", "Читатели | Выдача", {bookIssueCtrl: {user: user}}, true);
                break;
            case "return":
                router.routeToHash("#users:return", "Читатели | Возврат", {bookReturnCtrl: {user: user}}, true);
                break;
            default:
                console.log(action, userId);
        }
    };

    var deactivate = function(){
        view.freeView();
        view.show(false);
    };

    var fetchState = function(state) {
        view.setViewModel(state);
    };

    var getState = function(){
        return view.getViewModel();
    };

    var userSource = function(sample, clueHandler){
        parameters.storage.userSearch(
            sample,
            function (userList) {
                clueHandler(sample, userList.map(function(item){return item.surname;}))
            }
        );
    };


    return {
        start: start,
        onSearchBtnPressed: onSearchBtnPressed,
        onAddBtnPressed: onAddBtnPressed,
        onActionButtonPressed: onActionButtonPressed,
        deactivate: deactivate,
        fetchState: fetchState,
        getState: getState,
        userSource: userSource,
        uniqueId: "userListCtrl"
    }
})();