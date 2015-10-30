/**
 * Created by Такси on 16.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.userAdd = (function(){
    var controller;
    var bookSection;
    var vmUser = {};

    var submitHandler = function(){
        controller.onSubmitBtnPressed()
    };

    var cancelHandler = function(){
        controller.onCancelBtnPressed()
    };

    var show = function(isShow) {
        document.getElementById("user-form").style.display = isShow ? "block" : "none";
    };

    var renderBooksSection = function(issueList){
        if (issueList && issueList.length > 0) {
            var innerListText = "";
            issueList.forEach(function(issueEntry){
                var data = {};
                data.bookId = issueEntry.book.id;
                data.issueDate = issueEntry.when;
                data.when = issueEntry.when;
                data.amount = issueEntry.amount;
                data.description = issueEntry.book.getDescription();
                var itemText = biblio.services.html.parseTemplate("user-book-item-template", data);
                innerListText += itemText;
            });
            bookSection.innerHTML = innerListText;
        } else {
            bookSection.innerHTML = "";
        }
    };



    var handlers = [
        {selector: "#uf-submit", event: "click", handler: submitHandler},
        {selector: "#uf-cancel", event: "click", handler: cancelHandler},
        {selector: "#user-form-form", event: "submit", handler: submitHandler}
    ];

    var init = function(aController){
        controller = aController;
        show(true);
        bookSection = document.getElementById("user-books-table");
        biblio.services.html.viewModelBind("#user-form-form input", vmUser);
        biblio.services.html.eventBind(handlers);
    };

    var getViewModel = function(){
        return {
            user: biblio.services.html.extendStrict(new biblio.models.UserItem(), vmUser)
        };
    };

    var setViewModel = function(vm){
        if (vm) {
            biblio.services.html.extend(vmUser, vm.user);
            renderBooksSection(vm.books);
        } else {
            biblio.services.html.emptyObject(vmUser);
        }
    };

    return {
        init: init,
        show: show,
        getViewModel: getViewModel,
        setViewModel: setViewModel
    }
})();