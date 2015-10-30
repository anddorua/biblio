/**
 * Created by aahom_000 on 02.08.2015.
 * @inputElement DOMElement input element to around autocomplete div
 * @aStringSource callback input element to around autocomplete div
 *
 * usage:
 *
    // sample - string sample for search, for.ex: "ник"
    // clueHandler - callback, accepting initial sample and string array with clues
    var itemSource = function(sample, clueHandler){
        setTimeout(function(){
            var words = ["Симферополь", "Армянск", "Джанкой", "Евпатория", "Зелёный Яр", "Керчь", "Красноперекопск", "Красносельское", "Новосельское", "Партенит", "Плодовое", "Феодосия", "Щёлкино", "Ялта", "Киев ", "Севастополь ", "Винницкая область ", "мачта труба здание", "Винница", "Балановка", "Ладыжин", "Волынская область	", "мачта", "Луцк", "Владимир-Волынский", "Ковель", "Нововолынск", "Днепропетровск", "Булаховка", "Вовниги", "Днепродзержинск", "Жёлтые Воды", "Зеленодольск", "Каменно-Зубиловка", "Кривой Рог", "Кринички", "Марганец", "Никополь", "Новомосковск", "Павлоград", "Донецк", "Авдеевка", "Андреевка", "Артёмовск", "Безимянное", "Белосарайская Коса", "Бересток", "Волноваха", "Горловка", "Енакиево", "Зугрес", "Константиновка", "Краматорск", "Красноармейск", "Курахово", "Макеевка", "Мариуполь", "Николаевка", "Райгородок", "Светлодарск", "Святогорск", "Славянск", "Снежное", "Торез", "Шахтёрск", "Житомир", "Андреевка", "Бердичев", "Коростень", "Новоград-Волынский", "Олевск", "Ужгород", "Берегово", "Виноградов", "Иршава", "Мукачево", "Рахов", "Свалява", "Тячев", "Хуст", "Запорожье", "Бердянск", "Днепрорудное", "Камыш-Заря", "Мелитополь", "Токмак", "Орловское", "Приморский Посад", "Энергодар", "Ивано-Франковск", "Бурштын", "Калуш", "Коломыя", "Белая Церковь", "Борисполь", "Бровары", "Вышгород", "Ирпень", "Коцюбинское", "Петропавловская Борщаговка", "Припять", "Украинка", "Кировоград", "Александрия", "Луганск", "Алчевск", "Антрацит", "Белолуцк", "Верхнешевыревка", "Ирмино", "Краснодон", "Красный Луч", "Лисичанск", "Ровеньки", "Рубежное", "Свердловск", "Северодонецк", "Старобельск", "Стаханов", "Счастье", "Чернухино", "Львов", "Дрогобыч", "Красное", "Стрый", "Трускавец", "Червоноград", "Николаев", "Вознесенск", "Дмитровка", "Луч", "Очаков", "Первомайск", "Тузлы", "Южноукраинск", "Одесса", "Белгород-Днестровский", "Вестерничаны", "Жовтень", "Измаил", "Ильичевск", "Каменское", "Ковалёвка", "Новокубанка", "Орловка", "Петровка", "Южный", "Полтава", "Красногоровка", "Кременчуг", "Лубны", "Ровно", "Антополь", "Кузнецовск", "Сумы", "Ахтырка", "Белополье", "Конотоп", "Кролевец", "Ромны", "Тростянец", "Шостка", "Тернополь", "Лозовая", "Харьков", "Барвенково", "Балаклея", "Змиёв", "Изюм", "Кегичёвка", "Комсомольское", "Мерефа", "Лозовая", "Подворки", "Тарановка", "Херсон", "Васильевка", "Геническ", "Большая Александровка", "Новая Каховка", "Новотроицкое", "Рыбальче", "Чаплинка", "Хмельницкий", "Волочиск", "Каменец-Подольский", "Кульчиевцы", "Нетешин", "Черкассы", "Буки", "Канев", "Смела", "Умань", "Чернигов", "Козелец", "Бахмач", "Круты", "Нежин", "Новгород-Северский", "Прилуки", "Черновцы", "Новоднестровск"];
            var sampleLower = sample.toLowerCase();
            var result = words.filter(function(word){
                return word.toLowerCase().indexOf(sampleLower) == 0;
            });
            clueHandler(sample, result.sort())
        }, 1);
    };
    var auto = new Autocomplete(document.getElementById("id2"), itemSource);

 */
