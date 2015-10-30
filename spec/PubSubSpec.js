/**
 * Created by Такси on 23.07.15.
 */
describe("PubSub", function(){
    describe("should accept subscribers", function(){
        it("there may be many of them", function(){
            biblio.services.events.subscribe("c1", function(data){});
            biblio.services.events.subscribe("c2", function(data){});
            biblio.services.events.subscribe("c3", function(data){});
            biblio.services.events.subscribe("c3", function(data){});
        });
        xit("call for adding subscriber return object allowing to delete subcription", function(){
            var sub4 = biblio.services.events.subscribe("c4", function(data){

            });
        });
        xit("handle cannot be duplicated per channel", function(){
            fail("no spec realized");
        });
    });
    describe("should call handles upon publishing", function(){
        xit("only specified handles called", function(){
            fail("no spec realized");
        });
        xit("passes data to handles", function(){
            fail("no spec realized");
        });
    });
});