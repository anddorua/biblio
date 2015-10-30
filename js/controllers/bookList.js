/**
 * Created by Такси on 15.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.bookList = (function(){
    var view;
    var router;
    var parameters;
    var start = function(aView, aRouter, aParameters){
        view = aView;
        router = aRouter;
        parameters = aParameters;
        view.init(this);
    };

    var onSearchBtnPressed = function(){
        var vm = view.getViewModel();
        parameters.storage.bookSearch(vm.searchParameters, function(foundBooks){
            vm.books = foundBooks;
            view.setViewModel(vm);
        });
    };

    var onAddBtnPressed = function(){
        router.routeToHash("#books:add", "Книги | Добавление", null, true);
    };

    var onActionButtonPressed = function(action, bookId){
        switch (action) {
            case "edit":
                router.routeToHash("#books:add", "Книги | Редактировать", {"bookAddCtrl": {bookId: bookId}}, true);
                break;
            case "holders":
                router.routeToHash("#books:add", "Книги | Редактировать", {"bookAddCtrl": {bookId: bookId, action:"holders"}}, true);
                break;
            default:
                console.log(action, bookId);
        }
    };

    var deactivate = function(){
        view.freeView();
        view.show(false);
    };

    var fetchState = function(state) {
        view.setViewModel(state)
    };

    var getState = function(){
        return view.getViewModel();
    };

    var authorSource = function(sample, clueHandler){
        parameters.storage.getAuthor(sample, "", "",
            function (authorList) {
                clueHandler(sample, authorList.sort());
            }
        );
    };

    var titleSource = function(sample, clueHandler){
        parameters.storage.getTitle("", sample, "",
            function (titleList) {
                clueHandler(sample, titleList.sort());
            }
        );
    };

    return {
        start: start,
        onSearchBtnPressed: onSearchBtnPressed,
        onAddBtnPressed: onAddBtnPressed,
        onActionButtonPressed: onActionButtonPressed,
        deactivate: deactivate,
        fetchState: fetchState,
        getState: getState,
        authorSource: authorSource,
        titleSource: titleSource,
        uniqueId: "bookListCtrl"
    }
})();