var Autocomplete = (function(){
    return function(inputElement, aStringSource){
        var target = null;
        var list = null;
        var stringSource = null;
        var lastInputValue = null;
        var preventTailSubstitute = false;
        var defaultMaxSize = 8;
        var maxSize = defaultMaxSize;
        var currentLetterComparator = null;
        var wrapperDiv = null;
        var selectDiv = null;
        var currentState;
        var isListFocused = false;
        var selectedItem = null;

        /**
         * has states:
         * "unfocused" - no focus, list hidden, selection removed
         * "virgin" - has focus, but no letters entered, list hidden
         * "needclue" - some keys entered, clues displayed if present
         * "chosen" - clue was selected by clicking on select item, or "Enter" pressed, list hidden
         */

        var clearTextSelection = function () {
            target.selectionStart = target.value.length;
            target.selectionEnd = target.value.length;
        };

        var setStateUnfocused = function () {
            listHide();
            clearTextSelection();
            currentState = "unfocused";
        };

        var setStateVirgin = function(){
            listHide();
            currentState = "virgin";
        };

        var setStateNeedClue = function(){
            currentState = "needclue";
        };

        var setStateChosen = function(){
            listHide();
            target.focus();
            clearTextSelection();
            currentState = "chosen";
            var e = new CustomEvent("cluechosen", { bubbles: true, detail: getSample() });
            target.dispatchEvent(e);
        };
        var clearList = function(){
            while(list.firstChild) {
                list.removeChild(list.firstChild);
            }
            selectedItem = null;
        };

        var commonPartLength = function(str1, str2) {
            for (var i = 0; i < str1.length && i < str2.length && currentLetterComparator(str1.substring(i, i+1), str2.substring(i, i+1)) == 0; i++) {};
            return i;
        };

        var getSample = function () {
            return target.value.substr(0,target.selectionStart);
        };

        var substituteTail = function(){
            if (preventTailSubstitute) {
                return;
            }
            // находим в выделении положение сэмпла и делаем сэмплом все, что от начала строки до окончания сэмпла
            var clue = selectedItem ? selectedItem.dataset.value : "";
            var sample = getSample();
            var pos = clue.toLowerCase().indexOf(sample.toLowerCase());
            var commonLength = 0;
            if (pos >= 0) {
                sample = clue.substr(0, pos + sample.length);
                commonLength = commonPartLength(sample, clue);
            }
            target.value = clue;
            target.selectionStart = commonLength;
            target.selectionEnd = clue.length;
        };

        var compareLexically = function(a, b) {
            if (a == b) {
                return 0;
            } else if (a < b) {
                return -1;
            } else {
                return 1;
            }
        };

        var smartCompare = function(a, b, lowSample) {
            var lowA = a.toLowerCase();
            var lowB = b.toLowerCase();
            var posA = lowA.indexOf(lowSample);
            var posB = lowB.indexOf(lowSample);
            if (posA < 0 && posB < 0) {
                return compareLexically(lowA, lowB);
            } else if (posA < 0 && posB >= 0) {
                return 1;
            } else if (posA >=0 && posB < 0) {
                return -1
            } else if (posA == posB) {
                return compareLexically(lowA, lowB);
            } else if (posA < posB) {
                return -1;
            } else {
                return 1;
            }
        };

		var fillClueList = function(arrayToFill) {
			arrayToFill.forEach(function(item){
				var opt = document.createElement("LI");
				var optText = document.createTextNode(item);
				opt.appendChild(optText);
				opt.dataset.value = item;
				list.appendChild(opt);
			});
		};
		
        var clueHandler = function(sample, clueArray){
            if (sample != getSample()) {
                return;
            }
            clearList();
            if (clueArray.length > 0) {
                //сортируем массив по степени удаленности сэмпла от начала строки
                var lowSample = sample.toLowerCase();
                clueArray.sort(function(a, b){
                    return smartCompare(a, b, lowSample);
                });
                listShow();
				fillClueList(clueArray);
                selectFirstClue();
				var height = (Math.min(maxSize, clueArray.length)) * selectedItem.offsetHeight;
                var borderHeight = Number.parseInt(getComputedStyle(selectDiv,null).getPropertyValue('border-top-width'))
                    + Number.parseInt(getComputedStyle(selectDiv,null).getPropertyValue('border-bottom-width'));
				selectDiv.style.height = (height + borderHeight) + "px";
				selectDiv.style.overflowY = "auto";
                //console.log("offsetWidth:", list.offsetWidth, ", clientWidth:", selectDiv.clientWidth);
                //console.log("divOffsetWidth:", selectDiv.offsetWidth);
                var borderWidth = Number.parseInt(getComputedStyle(selectDiv,null).getPropertyValue('border-left-width'))
                    + Number.parseInt(getComputedStyle(selectDiv,null).getPropertyValue('border-right-width'));
                //console.log(getComputedStyle(selectDiv,null).getPropertyValue('border-left-width'));
				selectDiv.style.overflowX = selectDiv.scrollWidth > selectDiv.offsetWidth - borderWidth ? "auto" : "hidden";
                substituteTail();
            } else {
                listHide();
            }
        };

        var acceptListNewSelection = function () {
            preventTailSubstitute = false;
            substituteTail();
            lastInputValue = target.value;
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

        var listClickHandler= function(e){
            if (event.which == 1) {
                var itemTarget = findNearestByTag(e.target, "LI", "UL");
                if (itemTarget) {
                    markItemSelected(itemTarget);
                    acceptListNewSelection();
                    setStateChosen();
                }
            }
        };

        /**
         * main key handler
         * @param e Event
         */
        var inputKeyHandler = function(e){
            if (e.keyIdentifier == "Enter") {
                return;
            }
            if (target.value.length > 0 && stringSource && lastInputValue != target.value) {
                preventTailSubstitute = e.keyIdentifier == "U+0008"; // backspace
                lastInputValue = target.value;
                if (currentState == "virgin" || currentState == "chosen" ){
                    setStateNeedClue();
                }
                stringSource(target.value, clueHandler);
            }
        };

        var inputKeydownHandler = function(e){
            if (currentState == "needclue" && e.keyIdentifier == "Enter") {
                e.preventDefault();
                setStateChosen();
            }
        };

        var controlKeyHandler = function(e){
            if (currentState == "needclue" && ["Down", "Up"].indexOf(e.keyIdentifier) >= 0) {
                switch(e.keyIdentifier){
                    case "Down":
                        scrollLineDown();
                        break;
                    case "Up":
                        scrollLineUp();
                        break;
                }
                e.preventDefault();
                acceptListNewSelection();
            }
        };

        var targetFocusHandler = function(e){
            if (currentState == "unfocused") {
                setStateVirgin();
            }
        };

        var targetBlurHandler = function(e){
            setStateUnfocused();
        };

        var unselectClue = function () {
            if (selectedItem) {
                selectedItem.classList.remove("selected");
				selectedItem = null;
            }
        };

		var markItemSelected = function(item) {
			if (item) {
				item.classList.add("selected");
				selectedItem = item;
			}
		};
		
		var scrollToView = function() {
			var posY = selectedItem.offsetTop - selectDiv.scrollTop;
			if (posY < 0) {
				selectDiv.scrollTop = selectedItem.offsetTop;
				return;
			}
			posY = selectedItem.offsetTop + selectedItem.offsetHeight;
			if (posY > selectDiv.scrollTop + selectDiv.clientHeight) {
				selectDiv.scrollTop = posY - selectDiv.clientHeight;
			}
		};
		
        var selectFirstClue = function(){
			unselectClue();
			selectedItem = list.querySelector("li");
			markItemSelected(selectedItem);
			selectDiv.scrollLeft = 0;
			selectDiv.scrollTop = 0;
        };

        var scrollLineDown = function(){
			if (selectedItem) {
				nextItem = selectedItem.nextElementSibling || selectedItem;
				unselectClue();
				markItemSelected(nextItem);
				scrollToView();
			} else {
				selectFirstClue();
			}
        };

        var scrollLineUp = function(){
			if (selectedItem) {
				prevItem = selectedItem.previousElementSibling || selectedItem;
				unselectClue();
				markItemSelected(prevItem);
				scrollToView();
			} else {
				selectFirstClue();
			}
        };

        var listShow = function(){
            selectDiv.style.display = "block";
        };
        var listHide = function () {
            selectDiv.style.display = "none";
        };

        var wrapInput = function () {
            if (wrapperDiv) {
                return;
            }
            wrapperDiv = document.createElement("DIV");
            wrapperDiv.classList.add("autocomplete-wrapper");
            target.parentNode.insertBefore(wrapperDiv, target);
            wrapperDiv.appendChild(target);
            selectDiv = document.createElement("DIV");
            selectDiv.style.display = "none";
            selectDiv.style.zIndex = 1;
            selectDiv.classList.add("autocomplete-list");

            list = document.createElement("UL");
            selectDiv.appendChild(list);
            wrapperDiv.appendChild(selectDiv);
            maxSize = target.dataset.autocompleteMaxsize || defaultMaxSize;
            list.style.width = target.getClientRects()[0].width + "px";
        };

        this.defaultLetterComparator = function(a, b) {
            var lowA = a.toLowerCase();
            var lowB = b.toLowerCase();
            if (lowA < lowB) {
                return -1;
            } else if (lowA == lowB) {
                return 0;
            } else {
                return 1;
            }
        };

        this.setTargetInput = function(aTarget){
            target = aTarget;
        };

        var addEventListeners = function (evl) {
            evl.forEach(function (item) {
                item.el.addEventListener(item.eventType, item.handler);
            });
        };

        var removeEventListeners = function (evl) {
            evl.forEach(function (item) {
                item.el.removeEventListener(item.eventType, item.handler);
            });
        };

        this.setStringSource = function(ssHandler) {
            stringSource = ssHandler;
        };

        this.remove = function(){
            if (wrapperDiv) {
                removeEventListeners(eventListeners);
                wrapperDiv.parentNode.insertBefore(target, wrapperDiv);
                wrapperDiv.remove();
                clearVariables(this);
            }
        };

        var clearVariables = function (self) {
            target = null;
            list = null;
            stringSource = null;
            lastInputValue = null;
            preventTailSubstitute = false;
            defaultMaxSize = 8;
            maxSize = defaultMaxSize;
            currentLetterComparator = self.defaultLetterComparator;
            wrapperDiv = null;
            selectDiv = null;
            currentState = undefined;
            isListFocused = false;
        };

        clearVariables(this);
        this.setStringSource(aStringSource);
        this.setTargetInput(inputElement);
        wrapInput();
        var eventListeners = [
            {el: target, eventType: "keyup", handler: inputKeyHandler},
            {el: target, eventType: "keydown", handler: inputKeydownHandler},
            {el: target, eventType: "keydown", handler: controlKeyHandler},
            {el: target, eventType: "focus", handler: targetFocusHandler},
            {el: target, eventType: "blur", handler: targetBlurHandler},
            //{el: list, eventType: "click", handler: listClickHandler},
            {el: list, eventType: "mousedown", handler: listClickHandler}
        ];
        addEventListeners(eventListeners);
        setStateUnfocused();
    };
})();