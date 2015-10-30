/**
 * Created by Такси on 13.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.mainMenu = (function(){
    var controller;
    var booksHandler = function() {
        controller.booksPressed();
    };
    var usersHandler = function() {
        controller.usersPressed();
    };
    var settingsHandler = function() {
        controller.settingsPressed();
    };
    var logoutHandler = function() {
        controller.logoutPressed();
    };

    var getMenuItems = function(){
        var menuElement = document.querySelector("nav.navbar div ul.nav");
        return menuElement.querySelectorAll("li");
    };

    var switchMenuItemToActive = function(itToActive) {
        var allMenuItems = getMenuItems();
        for (var i = 0; i < allMenuItems.length; i++) {
            allMenuItems[i].className = allMenuItems[i].className.replace( /(?:^|\s)active(?!\S)/g , '' );
        }
        document.getElementById(itToActive).className += " active";
    };

    var setActiveItem = function(item){
        switch (item) {
            case 'books':
                switchMenuItemToActive("nav-menu-item-books");
                break;
            case 'users':
                switchMenuItemToActive("nav-menu-item-users");
                break;
            case 'settings':
                switchMenuItemToActive("nav-menu-item-settings");
                break;
            default:
                console.error("unexpected value o set active item in main menu:" + item);
        }
    };

    var handlers = [
        {selector: "#nav-books", event: "click", handler: booksHandler},
        {selector: "#nav-users", event: "click", handler: usersHandler},
        {selector: "#nav-settings", event: "click", handler: settingsHandler},
        {selector: "#nav-logout", event: "click", handler: logoutHandler}
    ];
    var init = function(aController){
        controller = aController;
        show(true);
        biblio.services.html.eventBind(handlers);
    };

    var show = function(isShow) {
        document.getElementById("top-nav-section").style.display = isShow ? "block" : "none";
    };

    var setOperName = function (fullname) {
        document.getElementById("nav-oper-name").innerHTML = fullname;
    };

    return {
        init: init,
        setActiveItem: setActiveItem,
        show: show,
        setOperName: setOperName
    }
})();