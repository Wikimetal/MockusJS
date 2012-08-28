describe("MockusJS Tests", function () {
    function TestType(){};
    TestType.prototype.TestMethod=function(){};
    
    describe("static Mock: ", function () {
        it("should return a mock for the specified type", function () {
           var mock=Mockus.Mock(TestType);
           expect(mock.Expect).toBeDefined();
        });
        it("should override methods' implementation to set notifiers", function () {
            expect(new TestType().TestMethod.toString()).toEqual("function (){}");
            var mock=Mockus.Mock(TestType);
            expect(mock.TestMethod.toString()).toNotEqual("function (){}");
        });
        it("should throw an exception when trying to override properties", function () {
            function TestTypeWithProperties(){
              this.propertyName=null;
            };
            TestTypeWithProperties.prototype.TestMethod=function(){};
            
            expect(function(){Mockus.Mock(TestTypeWithProperties);}).toThrow("Property mocking not implemented yet: propertyName");
        });
        it("should override methods' implementation to set verifiers", function () {
            expect(new TestType().TestMethod.toString()).toEqual("function (){}");
            var mock=Mockus.Mock(TestType);
            expect(mock.Expect.TestMethod.toString()).toNotEqual("function (){}");
        });
        it("should verify all methods' expectations when VerifyAll is called", function () {
            var verificationPointerCalled=false;
            var mock=Mockus.Mock(TestType);
            mock.Expect.TestMethod.ToBeCalled();
            expect(mock.Expect.TestMethod.VerificationPointers.length).toEqual(1);
            mock.Expect.TestMethod.VerificationPointers[0]=function()
            {
              verificationPointerCalled=true;
            };
            mock.VerifyAll();
            expect(verificationPointerCalled).toBeTruthy();
        });
        it("should modify error message when there are verifing errors", function () {
            var errorMessage="verification error";
            var verificationPointerCalled=false;
            var mock=Mockus.Mock(TestType);
            mock.Expect.TestMethod.ToBeCalled();
            expect(mock.Expect.TestMethod.VerificationPointers.length).toEqual(1);
            mock.Expect.TestMethod.VerificationPointers[0]=function()
            {
              throw errorMessage;
            };
            expect(function(){mock.VerifyAll();}).toThrow("Mock for component TestType: method TestMethod -> "+errorMessage);
        });
    });
});