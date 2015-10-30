/**
 * Created by aahom_000 on 25.07.2015.
 */
window.biblio = window.biblio || {};
window.biblio.services = window.biblio.services || {};
window.biblio.services.BiblioXHR = (function(){
    var BiblioXHR = function(aMethod, aPath){
        var method = aMethod;
        var path = aPath;
        var xhr = new XMLHttpRequest();
        var userSuccessHandler = null;
        var userErrorHandler = null;
        var onreadystatechange = function(){
            if (xhr.readyState != 4) {
                return;
            }
            if (xhr.status == 200) {
                userSuccessHandler(JSON.parse(xhr.responseText));
            } else {
                userErrorHandler(xhr.statusText);
            }
        };
        this.send = function (dataObject, successHandler, errorHandler) {
            xhr.open(method || 'POST', path || "interface.php", true);
            xhr.onreadystatechange = onreadystatechange;
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            userSuccessHandler = successHandler;
            userErrorHandler = errorHandler;
            xhr.send(JSON.stringify(dataObject));
        }
    };
    return BiblioXHR;
})();