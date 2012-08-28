function TestType(){};
describe("Method Expectation Tests", function () {
    var methodExpectation=null;
    var methodName="methodName";
    
    beforeEach(function () {
        methodExpectation=new MethodExpectation(methodName);
    });
    
    describe("pubic GetType: ", function () {
        it("should return 'method' as the type of this expectation", function () {
            expect(methodExpectation.GetType()).toEqual("method");
        });
    });
    
    describe("pubic GetName: ", function () {
        it("should return the name of the method under expectations", function () {
            expect(methodExpectation.GetName()).toEqual(methodName);
        });
    });
    
    describe("public ToBeCalled",function(){
        it("should throw an exception when the it has been already called",function(){
            methodExpectation.ToBeCalledsAlreadyInitiated=true;
            expect(function(){methodExpectation.ToBeCalled()}).toThrow("ToBeCalled over method "+methodName+" can only be defined once per test");
        });
        it("should add an expectation to verify and notify how many times the method under expectations is called",function(){
            expect(methodExpectation.VerificationPointers.length).toEqual(0);
            expect(methodExpectation.NotificationPointers.length).toEqual(0);
            methodExpectation.ToBeCalled();
            expect(methodExpectation.VerificationPointers.length).toEqual(1);
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
        });
        it("should return the instance of the methodExpectation when expectation is successfully added",function(){
            expect(methodExpectation.VerificationPointers.length).toEqual(0);
            var instance=methodExpectation.ToBeCalled();
            expect(instance).toEqual(methodExpectation);
        });
        it("should use the parameter to set the times expected for the expectation",function(){
            var timesExpected=10;
            methodExpectation.ToBeCalled(timesExpected);
            expect(methodExpectation.timesExpected).toEqual(timesExpected);
            
        });
        it("should set 1 as the times expected for the expectation when no parameter is set",function(){
            methodExpectation.ToBeCalled();
            expect(methodExpectation.timesExpected).toEqual(1);
            
        });
        it("should increase the number of timesCalled when Notification pointer is called",function(){
            methodExpectation.ToBeCalled();
            expect(methodExpectation.timesCalled).toEqual(0);
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            methodExpectation.NotificationPointers[0]();
            expect(methodExpectation.timesCalled).toEqual(1);
            
        });
        it("should throw an exception when verificationPointer is called and verification doesn't succeeds",function(){
            var timesExpected=10;
            methodExpectation.ToBeCalled(timesExpected);
            expect(methodExpectation.timesCalled).toEqual(0);
            expect(methodExpectation.VerificationPointers.length).toEqual(1);            
            expect(function(){methodExpectation.VerificationPointers[0]()}).toThrow("Times to be called not succeed. Expected "+timesExpected+" but was 0");
            
        });
        it("should verify expectation when verification pointer succeeds",function(){
            methodExpectation.ToBeCalled();
            expect(methodExpectation.timesCalled).toEqual(0);
            expect(methodExpectation.VerificationPointers.length).toEqual(1);            
            expect(methodExpectation.NotificationPointers.length).toEqual(1);            
            methodExpectation.NotificationPointers[0]();
            methodExpectation.VerificationPointers[0]();
            
        });
    });
    describe("public WithParams",function(){
       it("should add an expectation to verify and notify with the parameters of the method under expectations when it's called",function(){
            expect(methodExpectation.VerificationPointers.length).toEqual(0);
            expect(methodExpectation.NotificationPointers.length).toEqual(0);
            methodExpectation.WithParams();
            expect(methodExpectation.VerificationPointers.length).toEqual(1);
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
        });
        it("should not add a new expectation is called more than one time",function(){
            expect(methodExpectation.VerificationPointers.length).toEqual(0);
            expect(methodExpectation.NotificationPointers.length).toEqual(0);
            methodExpectation.WithParams();
            expect(methodExpectation.VerificationPointers.length).toEqual(1);
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            methodExpectation.WithParams();
            expect(methodExpectation.VerificationPointers.length).toEqual(1);
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
        });
        it("should add as many internal expectation as times is called",function(){
            expect(methodExpectation.WithParamsExpectations).toBeFalsy();
            methodExpectation.WithParams();
            methodExpectation.WithParams();
            methodExpectation.WithParams();
            expect(methodExpectation.WithParamsExpectations.length).toEqual(3);
        });
        it("should add as many internal notifications as times is notified",function(){
            expect(methodExpectation.WithParamsNotifications).toBeFalsy();
            methodExpectation.WithParams();
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            methodExpectation.NotificationPointers[0]();
            methodExpectation.NotificationPointers[0]();
            methodExpectation.NotificationPointers[0]();
            expect(methodExpectation.WithParamsNotifications.length).toEqual(3);
        });
        it("should throw an exception when no notification exists for the current expectation",function(){
            methodExpectation.WithParams();
            methodExpectation.WithParams();
            expect(methodExpectation.NotificationPointers.length).toEqual(1);  
            methodExpectation.NotificationPointers[0]();
            expect(methodExpectation.VerificationPointers.length).toEqual(1);  
            expect(function(){methodExpectation.VerificationPointers[0]()}).toThrow("WithParams has been set up 2 times but has been called 1 times");
        });
        it("should throw an exception when expectation and call argument number does not fit",function(){
            methodExpectation.WithParams("test1","test2","test3");
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            function notify(){  
              methodExpectation.NotificationPointers[0](arguments);
            };
            notify("test1","test2");
            expect(methodExpectation.VerificationPointers.length).toEqual(1);  
            expect(function(){methodExpectation.VerificationPointers[0]()}).toThrow("Invalid arguments length. Expected 3 but was 2");
        });
        it("should throw an exception when expectation and call arguments aren't of same type",function(){
            methodExpectation.WithParams("test1","test2","test3");
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            function notify(){  
              methodExpectation.NotificationPointers[0](arguments);
            };
            notify("test1","test2",2);
            expect(methodExpectation.VerificationPointers.length).toEqual(1);  
            expect(function(){methodExpectation.VerificationPointers[0]()}).toThrow("Invalid argument type. Argument 3 expected to be of type string but was number");
        });
        it("should throw an exception when expectation and call arguments aren't equal",function(){
            methodExpectation.WithParams("test1","test2","test3");
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            function notify(){  
              methodExpectation.NotificationPointers[0](arguments);
            };
            notify("test1","test2","test9");
            expect(methodExpectation.VerificationPointers.length).toEqual(1);  
            expect(function(){methodExpectation.VerificationPointers[0]()}).toThrow("Invalid argument value. Argument 3 expected to be test3 but was test9");
        });
        it("should allow genericParameters",function(){
            methodExpectation.WithParams("test1","test2",It.IsAny(TestType));
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            function notify(){  
              methodExpectation.NotificationPointers[0](arguments);
            };
            notify("test1","test2",new TestType());
            expect(methodExpectation.VerificationPointers.length).toEqual(1);  
            methodExpectation.VerificationPointers[0]();
        });
        it("should throw an exception when genericParameter expectation of known type and call don't fit",function(){
            methodExpectation.WithParams("test1","test2",It.IsAny(TestType));
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            function notify(){  
              methodExpectation.NotificationPointers[0](arguments);
            };
            notify("test1","test2","string");
            expect(methodExpectation.VerificationPointers.length).toEqual(1);  
            expect(function(){methodExpectation.VerificationPointers[0]()}).toThrow("Invalid argument type. Argument 3 expected to be of type TestType but was string");
        });
        it("should throw an exception when genericParameter expectation and call don't fit",function(){
            methodExpectation.WithParams("test1","test2",It.IsAnyString());
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            function notify(){  
              methodExpectation.NotificationPointers[0](arguments);
            };
            notify("test1","test2",new TestType());
            expect(methodExpectation.VerificationPointers.length).toEqual(1);  
            expect(function(){methodExpectation.VerificationPointers[0]()}).toThrow("Invalid argument type. Argument 3 expected to be of type string but was TestType");
        });
    });
    describe("public Notify",function(){
        it("should execute all the defined notification pointers with defined args",function(){
          var expectedArgs="expectedArgs";
          var notifiedPointers=0;
          methodExpectation.NotificationPointers.push(function(args){
            notifiedPointers++;
            expect(args).toEqual(expectedArgs);
          });
          methodExpectation.NotificationPointers.push(function(args){
            notifiedPointers++;
            expect(args).toEqual(expectedArgs);
          });
          methodExpectation.Notify(expectedArgs);
          expect(notifiedPointers).toEqual(2);
        });
    });
    describe("public Verify",function(){
        it("should execute all the defined notification pointers with defined args",function(){
          var verifiedPointers=0;
          methodExpectation.VerificationPointers.push(function(args){
            verifiedPointers++;
          });
          methodExpectation.VerificationPointers.push(function(args){
            verifiedPointers++;
          });
          methodExpectation.Verify();
          expect(verifiedPointers).toEqual(2);
        });
    });
});