/**
 * Created by Такси on 14.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.mainMenu = (function(){
    var view;
    var router;
    var activeItem;
    var start = function(aView, aRouter){
        view = aView;
        router = aRouter;
        view.init(this);
    };

    var booksPressed = function(){
        router.routeToHash("books:list", "Библиотека | Книги", {}, true);
    };

    var usersPressed = function(){
        router.routeToHash("users:list", "Библиотека | Читатели", {}, true);
    };

    var settingsPressed = function(){
        router.routeToHash("settings", "Библиотека | Настройки оператора", {}, true);
    };

    var logoutPressed = function(){
        router.logout();
    };

    var fetchState = function(state) {
        if (state && state.length > 0) {
            activeItem = state;
        } else {
            var hp = router.getHashParts(window.location.hash);
            activeItem = hp[0] || "";
        }
        view.setActiveItem(activeItem);
        view.setOperName(router.getUser().firstname + " " + router.getUser().lastname);
    };

    var getState = function(){
        return activeItem;
    };

    var deactivate = function(){
        view.show(false);
    };

    return {
        start: start,
        booksPressed: booksPressed,
        usersPressed: usersPressed,
        deactivate: deactivate,
        fetchState: fetchState,
        getState: getState,
        settingsPressed: settingsPressed,
        logoutPressed: logoutPressed,
        uniqueId: "mainMenuCtrl"
    }
})();