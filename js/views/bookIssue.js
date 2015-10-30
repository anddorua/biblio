/**
 * Created by Такси on 15.07.15.
 */
/**
 * Created by Такси on 13.07.15.
 *
 * Поиск книги происходит в случае если:
 * - в поле автор и название не менее двух букв в каждом поле и суммарная длина не менее 6 символов
 * - в поле isbn не менее 4 символов
 * Запуск поиска происходит когда последняя буква нажата более 1 секунды назад
 * или по переходу между полями или по выбору в полях автор и название (при выборе пункта автозаполнения)
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.bookIssue = (function(){
    var controller;
    var vmUserForm = {};
    var autoAuthor;
    var autoTitle;
    var viewModel;
    var vmUser;
    var lastKeyPressedTime;
    var bookCountSection;
    var bookChoiceSection;
    var bookChoiceListSection;
    var bookIssueSection;
    var bookIssueListSection;
    var bookChoiceList;
    var bookToIssue;
    var bookIssueList = [];
    var currentState;
    var bookAttrFields = ["#uif-author", "#uif-title", "#uif-year", "#uif-isbn"];

    /**
     * carrentState can be:
     * "enterbookattr" - form in write mode, book count and book controls hidden
     * "bookchoice" - same as "enterbookattr", but book list active with list of several books
     * "enterbookcount" - book found, book attr fields are readonly, book count and controls are active
     */
    var setStateEnterBookAttr = function () {
        bookCountSection.style.display = "none";
        bookChoiceSection.style.display = "none";
        biblio.services.html.setReadOnly(bookAttrFields, false);
        clearSearchForm();
        document.getElementById("uif-author").focus();
        currentState = "enterbookattr";
    };

    var setStateBookChoice = function (bookList){
        bookChoiceList = bookList;
        bookCountSection.style.display = "none";
        bookChoiceSection.style.display = "block";
        biblio.services.html.setReadOnly(bookAttrFields, false);
        renderBookChoiceSection(bookList);
        currentState = "bookchoice";
    };

    var setStateEnterBookCount = function(book){
        bookToIssue = book;
        bookCountSection.style.display = "block";
        bookChoiceSection.style.display = "none";
        biblio.services.html.setReadOnly(bookAttrFields, true);
        setSearchForm(book);
        var amountField = document.getElementById("uif-amount");
        amountField.setAttribute("min", 1);
        amountField.setAttribute("max", book.storeCount);
        amountField.focus();
        vmUserForm.amount = 1;
        currentState = "enterbookcount";
    };

    var renderBookChoiceSection = function(bookList){
        if (bookList.length > 0) {
            var innerListText = "";
            bookList.forEach(function(book){
                var itemText = biblio.services.html.parseTemplate("ui-book-item-to-choose-template", book);
                innerListText += itemText;
            });
            bookChoiceListSection.innerHTML = innerListText;
        } else {
            bookChoiceListSection.innerHTML = "";
        }
    };

    var renderBookIssueSection = function(bookList){
        if (bookList.length > 0) {
            var innerListText = "";
            bookList.forEach(function(bookEntry){
                var data = biblio.services.html.clone(bookEntry.book);
                biblio.services.html.extend(data, {amount: bookEntry.amount});
                var itemText = biblio.services.html.parseTemplate("ui-book-item-to-issue-template", data);
                innerListText += itemText;
            });
            bookIssueListSection.innerHTML = innerListText;
        } else {
            bookIssueListSection.innerHTML = "";
        }
    };

    var clearSearchForm = function(){
        vmUserForm.bookId = "";
        vmUserForm.author = "";
        vmUserForm.title = "";
        vmUserForm.year = "";
        vmUserForm.isbn = "";
        vmUserForm.amount = "";
    };

    var setSearchForm = function(book){
        vmUserForm.bookId = book.id;
        vmUserForm.author = book.author;
        vmUserForm.title = book.title;
        vmUserForm.year = book.year;
        vmUserForm.isbn = book.isbn;
    };

    var submitHandler = function(e){
        controller.onSubmitBtnPressed();
    };

    var cancelHandler = function(e){
        controller.onCancelBtnPressed()
    };

    var choiceHandler = function(e) {
        if (currentState == "enterbookattr" || currentState == "bookchoice") {
            controller.fireBookSearch(true);
        }
    };

    var keyHandler = function () {
        lastKeyPressedTime = new Date();
        setTimeout( checkBookSearch, 1000);
    };

    var bookAddHandler = function(e){
        if (currentState == "enterbookcount" && vmUserForm.amount > 0) {
            controller.bookAdd(bookToIssue, vmUserForm.amount);
        }
    };

    var bookCancelHandler = function(){
        clearSearchForm();
        setStateEnterBookAttr();
    };

    var bookClickHandler = function(e){
        var item = biblio.services.html.findNearestByTag(e.target, "LI", "UL");
        if (item) {
            var book = bookChoiceList.filter(
                function(bookItem){return bookItem.id == item.dataset["bookId"];}
            );
            controller.onBookItemSelected(book[0]);
        }
    };

    var bookListHandler = function(e){
        var item = biblio.services.html.findNearestByTag(e.target, "BUTTON", "UL");
        if (item) {
            var book = bookIssueList.filter(
                function(bookEntry){return bookEntry.book.id == item.dataset["bookId"];}
            );
            controller.onBookIssueRemove(book[0]);
        }
    };

    var handlers = [
        {selector: "#uif-submit", event: "click", handler: submitHandler},
        {selector: "#uif-cancel", event: "click", handler: cancelHandler},
        {selector: "#uif-book-add", event: "click", handler: bookAddHandler},
        {selector: "#uif-book-cancel", event: "click", handler: bookCancelHandler},
        {selector: "#user-issue-form", event: "cluechosen", handler: function(e){
            choiceHandler();
        }},
        {selector: "#user-issue-form", event: "keypress", handler: keyHandler},
        {selector: "#user-issue-form", event: "submit", handler: function(e){
            e.preventDefault();
            choiceHandler();
        }},
        {selector: "#uif-author", event: "focus", handler: choiceHandler},
        {selector: "#uif-title", event: "focus", handler: choiceHandler},
        {selector: "#uif-year", event: "focus", handler: choiceHandler},
        {selector: "#uif-isbn", event: "focus", handler: choiceHandler},
        {selector: "#ui-book-choice", event: "click", handler: bookClickHandler},
        {selector: "#ui-book-list ul", event: "click", handler: bookListHandler}
    ];

    var checkBookSearch = function(){
        if ((new Date()) - lastKeyPressedTime >= 1000) {
            if (currentState == "enterbookattr" || currentState == "bookchoice") {
                controller.fireBookSearch(false);
            }
        }
    };

    var show = function(isShow) {
        document.getElementById("user-issue").style.display = isShow ? "block" : "none";
    };

    var init = function(aController){
        controller = aController;
        bookIssueList = [];
        show(true);
        bookCountSection = document.getElementById("uif-book-count-section");
        bookChoiceSection = document.getElementById("ui-book-choice");
        bookChoiceListSection = document.querySelector("#ui-book-choice ul");
        bookIssueSection = document.getElementById("ui-book-list");
        bookIssueListSection = document.querySelector("#ui-book-list ul");

        biblio.services.html.viewModelBind("#user-issue-form input", vmUserForm);
        biblio.services.html.eventBind(handlers);
        autoAuthor = new Autocomplete(document.getElementById("uif-author"), controller.authorSource);
        autoTitle = new Autocomplete(document.getElementById("uif-title"), controller.titleSource);
    };

    var getViewModel = function(){
        return {
            user: biblio.services.html.clone(vmUser),
            searchParameters: biblio.services.html.clone(vmUserForm),
            bookIssueList: bookIssueList
        };
    };

    var setViewModel = function(vm){
        viewModel = vm;
        vmUser = biblio.services.html.extendStrict(new biblio.models.UserItem(), vm ? vm.user : {});
        vmUserForm.userId = vmUser.id;
        vmUserForm.fullname = vmUser.getFullName();
        vmUserForm.bookId = viewModel && viewModel.searchParameters ? viewModel.searchParameters.bookId : "";
        vmUserForm.author = viewModel && viewModel.searchParameters ? viewModel.searchParameters.author : "";
        vmUserForm.title = viewModel && viewModel.searchParameters ? viewModel.searchParameters.title : "";
        vmUserForm.year = viewModel && viewModel.searchParameters ? viewModel.searchParameters.year : "";
        vmUserForm.isbn = viewModel && viewModel.searchParameters ? viewModel.searchParameters.isbn : "";
        bookIssueList = viewModel && viewModel.bookIssueList ? viewModel.bookIssueList : [];
        renderBookIssueSection(bookIssueList);
    };

    var freeView = function(){
        autoAuthor.remove();
        autoTitle.remove();
    };

    var getBookSearchSample = function(){
        var result = {};
        result.author = document.getElementById("uif-author").value;
        result.title = document.getElementById("uif-title").value;
        result.year = document.getElementById("uif-year").value;
        result.isbn = document.getElementById("uif-isbn").value;
        return result;
    };

    var getBookChoiceList = function(){
        return bookChoiceList;
    };

    var addBookToIssueList = function(book, amount){
        bookIssueList.push({book: book, amount: amount});
        renderBookIssueSection(bookIssueList);
    };

    var bookIssueRemove = function(bookIssueItem) {
        var i = bookIssueList.indexOf(bookIssueItem);
        bookIssueList.splice(i, 1);
        renderBookIssueSection(bookIssueList);
    };

    return {
        init: init,
        show: show,
        getViewModel: getViewModel,
        setViewModel: setViewModel,
        freeView: freeView,
        setStateEnterBookAttr: setStateEnterBookAttr,
        setStateBookChoice: setStateBookChoice,
        setStateEnterBookCount: setStateEnterBookCount,
        getBookSearchSample: getBookSearchSample,
        getBookChoiceList: getBookChoiceList,
        addBookToIssueList: addBookToIssueList,
        bookIssueRemove: bookIssueRemove,
        getState: function(){return currentState;}
    }
})();