/**
 * Created by aahom_000 on 25.07.2015.
 */
window.biblio = window.biblio || {};
window.biblio.models = window.biblio.models || {};
window.biblio.models.BookItem = (function(){
    var BookItem = function(id, author, title, isbn, year, ownedCount, storeCount){
        this.id = id;
        this.author = author;
        this.title = title;
        this.isbn = isbn;
        this.year = Number.parseInt(year);
        this.ownedCount = Number.parseInt(ownedCount);
        this.storeCount = Number.parseInt(storeCount);
        this.isValid = function(){
            return this.author && this.title && this.isbn && this.year;
        };
        this.getDescription = function(){
            return this.author + " \"" + this.title + "\"" + ", ISBN:" + this.isbn + ", " + this.year;
        };
    };
    return BookItem;
})();