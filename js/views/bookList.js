/**
 * Created by Такси on 15.07.15.
 */
/**
 * Created by Такси on 13.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.views = window.biblio.views || {};
window.biblio.views.bookList = (function(){
    var controller;
    var vmSearchForm = {};
    var viewModel;
    var autoAuthor;
    var autoTitle;

    var searchHandler = function(){
        controller.onSearchBtnPressed()
    };

    var addHandler = function(){
        controller.onAddBtnPressed()
    };

    var bookActionHandler = function(evt){
        var button = biblio.services.html.findNearestByTag(evt.target, "BUTTON", "LI");
        if (button) {
            controller.onActionButtonPressed(button.dataset["action"], button.dataset["bookId"]);
        }
    };

    var show = function(isShow) {
        document.getElementById("section-books-book-list").style.display = isShow ? "block" : "none";
    };

    var handlers = [
        {selector: "#bsf-search-btn", event: "click", handler: searchHandler},
        {selector: "#bsf-add-btn", event: "click", handler: addHandler},
        {selector: "ul.book-list", event: "click", handler: bookActionHandler}

    ];

    var init = function(aController){
        controller = aController;
        show(true);
        biblio.services.html.viewModelBind("#book-search-form input", vmSearchForm);
        biblio.services.html.eventBind(handlers);
        autoAuthor = new Autocomplete(document.getElementById("bsf-author"), controller.authorSource);
        autoTitle = new Autocomplete(document.getElementById("bsf-title"), controller.titleSource);
    };

    var getViewModel = function(){
        return {
            searchParameters: biblio.services.html.clone(vmSearchForm),
            books: viewModel && viewModel.books ? viewModel.books : []
        };
    };

    var renderBookList = function(bookList) {
        var list = document.getElementsByClassName("book-list")[0];
        var innerListText = "";
        bookList.sort(function(a, b){
            if (a.author < b.author) {
                return -1;
            } else if (a.author == b.author) {
                return 0;
            } else {
                return 1;
            }
        });
        bookList.forEach(function(book){
            var itemText = biblio.services.html.parseTemplate("book-item-template", book);
            innerListText += itemText;
        });
        list.innerHTML = innerListText;
    };

    var setViewModel = function(vm){
        viewModel = vm;
        biblio.services.html.extend(vmSearchForm, vm ? vm.searchParameters : {});
        renderBookList(vm && vm.books ? vm.books : []);
    };

    var freeView = function(){
        autoAuthor.remove();
        autoTitle.remove();
    };


    return {
        init: init,
        show: show,
        getViewModel: getViewModel,
        setViewModel: setViewModel,
        freeView: freeView
    }
})();