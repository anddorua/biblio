/**
 * Created by Такси on 15.07.15.
 */
/**
 * Created by Такси on 13.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.userList = (function(){
    var controller;
    var vmSearchForm = {};
    var viewModel;
    var autoUser;

    var searchHandler = function(){
        controller.onSearchBtnPressed()
    };

    var addHandler = function(){
        controller.onAddBtnPressed()
    };

    var getUserFromModel = function (id) {
        var userForAction = undefined;
        for (var i = 0; i < viewModel.users.length; i++){
            if (viewModel.users[i].id == id) {
                userForAction = viewModel.users[i];
                break;
            }
        }
        return userForAction;
    };

    var userActionHandler = function(evt){
        var button = biblio.services.html.findNearestByTag(evt.target, "BUTTON", "LI");
        if (button) {
            controller.onActionButtonPressed(button.dataset["action"], button.dataset["userId"], getUserFromModel(button.dataset["userId"]));
        }
    };

    var show = function(isShow) {
        document.getElementById("section-user-list").style.display = isShow ? "block" : "none";
    };

    var handlers = [
        {selector: "#usf-search-btn", event: "click", handler: searchHandler},
        {selector: "#usf-add-btn", event: "click", handler: addHandler},
        {selector: "ul.user-list", event: "click", handler: userActionHandler}
    ];

    var init = function(aController){
        controller = aController;
        show(true);
        biblio.services.html.viewModelBind("#user-search-form input", vmSearchForm);
        biblio.services.html.eventBind(handlers);
        autoUser = new Autocomplete(document.getElementById("usf-surname"), controller.userSource);
    };

    var getViewModel = function(){
        return {
            searchParameters: biblio.services.html.clone(vmSearchForm),
            users: viewModel.users || []
        };
    };

    var renderUserList = function(userList){
        var innerListText = "";
        userList.sort(function(a, b){
            if (a.surname < b.surname) {
                return -1;
            } else if (a.surname == b.surname) {
                return 0;
            } else {
                return 1;
            }
        });
        userList.forEach(function(user){
            var u = biblio.services.html.extend(new biblio.models.UserItem(), user);
            user.userName = u.getFullName();
            innerListText += biblio.services.html.parseTemplate("user-item-template", user);
        });
        document.getElementsByClassName("user-list")[0].innerHTML = innerListText;
    };

    var setViewModel = function(vm){
        viewModel = vm || {};
        biblio.services.html.extend(vmSearchForm, vm ? vm.searchParameters : {});
        renderUserList(vm && vm.users ? vm.users : []);
    };

    var freeView = function(){
        autoUser.remove();
    };

    return {
        init: init,
        show: show,
        getViewModel: getViewModel,
        setViewModel: setViewModel,
        freeView: freeView
    }
})();