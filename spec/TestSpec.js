/**
 * Created by Такси on 20.07.15.
 */
describe("Some testy suite", function(){
    var a;
    it("assign a", function(){
        a = 1;
        expect(a).toBe(1);
    });
    it("wrong way", function(){
        expect(a).toBe(2);
    });
});