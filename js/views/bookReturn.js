/**
 * Created by Такси on 15.07.15.
 */
/**
 * Created by Такси on 13.07.15.
 *
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.bookReturn = (function(){
    var controller;
    var viewModel;
    var vmUser;
    var vmUserForm = {};
    var bookIssueListSection;
    var bookIssueList = [];

    var renderBookIssueSection = function(bookList){
        if (bookList.length > 0) {
            var innerListText = "";
            bookList.forEach(function(bookEntry){
                var data = {};
                var book = biblio.services.html.extendStrict(new biblio.models.BookItem(), bookEntry.book);
                data.bookId = book.id;
                data.description = book.getDescription();
                data.maxAmount = bookEntry.amount;
                data.amount = bookEntry.returnAmount;
                var itemText = biblio.services.html.parseTemplate("ur-book-item-to-return-template", data);
                innerListText += itemText;
            });
            bookIssueListSection.innerHTML = innerListText;
        } else {
            bookIssueListSection.innerHTML = "";
        }
    };

    var submitHandler = function(){
        controller.onSubmitBtnPressed();
    };

    var cancelHandler = function(){
        controller.onCancelBtnPressed()
    };

    var changeBookIssueList = function(bookId, newReturnValue) {
        bookIssueList[getIssueListIndex(bookId)].returnAmount = Number.parseInt(newReturnValue);
    };

    var getIssueListIndex = function(bookId) {
        for (var i = 0; i < bookIssueList.length; i++) {
            if (bookIssueList[i].book.id == bookId) {
                return i;
            }
        }
        return -1;
    };

    var setIssueListColor = function(){
        var node = bookIssueListSection.firstChild;
        while (node) {
            if (node.nodeName == "LI") {
                var inputElement = node.getElementsByTagName("INPUT")[0];
                var i = getIssueListIndex(inputElement.dataset.bookId);
                if (bookIssueList[i].returnAmount > 0) {
                    node.classList.add("non-empty-return");
                } else {
                    node.classList.remove("non-empty-return");
                }
            }
            node = node.nextSibling;
        }
    };

    var bookChangeHandler = function(e){
        changeBookIssueList(e.target.dataset.bookId, e.target.value);
        setIssueListColor();
    };

    var bookClickHandler = function(e){
        var item = biblio.services.html.findNearestByTag(e.target, "LI", "UL");
        if (item && e.target.nodeName != "INPUT") {
            var inputElement = item.getElementsByTagName("INPUT")[0];
            var newValue = Number.parseInt(inputElement.value) + 1;
            var max = Number.parseInt(inputElement.getAttribute("max"));
            newValue = Math.min(newValue, max);
            inputElement.value = newValue;
            changeBookIssueList(inputElement.dataset.bookId, newValue);
            setIssueListColor();
            e.preventDefault();
        }
    };

    var bookDblClickHandler = function(e){
        var item = biblio.services.html.findNearestByTag(e.target, "LI", "UL");
        if (item && e.target.nodeName != "INPUT") {
            var inputElement = item.getElementsByTagName("INPUT")[0];
            inputElement.value = 0;
            changeBookIssueList(inputElement.dataset.bookId, 0);
            setIssueListColor();
            e.preventDefault();
        }
    };

    var handlers = [
        {selector: "#urf-submit", event: "click", handler: submitHandler},
        {selector: "#urf-cancel", event: "click", handler: cancelHandler},
        {selector: "#ur-book-list", event: "change", handler: bookChangeHandler},
        {selector: "#ur-book-list", event: "click", handler: bookClickHandler},
        {selector: "#ur-book-list", event: "dblclick", handler: bookDblClickHandler, capture: true}
    ];

    var show = function(isShow) {
        document.getElementById("user-return").style.display = isShow ? "block" : "none";
    };

    var init = function(aController){
        controller = aController;
        bookIssueList = [];
        show(true);
        bookIssueListSection = document.querySelector("#ur-book-list ul");
        biblio.services.html.viewModelBind("#user-return-form input", vmUserForm);
        biblio.services.html.eventBind(handlers);
    };

    var getViewModel = function(){
        return {
            user: vmUser,
            bookIssueList: bookIssueList
        };
    };

    var setViewModel = function(vm){
        viewModel = vm;
        vmUser = biblio.services.html.extendStrict(new biblio.models.UserItem(), vm ? vm.user : {});
        vmUserForm.userId = vmUser.id;
        vmUserForm.fullname = vmUser.getFullName();
        bookIssueList = vm && vm.bookIssueList ? vm.bookIssueList : [];
        renderBookIssueSection(bookIssueList);
        setIssueListColor();
    };

    return {
        init: init,
        show: show,
        getViewModel: getViewModel,
        setViewModel: setViewModel
    }
})();