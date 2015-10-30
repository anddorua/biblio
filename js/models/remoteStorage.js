/**
 * Created by aahom_000 on 25.07.2015.
 */
window.biblio = window.biblio || {};
window.biblio.models = window.biblio.models || {};
window.biblio.models.remoteStorage = (function(){
    var defaultErrorHandler = function(errMsg) {
        console.log(errMsg);
    };

    var setDefaultErrorHandler = function (handler) {
        defaultErrorHandler = handler;
    };

    var makeBook = function(bookRecord) {
        var book = new biblio.models.BookItem(
            bookRecord.id,
            bookRecord.author,
            bookRecord.title,
            bookRecord.isbn,
            bookRecord.year,
            bookRecord.owned_count,
            bookRecord.store_count
        );
        return book;
    };

    var makeUser = function (userRecord) {
        var user = new biblio.models.UserItem(
            userRecord.id,
            userRecord.surname,
            userRecord.firstname,
            userRecord.middlename,
            userRecord.dateofbirth,
            userRecord.address,
            userRecord.phone
        );
        user.regDate = userRecord.reg_date;
        user.holdCount = Number.parseInt(userRecord.hold_count);
        return user;
    };

    var makeUserArray = function(userRecordList) {
        return userRecordList.map(function (recordItem) {
            return makeUser(recordItem);
        })
    };

    var bookSearch = function(searchParameters, successHandler, errorHandler){
        getBooksByMask(
            searchParameters["book-search-author"],
            searchParameters["book-search-title"],
            "",
            searchParameters["book-search-isbn"],
            function(data){
                successHandler(data);
            },
            errorHandler
        );
    };

    var userSearch = function(sample, successHandler, errorHandler){
        queryDataSource("userSearch", { surnameSample: sample }, function(data){
            successHandler(makeUserArray(data));
        }, errorHandler);
    };

    var queryDataSource = function (method, params, successHandler, errorHandler) {
        var xhr = new biblio.services.BiblioXHR();
        var errHandler = function(errMsg) {
            if (errorHandler) {
                errorHandler(errMsg);
            } else {
                defaultErrorHandler(errMsg);
            }
        };
        xhr.send({
            "act":{
                "class": "DataSource",
                "method": method,
                "params": params
            }
        }, function(data){
            if (data.status == "ok") {
                successHandler(data.response);
            } else {
                errHandler(data.response);
            }
            xhr = null;
        }, function(errMsg){
            errHandler(errMsg);
            xhr = null;
        });
    };

    var getBook = function(bookId, successHandler, errorHandler){
        queryDataSource("getBook", { bookId: bookId }, function(data){
            successHandler(makeBook(data));
        }, errorHandler);
    };

    var getUser = function(userId, successHandler, errorHandler){
        queryDataSource("getUser", { userId: userId }, function(data){
            successHandler(makeUser(data));
        }, errorHandler);
    };

    var getHolderList = function(bookId, successHandler, errorHandler){
        queryDataSource("getHolderList", { bookId: bookId }, function(data){
            var result = data.map(function(entry){
                var res = {};
                res.when = entry.when;
                res.amount = entry.amount;
                res.user = biblio.services.html.extendStrict(new biblio.models.UserItem(), entry.user);
                return res;
            });
            successHandler(result);
        }, errorHandler);
    };

    var getUserBooks = function(userId, successHandler, errorHandler){
        queryDataSource("getUserBooks", { userId: userId }, function(data){
            var result = [];
            data.forEach(function(dataEntry){
                var resultEntry = {};
                resultEntry.when = dataEntry.when;
                resultEntry.amount = dataEntry.amount;
                resultEntry.book = makeBook(dataEntry.book);
                result.push(resultEntry);
            });
            successHandler(result);
        }, errorHandler);
    };

    var bookSave = function(model, successHandler, errorHandler){
        queryDataSource("bookSave", model, function(data){
            successHandler(data);
        }, errorHandler);
    };

    var issueBooks = function (model, successHandler, errorHandler) {
        queryDataSource("issueBooks", model, function(){
            successHandler();
        }, errorHandler);
    };

    var userSave = function(model, successHandler, errorHandler){
        queryDataSource("userSave", model, function(data){
            successHandler(data);
        }, errorHandler);
    };

    var makeBookArray = function(recordArray) {
        return recordArray.map(function(arrayItem){ return makeBook(arrayItem); });
    };

    var getBooksByMask = function(author, title, year, isbn, successHandler, errorHandler){
        queryDataSource(
            "getBooksByMask",
            {
                author: author,
                title: title,
                year: year,
                isbn: isbn
            },
            function(data) {
                successHandler(makeBookArray(data));
            },
            errorHandler
        );
    };

    var uniqueArray = function(src){
        var result = [];
        src.forEach(function(item){
            if (result.indexOf(item) == -1) {
                result.push(item);
            }
        });
        return result;
    };

    var getAuthor = function (author, title, year, successHandler, errorHandler) {
        getBooksByMask(author, title, year, "", function(books){
            var result = books.map(function(book){ return book.author; });
            successHandler(uniqueArray(result).sort());
        }, errorHandler);
    };

    var getTitle = function (author, title, year, successHandler, errorHandler) {
        getBooksByMask(author, title, year, "", function(books){
            var result = books.map(function(book){ return book.title; });
            successHandler(uniqueArray(result).sort());
        }, errorHandler);
    };

    var findBooks = function (searchParameters, successHandler, errorHandler) {
        getBooksByMask(searchParameters.author, searchParameters.title, searchParameters.year, searchParameters.isbn, successHandler, errorHandler);
    };

    var returnBooks = function(returnData, successHandler, errorHandler){
        queryDataSource("returnBooks", returnData, successHandler, errorHandler);
    };

    var auth = function(model, successHandler, errorHandler){
        queryDataSource("auth", model, successHandler, errorHandler);
    };

    var getOper = function(login, successHandler, errorHandler){
        queryDataSource("getOper", login, successHandler, errorHandler);
    };

    var operDataSave = function(vm, successHandler, errorHandler){
        queryDataSource("operDataSave", vm, successHandler, errorHandler);
    };

    var logout = function (successHandler, errorHandler) {
        queryDataSource("logout", {}, successHandler, errorHandler);
    };

    return {
        bookSearch: bookSearch,
        bookSave: bookSave,
        getBook: getBook,
        userSearch: userSearch,
        userSave: userSave,
        getUser: getUser,
        getAuthor: getAuthor,
        getTitle: getTitle,
        findBooks: findBooks,
        issueBooks: issueBooks,
        getHolderList: getHolderList,
        getUserBooks: getUserBooks,
        returnBooks: returnBooks,
        setDefaultErrorHandler: setDefaultErrorHandler,
        auth: auth,
        getOper: getOper,
        operDataSave: operDataSave,
        logout: logout
    }
})();