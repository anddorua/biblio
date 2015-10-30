/**
 * Created by aahom_000 on 25.07.2015.
 */
window.biblio = window.biblio || {};
window.biblio.models = window.biblio.models || {};
window.biblio.models.UserItem = (function(){
    var UserItem = function(id, surname, firstname, middlename, dateofbirth, address, phone){
        this.id = id;
        this.surname = surname;
        this.firstname = firstname;
        this.middlename = middlename;
        this.dateofbirth = dateofbirth;
        this.address = address;
        this.phone = phone;
        this.regDate = null;
        this.holdCount = 0;
        this.isValid = function(){
            return this.surname && this.dateofbirth && this.address && this.phone;
        };
        this.getFullName = function(){
            var res = [];
            res.push(this.surname);
            if (this.firstname) {
                res.push(this.firstname);
            }
            if (this.middlename){
                res.push(this.middlename);
            }
            return res.join(" ");
        };
    };
    return UserItem;
})();