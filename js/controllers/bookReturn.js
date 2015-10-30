/**
 * Created by Такси on 15.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.controllers = window.biblio.controllers || {};
window.biblio.controllers.bookReturn = (function(){
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
        parameters.storage.returnBooks(vm, function(){
            vm.bookIssueList = [];
            view.setViewModel(vm);
            router.routeToHash("users:list", "Библиотека | Читатели", {}, true);
        });
    };

    var onCancelBtnPressed = function(){
        router.goBack();
    };

    var deactivate = function(){
        view.show(false);
    };

    function getBookIndex (book, bookIssueList) {
        for (var i = 0; i < bookIssueList.length; i++) {
            if (bookIssueList[i].book.id == book.id) {
                return i;
            }
        }
        return -1;
    }

    var consolidateBookIssue = function(bookIssueData) {
        // группируем по книге и сумме
        var result = [];
        bookIssueData.forEach(function(issueEntry){
            var i = getBookIndex(issueEntry.book, result);
            if (i == -1) {
                result.push({book: issueEntry.book, amount: Number.parseInt(issueEntry.amount), returnAmount: 0});
            } else {
                result[i].amount += Number.parseInt(issueEntry.amount);
            }
        });
        result.sort(function(a, b){
            if (a.book.author < b.book.author) {
                return -1;
            } else if (a.book.author == b.book.author) {
                return 0;
            } else {return 1;}
        });
        return result;
    };

    var fetchState = function(state) {
        var vm = {};
        if (state && state.userId || state && state.user) {
            parameters.storage.getUser(state.userId || state.user.id, function(user){
                vm.user = user;
                if (state && state.bookIssueList) {
                    vm.bookIssueList = state.bookIssueList;
                    view.setViewModel(vm);
                } else {
                    parameters.storage.getUserBooks(user.id, function(bookIssueData){
                        vm.bookIssueList = consolidateBookIssue(bookIssueData);
                        view.setViewModel(vm);
                    })
                }
            });
        } else {
            view.setViewModel(null);
        }
    };

    var getState = function(){
        return view.getViewModel();
    };

    var onBookIssueRemove = function (bookIssueItem) {
        //view.bookIssueRemove(bookIssueItem);
    };

    return {
        start: start,
        onSubmitBtnPressed: onSubmitBtnPressed,
        onCancelBtnPressed: onCancelBtnPressed,
        deactivate: deactivate,
        fetchState: fetchState,
        getState: getState,
        onBookIssueRemove: onBookIssueRemove,
        uniqueId: "bookReturnCtrl"
    }
})();