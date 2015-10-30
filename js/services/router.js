/**
 * Created by Такси on 14.07.15.
 *
 * Роутер.
 * Осуществляет включение и выключение контроллеров в ответ на смену хэш-тэга
 * Переход по:
 * 1) вызов функции routeToHash(hash, data_for_controllers)
 * 2) перехов в ответ на смену хэша onhashchange
 *
 * Процесс перехода:
 * 1) деактивация неподходящих контроллеров
 * 2) установка нового хэша
 * 3) активация подходящих контроллеров
 * 4) передача всем контроллерам данных
 */
window.biblio = window.biblio || {};
window.biblio.services = window.biblio.services || {};
window.biblio.services.router = (function(){
    var app;
    var routes;
    var storage;
    var activeControllers = [];
    var user = {
        firstname: null,
        lastname: null,
        login: null,
        isAdmin: false,
        requireChangePassword: false
    };

    var setUser = function (login, firstname, lastname, isAdmin, requireChangePassword) {
        user.login = login;
        user.firstname = firstname;
        user.lastname = lastname;
        user.isAdmin = isAdmin;
        user.requireChangePassword = requireChangePassword;
    };

    var getUser = function(){
        return user;
    };

    var makeNormalizedHash = function(hash) {
        var normalizedHash = hash;
        if (hash[0] && hash[0] == "#") {
            normalizedHash = hash.substring(1);
        }
        return normalizedHash;
    };

    var getHashParts = function(hash) {
        return (makeNormalizedHash(hash) || "").split(":");
    };

    var hashChangeHandler = function() {
        console.log("onhashchange cought");
        routeToHash(window.location.hash, "", {}, false);
    };

    var popStateHandler = function() {
        console.log("onpopstate cought");
        //routeToHash(window.location.hash, "", {}, false);
    };

    var saveCurrentState = function () {
        var stateObject = {};
        activeControllers.forEach(function(ctrl){
            if (ctrl.uniqueId) {
                stateObject[ctrl.uniqueId] = ctrl.getState();
            }
        });
        window.history.replaceState(JSON.parse(JSON.stringify(stateObject)), null);
    };

    /**
     *
     * @param hash string destination
     * @param title string title of destination (weird, should be some predefined)
     * @param dataToPush object data, destination controller should read, usually contain state to use by destination controller
     * @param changeState bool do we need state changing, saving current state
     */
    var routeToHash = function(hash, title, dataToPush, changeState){
        var self = window.biblio.services.router;
        var normalizedHash = makeNormalizedHash(hash);
        // формируем объект текущего состояния
        if (changeState) {
            saveCurrentState();
        }
        // деактивируем активные контроллеры
        // 1) отбираем контроллеры, не подходящие под хэш
        var notFet = routes.filter(function(route){ return route.hash != normalizedHash; });
        // 2) деактивируем контроллеры
        notFet.forEach(function(notFetRoute){
            var ctrlPos = activeControllers.indexOf(notFetRoute.ctrl);
            if (ctrlPos >= 0) {
                if (notFetRoute.ctrl.deactivate) {
                    notFetRoute.ctrl.deactivate();
                }
                activeControllers.splice(ctrlPos, 1);
            }
        });

        // проверка аутентификации
        if (!user.login && normalizedHash != app.loginHash) {
            goLogin();
        } else if (user.requireChangePassword && normalizedHash != app.settingsHash) {
            routeToHash(app.settingsHash, "Бибилиотека | Настройки оператора", {}, true);
        } else {
            // подставляем хэш и данные
            if (changeState) {
                window.history.pushState(JSON.parse(JSON.stringify(dataToPush)), title, "#" + normalizedHash);
            }
            // активируем новые контроллеры либо дергаем старые
            routes.forEach(function(route){
                if (route.hash == normalizedHash) {
                    var ctrlIndex = activeControllers.indexOf(route.ctrl);
                    if (ctrlIndex < 0) {
                        route.ctrl.start(route.view, self, {storage: storage});
                        ctrlIndex = activeControllers.push(route.ctrl) - 1;
                    }
                    route.ctrl.fetchState(history.state ? history.state[activeControllers[ctrlIndex].uniqueId] : null);
                }
            });
        }
    };

    var appErrorHandler = function(msg){
        app.errorAlertController.displayError(msg);
    };

    var start = function(aApp, aRoutes, aStorage){
        app = aApp;
        routes = aRoutes;
        storage = aStorage;
        storage.setDefaultErrorHandler(appErrorHandler);
        window.addEventListener("hashchange", hashChangeHandler);
        window.addEventListener("popstate", popStateHandler);
        if (window.location.hash == "") {
            goDefaultPage();
        } else {
            hashChangeHandler();
        }
    };

    var goBack = function(){
        window.history.go(-1);
    };

    var showErrorMessage = function (msg) {
        app.errorAlertController.setStateVisible(msg);
    };

    var goLogin = function () {
        routeToHash(app.loginHash, "Вход", {}, true);
    };

    var goDefaultPage = function() {
        routeToHash("books:list", "Бибилиотека | Книги", {}, true);
    };

    var logout = function () {
        storage.logout(
            function(){
                goLogin();
            }
        );
    };

    return {
        start: start,
        routeToHash: routeToHash,
        getHashParts: getHashParts,
        goBack: goBack,
        showErrorMessage: showErrorMessage,
        goLogin: goLogin,
        goDefaultPage: goDefaultPage,
        setUser: setUser,
        getUser: getUser,
        logout: logout
    }
})();