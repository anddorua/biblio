/**
 * Created by Такси on 16.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.bookAdd = (function(){
    var controller;
    var vmBook = {};
    var bookHoldersTableSection;

    var submitHandler = function(){
        controller.onSubmitBtnPressed()
    };

    var cancelHandler = function(){
        controller.onCancelBtnPressed()
    };

    var show = function(isShow) {
        document.getElementById("book-form").style.display = isShow ? "block" : "none";
    };

    var handlers = [
        {selector: "#bf-submit", event: "click", handler: submitHandler},
        {selector: "#bf-cancel", event: "click", handler: cancelHandler},
        {selector: "#book-form-form", event: "submit", handler: submitHandler}
    ];

    var getViewModel = function(){
        return {
            book: biblio.services.html.extendStrict(new biblio.models.BookItem(), vmBook),
            parameters: {
                adding: vmBook.adding,
                comment: vmBook.comment
            }
        };
    };

    var setViewModel = function(vm){
        if (vm) {
            biblio.services.html.extendStrict(vmBook, vm.book);
            biblio.services.html.extendStrict(vmBook, vm.parameters);
            vmBook.adding = "";
            renderHoldersSection(vm.holders || []);
        } else {
            biblio.services.html.emptyObject(vmBook);
        }
    };

    var init = function(aController){
        controller = aController;
        show(true);
        bookHoldersTableSection = document.getElementById("book-holders-table");
        biblio.services.html.viewModelBind("#book-form-form input", vmBook);
        biblio.services.html.eventBind(handlers);
    };

    var renderHoldersSection = function(holderList){
        if (holderList.length > 0) {
            var innerListText = "";
            holderList.forEach(function(holderEntry){
                var data = {};
                data.userId = holderEntry.userId;
                data.issueDate = holderEntry.when;
                data.when = holderEntry.when;
                data.amount = holderEntry.amount;
                data.reader = holderEntry.user.getFullName();
                var itemText = biblio.services.html.parseTemplate("book-holder-item-template", data);
                innerListText += itemText;
            });
            bookHoldersTableSection.innerHTML = innerListText;
        } else {
            bookHoldersTableSection.innerHTML = "";
        }
    };

    return {
        init: init,
        show: show,
        getViewModel: getViewModel,
        setViewModel: setViewModel
    }
})();