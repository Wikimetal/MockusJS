function TestType(){};
describe("Generic Parameter Tests", function () {
    var genericParameter=null;
    
    beforeEach(function () {
        genericParameter=new GenericParameter();
    });

    describe("public GetType: ", function () {
        it("should return the type specified for the generic parameter", function () {
            expect(genericParameter.GetType()).toBeFalsy();
            var expectedValue="test";
            genericParameter.type=expectedValue;
            expect(genericParameter.GetType()).toEqual(expectedValue);
        });
    });
    describe("public IsAny: ", function () {
        it("should set as type the name of the type passed as argument when argument is a type", function () {
            var parameter=GenericParameter.IsAny(TestType);
            expect(parameter.GetType()).toEqual("TestType");
        });
        it("should set as type the type of the value passed as argument when argument is not a type", function () {
            var parameter=GenericParameter.IsAny(new TestType());
            expect(parameter.GetType()).toEqual("object");
        });
    });
    describe("public IsAnyFunction: ", function () {
        it("should set 'function' as type ", function () {
            var parameter=GenericParameter.IsAnyFunction();
            expect(parameter.GetType()).toEqual("function");
        });
    });
    describe("public IsAnyObject: ", function () {
        it("should set 'object' as type ", function () {
            var parameter=GenericParameter.IsAnyObject();
            expect(parameter.GetType()).toEqual("object");
        });
    });
    describe("public IsAnyString: ", function () {
        it("should set 'string' as type ", function () {
            var parameter=GenericParameter.IsAnyString();
            expect(parameter.GetType()).toEqual("string");
        });
    });
    describe("public IsAnyNumber: ", function () {
        it("should set 'number' as type ", function () {
            var parameter=GenericParameter.IsAnyNumber();
            expect(parameter.GetType()).toEqual("number");
        });
    });
});