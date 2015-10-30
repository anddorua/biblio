/**
 * Created by Такси on 16.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.bookAdd = (function(){
    var view;
    var router;
    var parameters;
    var start = function(aView, aRouter, aParameters){
        view = aView;
        router = aRouter;
        parameters = aParameters;
        view.init(this);
    };

    var onSubmitBtnPressed = function(){
        var vm = view.getViewModel();
        parameters.storage.bookSave(
            vm,
            function(){
                router.routeToHash("#books:list", "Книги | Поиск", null, true);
            }
        );
    };

    var onCancelBtnPressed = function(){
        router.goBack();
    };

    var deactivate = function(){
        view.show(false);
    };

    var fetchState = function(state) {
        if (state) {
            if ((state.book && state.book.id) || state.bookId) {
                parameters.storage.getBook(
                    (state.book && state.book.id) ? state.book.id : state.bookId,
                    function(book){
                        parameters.storage.getHolderList(book.id, function(holderList){
                            view.setViewModel({book: book, parameters: state.parameters || {}, holders: holderList});
                        }, function(errMsg){console.error("book holder list getting error", errMsg);});
                    }
                );
            } else {
                view.setViewModel(state);
            }
        } else {
            view.setViewModel(null);
        }
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
        getState: getState,
        uniqueId: "bookAddCtrl"
    }
})();