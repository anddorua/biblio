/**
 * Created by Такси on 16.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.settings = (function(){
    var view;
    var router;
    var parameters;
    var start = function(aView, aRouter, aParameters){
        view = aView;
        router = aRouter;
        parameters = aParameters;
        view.init(this);
    };

    var checkInputValidity = function (vm) {
        if (router.getUser().requireChangePassword) {
            if (vm["password-new1"] != vm["password-new2"] || vm["password-new1"] == "") {
                router.showErrorMessage("Ввод нового пароля неверен, повторите ввод.");
                document.getElementById("os-password-new1").focus();
                return false;
            }
        } else {
            if (vm["password"] != "" && (vm["password-new1"] != vm["password-new2"] || vm["password-new1"] == "")) {
                router.showErrorMessage("Ввод нового пароля неверен, повторите ввод.");
                document.getElementById("os-password-new1").focus();
                return false;
            }
        }
        return true;
    };

    var dropErrorMessage = function () {
        router.showErrorMessage('');
    };

    var onSubmitBtnPressed = function(){
        var vm = view.getViewModel();
        // пароль меняется только тогда, когда введен старый пароль
        // тогда проверяем совпадение паролей
        if (!checkInputValidity(vm)) {
            return;
        }
        parameters.storage.operDataSave(
            vm,
            function(data){
                router.setUser(data.login, data.firstname, data.lastname, data.is_admin, false);
                router.goDefaultPage();
            }
        );
    };

    var deactivate = function(){
        view.show(false);
    };

    var fetchState = function(state) {
        parameters.storage.getOper({login: router.getUser().login}, function (data) {
            var vm = {
                login: data.login,
                firstname: data.firstname,
                lastname: data.lastname
            };
            view.setViewModel(vm);
        });
    };

    var getState = function(){
        return null;
    };

    return {
        start: start,
        onSubmitBtnPressed: onSubmitBtnPressed,
        deactivate: deactivate,
        fetchState: fetchState,
        getState: getState,
        dropErrorMessage: dropErrorMessage,
        uniqueId: "settingsCtrl"
    }
})();