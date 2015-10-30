/**
 * Created by Такси on 15.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.bookIssue = (function(){
    var view;
    var router;
    var parameters;
    var lastBookSearch = {};
    var lastAllowState;
    var lastSearchResult;
    var start = function(aView, aRouter, aParameters){
        view = aView;
        router = aRouter;
        parameters = aParameters;
        view.init(this);
    };

    var authorSource = function(sample, clueHandler){
        var vm = view.getViewModel();
        parameters.storage.getAuthor(sample, vm.searchParameters.title, vm.searchParameters.year,
            function (authorList) {
                clueHandler(sample, authorList.sort())
            }
        );
    };

    var titleSource = function(sample, clueHandler){
        var vm = view.getViewModel();
        parameters.storage.getTitle(vm.searchParameters.author, sample, vm.searchParameters.year,
            function (titleList) {
                clueHandler(sample, titleList.sort())
            }
        );
    };

    var onSubmitBtnPressed = function(){
        var vm = view.getViewModel();
        if (vm.bookIssueList.length > 0) {
            parameters.storage.issueBooks(vm, function(){
                router.routeToHash("users:list", "Библиотека | Читатели", {}, true);
            });
        } else {
            router.routeToHash("users:list", "Библиотека | Читатели", {}, true);
        }
    };

    var onCancelBtnPressed = function(){
        router.goBack();
    };

    var onBookItemSelected = function(book){
        view.setStateEnterBookCount(book);
    };

    var deactivate = function(){
        view.freeView();
        view.show(false);
    };

    var fetchState = function(state) {
        view.setViewModel(state);
        view.setStateEnterBookAttr();
    };

    var isEnoughToSearch = function (searchParameters){
        return (searchParameters.author.length >= 2 && searchParameters.title.length >= 2)
            || searchParameters.author.length >= 4
            || searchParameters.title.length >= 4
            || searchParameters.isbn.length >=4;
    };

    var fireBookSearch = function (allowStateEnterBookCount) {
        var searchParameters = view.getBookSearchSample();
        if (!isEnoughToSearch(searchParameters)) {
            return;
        }

        if (biblio.services.html.isObjectsStrictEqual(lastBookSearch, searchParameters)) {
            if (lastSearchResult.length == 1 && allowStateEnterBookCount) {
                view.setStateEnterBookCount(lastSearchResult[0]);
            } else if (view.getState() == "enterbookattr"){
                view.setStateBookChoice(lastSearchResult);
            }
            return;
        }

        parameters.storage.findBooks(
            searchParameters,
            function (bookList) {
                lastAllowState = allowStateEnterBookCount;
                lastBookSearch = searchParameters;
                lastSearchResult = bookList;
                if (bookList.length == 1) {
                    if (allowStateEnterBookCount) {
                        view.setStateEnterBookCount(bookList[0]);
                    } else {
                        view.setStateBookChoice(bookList);
                    }
                } else if (bookList.length > 1){
                    view.setStateBookChoice(bookList);
                }
            }
        );
    };

    var bookAdd = function (book, amount) {
        view.addBookToIssueList(book, amount);
        view.setStateEnterBookAttr();
    };

    var onBookIssueRemove = function (bookIssueItem) {
        view.bookIssueRemove(bookIssueItem);
    };

    var getState = function(){
        return view.getViewModel();
    };

    return {
        start: start,
        onSubmitBtnPressed: onSubmitBtnPressed,
        onCancelBtnPressed: onCancelBtnPressed,
        deactivate: deactivate,
        fetchState: fetchState,
        authorSource: authorSource,
        titleSource: titleSource,
        fireBookSearch: fireBookSearch,
        onBookItemSelected: onBookItemSelected,
        bookAdd: bookAdd,
        onBookIssueRemove: onBookIssueRemove,
        getState: getState,
        uniqueId: "bookIssueCtrl"
    }
})();