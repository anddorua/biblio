/**
 * Created by aahom_000 on 25.07.2015.
 */
window.biblio = window.biblio || {};
window.biblio.models = window.biblio.models || {};
window.biblio.models.localStorage = (function(){
    var getBooksFromLS = function(){
        var stringified = localStorage.getItem("biblio.books");
        return stringified ? JSON.parse(stringified).map(function(item){
            return biblio.services.html.extend(new biblio.models.BookItem(), item)
        }) : [];
    };
    var saveBooksToLS = function(bookArray) {
        localStorage.setItem("biblio.books", JSON.stringify(bookArray));
    };
    var getBookIssueDataFromLS = function(){
        var data = localStorage.getItem("biblio.bookIssueData");
        return data ? JSON.parse(data) : [];
    };
    var saveBookIssueDataToLS = function(bookIssueData) {
        localStorage.setItem("biblio.bookIssueData", JSON.stringify(bookIssueData));
    };
    var getAddBookLog = function(){
        var stringified = localStorage.getItem("biblio.addbooklog");
        return stringified ? JSON.parse(stringified) : [];
    };
    var saveAddBookLog = function(log) {
        localStorage.setItem("biblio.addbooklog", JSON.stringify(log));
    };
    var bookSearch = function(searchParameters, successHandler, errorHandler){
        var result = getBooksByMask(searchParameters["book-search-author"], searchParameters["book-search-title"], "", searchParameters["book-search-isbn"]);
        successHandler(result);
    };
    var getUsersFromLS = function(){
        var stringified = localStorage.getItem("biblio.users");
        return stringified ? JSON.parse(stringified).map(function(item){
            return biblio.services.html.extend(new biblio.models.UserItem(), item)
        }) : [];
    };
    var saveUsersToLS = function(userArray) {
        localStorage.setItem("biblio.users", JSON.stringify(userArray));
    };
    var userSearch = function(sample, successHandler, errorHandler){
        var users = getUsersFromLS();
        var result = users.filter(function(userItem){
            return userItem.surname.toLowerCase().indexOf(sample.toLowerCase()) >= 0;
        });
        successHandler(result);
    };

    var getBookIndexInLS = function(books, bookId) {
        for (var i = 0; i < books.length; i++){
            if (books[i].id == bookId) {
                return i;
            }
        }
        return -1;
    };

    var getUserIndexInLS = function(userList, userId) {
        for (var i = 0; i < userList.length; i++){
            if (userList[i].id == userId) {
                return i;
            }
        }
        return -1;
    };

    var getUserById = function(userList, userId) {
        return biblio.services.html.extendStrict(new biblio.models.UserItem(), userList[getUserIndexInLS(userList, userId)]);
    };

    var getBookById = function(bookList, bookId) {
        for (var i = 0; i < bookList.length; i++){
            if (bookList[i].id == bookId) {
                return biblio.services.html.extendStrict(new biblio.models.BookItem(), bookList[i]);
            }
        }
    };

    var getBook = function(bookId, successHandler, errorHandler){
        var books = getBooksFromLS();
        var i = getBookIndexInLS(books, bookId);
        if (i >= 0) {
            successHandler(books[i]);
        } else {
            errorHandler("book id " + bookId + "not found");
        }
    };

    var getUser = function(userId, successHandler, errorHandler){
        var users = getUsersFromLS();
        for (var i = 0; i < users.length; i++){
            if (users[i].id == userId) {
                successHandler(users[i]);
                break;
            }
        }
        if (i == users.length) {
            errorHandler("user id " + userId + "not found");
        }
    };

    var getHolderList = function(bookId, successHandler, errorHandler){
        var bookIssueData = getBookIssueDataFromLS();
        var userList = getUsersFromLS();
        var result = [];
        if (bookIssueData[bookId]) {
            bookIssueData[bookId].forEach(function (listEntry) {
                var resultEntry = {};
                resultEntry.when = listEntry.when;
                resultEntry.amount = listEntry.amount;
                resultEntry.user = getUserById(userList, listEntry.readerId);
                result.push(resultEntry);
            });
        }
        successHandler(result);
    };

    var getUserBooks = function(userId, successHandler, errorHandler){
        var bookIssueData = getBookIssueDataFromLS();
        var books = getBooksFromLS();
        var result = [];
        for (var bookId in bookIssueData) {
            if (!bookIssueData[bookId]) {
                continue;
            }
            var book = getBookById(books, bookId);
            bookIssueData[bookId].forEach(function(bookIssueEntry){
                if (bookIssueEntry.readerId == userId) {
                    var resultEntry = {};
                    resultEntry.when = bookIssueEntry.when;
                    resultEntry.amount = bookIssueEntry.amount;
                    resultEntry.book = book;
                    result.push(resultEntry);
                }
            });
        }
        successHandler(result);
    };

    var bookSave = function(model, successHandler, errorHandler){
        if (model.book.isValid()) {
            var bookList = getBooksFromLS();
            var maxBookId = 0;
            var i = 0;
            var addAmount = Number.parseInt(model.parameters.adding || 0);
            for ( ; i < bookList.length; i++){
                if (bookList[i].id == model.book.id) {
                    model.book.ownedCount = Number.parseInt(bookList[i].ownedCount || 0) + addAmount;
                    model.book.storeCount = Number.parseInt(bookList[i].storeCount || 0) + addAmount;
                    biblio.services.html.extendStrict(bookList[i], model.book);
                    break;
                } else {
                    maxBookId = Math.max(maxBookId, bookList[i].id);
                }
            }
            if (i == bookList.length) {
                model.book.id = 1 + maxBookId;
                model.book.ownedCount = addAmount;
                model.book.storeCount = addAmount;
                bookList.push(model.book);
            }
            saveBooksToLS(bookList);
            if (model.parameters.adding && model.parameters.adding != 0) {
                var log = getAddBookLog();
                log.push({
                    id: model.book.id,
                    date: new Date(),
                    adding: model.parameters.adding,
                    comment: model.parameters.count
                });
                saveAddBookLog(log);
            }
            successHandler();
        } else {
            errorHandler("book invalid");
        }
    };

    var issueBooks = function (model, successHandler, errorHandler) {
        var bookList = getBooksFromLS();
        var bookIssueData = getBookIssueDataFromLS();
        var userList = getUsersFromLS();
        var ui = getUserIndexInLS(userList, model.user.id);
        model.bookIssueList.forEach(function(issueEntry){
            if (!bookIssueData[issueEntry.book.id]) {
                bookIssueData[issueEntry.book.id] = [];
            }
            bookIssueData[issueEntry.book.id].push({when:new Date(), amount: Number.parseInt(issueEntry.amount), readerId: model.user.id});
            var i = getBookIndexInLS(bookList, issueEntry.book.id);
            bookList[i].storeCount -= Number.parseInt(issueEntry.amount);
            userList[ui].holdCount += Number.parseInt(issueEntry.amount);
        });
        saveBookIssueDataToLS(bookIssueData);
        saveBooksToLS(bookList);
        saveUsersToLS(userList);
        successHandler();
    };

    var userSave = function(model, successHandler, errorHandler){
        if (model.user.isValid()) {
            var userList = getUsersFromLS();
            var maxUserId = 0;
            var i = 0;
            for ( ; i < userList.length; i++){
                if (userList[i].id == model.user.id) {
                    biblio.services.html.extend(userList[i], model.user);
                    break;
                } else {
                    maxUserId = Math.max(maxUserId, userList[i].id);
                }
            }
            if (i == userList.length) {
                model.user.id = maxUserId + 1;
                userList.push(model.user);
            }
            saveUsersToLS(userList);
            successHandler();
        } else {
            errorHandler("user invalid");
        }
    };

    var getBooksByMask = function(author, title, year, isbn){
        var bookList = getBooksFromLS();
        var authorLow = author.toLowerCase();
        var titleLow = title.toLowerCase();
        return bookList.filter(function(book){
            return (authorLow == "" || book.author.toLowerCase().indexOf(authorLow) >= 0)
                && (titleLow == "" || book.title.toLowerCase().indexOf(titleLow) >= 0)
                && (year == "" || book.year == year)
                && (isbn == "" || book.isbn.indexOf(isbn) == 0);
        });
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
        var result = getBooksByMask(author, title, year, "").map(function(book){
            return book.author;
        });
        successHandler(uniqueArray(result).sort());
    };

    var getTitle = function (author, title, year, successHandler, errorHandler) {
        var result = getBooksByMask(author, title, year, "").map(function(book){
            return book.title;
        });
        successHandler(uniqueArray(result).sort());
    };

    var findBooks = function (searchParameters, successHandler, errorHandler) {
        var result = getBooksByMask(searchParameters.author, searchParameters.title, searchParameters.year, searchParameters.isbn);
        successHandler(result);
    };

    var returnBooks = function(returnData, successHandler, errorHandler){
        var bookList = getBooksFromLS();
        var bookIssueData = getBookIssueDataFromLS();
        var userList = getUsersFromLS();
        var ui = getUserIndexInLS(userList, returnData.user.id);
        userList[ui].holdCount = Number.parseInt(userList[ui].holdCount);
        returnData.bookIssueList.forEach(function(returnEntry){
            var bookIndex = getBookIndexInLS(bookList, returnEntry.book.id);
            bookList[bookIndex].storeCount = Number.parseInt(bookList[bookIndex].storeCount);
            if (!bookIssueData[returnEntry.book.id]) {
                return;
            }
            returnEntry.returnAmount = Number.parseInt(returnEntry.returnAmount);
            for (var j = 0; j < bookIssueData[returnEntry.book.id].length && returnEntry.returnAmount > 0; j++){
                var issueEntry = bookIssueData[returnEntry.book.id][j];
                if (issueEntry.readerId == returnData.user.id) {
                    var withdraw = Math.min(Number.parseInt(issueEntry.amount), returnEntry.returnAmount);
                    issueEntry.amount = Number.parseInt(issueEntry.amount) - withdraw;
                    returnEntry.returnAmount -= withdraw;
                    userList[ui].holdCount -= withdraw;
                    bookList[bookIndex].storeCount += withdraw;
                }
            }
            // чистим выдачи с нулевым количеством
            for (j = bookIssueData[returnEntry.book.id].length - 1; j >= 0; j--){
                if (bookIssueData[returnEntry.book.id][j].amount == 0) {
                    bookIssueData[returnEntry.book.id].splice(j, 1);
                }
            }
        });
        saveBooksToLS(bookList);
        saveUsersToLS(userList);
        saveBookIssueDataToLS(bookIssueData);
        successHandler();
    };

    var authenticate = function (model, successHandler, errorHandler) {
        if (model.login == "root" && model.password == "root") {
            var session = {
                lastAuth: new Date()
            };
            localStorage.setItem("biblio.session." + model.login, session);
            successHandler(true);
        } else {
            successHandler(false);
        }
    };

    var isAuthenticated = function(){

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
        authenticate: authenticate
    }
})();