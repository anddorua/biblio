/**
 * Created by Такси on 13.07.15.
 */
window.biblio = window.biblio || {};
window.biblio.services = window.biblio.services || {};
window.biblio.services.html = (function(){
    var eventBind = function(handlers) {
        handlers.forEach(function(handler){
            var elements = document.querySelectorAll(handler.selector);
            for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener(handler.event, handler.handler, handler.capture || false);
            }
        });
    };

    var parseTemplate = function(tmplId, paramObject){
        var tmplText = document.getElementById(tmplId).innerText;
        for (param in paramObject){
            tmplText = tmplText.replace(new RegExp("{{" + param + "}}", "g"), "" + paramObject[param]);
        }
        return tmplText;
    };

    var viewModelBind = function(selector, viewModelObject){
        var items = document.querySelectorAll(selector);
        for (var i = 0; i < items.length; i++) {
            if (items[i].name) {
                Object.defineProperty(viewModelObject, items[i].name, {
                    configurable: true,
                    enumerable: true,
                    get: (function(element){
                        return function(){ return element.value; };
                    })(items[i]),
                    set: (function(element){
                        return function(value){
                            element.value = value;
                        }
                    })(items[i])
                });
            }
        }
    };

    var extend = function(dstObj, srcObj) {
        for (var attr in srcObj) {
            if (srcObj.hasOwnProperty(attr)) {
                dstObj[attr] = srcObj[attr];
            }
        }
        return dstObj;
    };

    var extendStrict = function(dstObj, srcObj) {
        for (var attr in dstObj) {
            if (srcObj.hasOwnProperty(attr)) {
                dstObj[attr] = srcObj[attr];
            }
        }
        return dstObj;
    };

    var isObjectsStrictEqual = function (a, b) {
        // keys are equal
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        keysA.forEach(function(key){
            var i = keysB.indexOf(key);
            if (i >= 0) {
                delete keysB[i];
            }
        });
        if (keysB.some(function(key){ return key != undefined; })) {
            return false;
        }

        var notEqual = keysA.some(function (key) {
            return a[key] != b[key];
        });
        return !notEqual;
    };

    var clone = function(srcObj) {
        return extend({}, srcObj);
    };

    var emptyObject = function(obj) {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = null;
            }
        }
        return obj;
    };

    var findNearestByTag = function(node, tagNameToFind, tagNameToStopSearch){
        while (node && node.tagName != tagNameToStopSearch) {
            if (node.tagName == tagNameToFind) {
                return node;
            } else {
                node = node.parentNode;
            }
        }
        return null;
    };

    var setReadOnly = function(selectorArray, state) {
        selectorArray.forEach(function(selector){
            document.querySelector(selector).readOnly = state;
        });
    };

    var getUnselectedText = function (element) {
        return element.value.substr(0,element.selectionStart);
    };

    return {
        eventBind: eventBind,
        parseTemplate: parseTemplate,
        viewModelBind: viewModelBind,
        clone: clone,
        extend: extend,
        extendStrict: extendStrict,
        emptyObject: emptyObject,
        findNearestByTag: findNearestByTag,
        setReadOnly: setReadOnly,
        getUnselectedText: getUnselectedText,
        isObjectsStrictEqual: isObjectsStrictEqual
    }
})();