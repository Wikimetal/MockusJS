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
        it("should throw an exception when the setup has been already performed",function(){
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
    describe("public Returns",function(){
        it("should return expected value when notified",function(){
            var returnValue="returnValue";
            methodExpectation.Returns(returnValue);
            expect(methodExpectation.NotificationPointers.length).toEqual(1);
            expect(methodExpectation.Notify()).toEqual(returnValue);
        });
        it("should return expected value when notified more than one time",function(){
            var returnValue1="returnValue1";
            var returnValue2="returnValue2";
            methodExpectation.Returns(returnValue1);
            methodExpectation.Returns(returnValue2);
            expect(methodExpectation.NotificationPointers.length).toEqual(2);
            expect(methodExpectation.Notify()).toEqual(returnValue1);
            expect(methodExpectation.Notify()).toEqual(returnValue2);
        });
        it("should throw exception when expectation has not been executed",function(){
            var returnValue1="returnValue1";
            var returnValue2="returnValue2";
            methodExpectation.Returns(returnValue1);
            methodExpectation.Returns(returnValue2);
            expect(methodExpectation.NotificationPointers.length).toEqual(2);
            expect(methodExpectation.Notify()).toEqual(returnValue1);
            expect(function(){methodExpectation.Verify()}).toThrow("Returns expectation not accomplished. Expected to return returnValue2");
        });
    });
    describe("public Notify",function(){
        it("should execute all the defined notification pointers with defined args",function(){
          var expectedArgs="expectedArgs";
          var notifiedPointers=0;
          methodExpectation.expectedNotifications=1;
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
        it("should throw an exception when is called and no setup has been performed",function(){
          expect(function(){methodExpectation.Notify()}).toThrow("Element: "+methodName+" has been called without a valid setup");
        });
        it("should throw an exception when is called more times than setups performed",function(){
          methodExpectation.ToBeCalled();
          methodExpectation.Notify()
          expect(function(){methodExpectation.Notify()}).toThrow("Element: "+methodName+" has been called more times than setups performed");
        });
        it("should not throw an exception when is called more times than setups performed",function(){
          methodExpectation.ToBeCalled(2);
          methodExpectation.Notify();
          methodExpectation.Notify();
          expect(function(){methodExpectation.Notify()}).toThrow("Element: "+methodName+" has been called more times than setups performed");
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
    
    describe("integration tests",function(){
        it("should verify all setups in order. Testing expectation 1...",function(){
          methodExpectation.ToBeCalled(2).WithParams("param1","param2").Returns(10);
          methodExpectation.Notify();
          expect(function(){methodExpectation.Verify()}).toThrow("Times to be called not succeed. Expected 2 but was 1");
        });
        it("should verify all setups in order. Testing expectation 2.1...",function(){
          methodExpectation.ToBeCalled(2).WithParams("param1","param2").WithParams("param3","param4").Returns(10);
          methodExpectation.Notify();
          methodExpectation.Notify();
          expect(function(){methodExpectation.Verify()}).toThrow("Invalid arguments length. Expected 2 but was 0");
        });
        it("should verify all setups in order. Testing expectation 2.2...",function(){
          methodExpectation.ToBeCalled(2).WithParams("param1","param2").WithParams("param3","param4").Returns(10);
          methodExpectation.Notify(["param2","param1"]);
          methodExpectation.Notify();
          expect(function(){methodExpectation.Verify()}).toThrow("Invalid argument value. Argument 1 expected to be param1 but was param2");
        });
        it("should verify all setups in order. Testing expectation 2.3...",function(){
          methodExpectation.ToBeCalled(2).WithParams("param1","param2").WithParams("param3","param4").Returns(10);
          methodExpectation.Notify(["param2",0]);
          methodExpectation.Notify();
          expect(function(){methodExpectation.Verify()}).toThrow("Invalid argument type. Argument 2 expected to be of type string but was number");
        });
        it("should verify all setups in order. Testing expectation 2.3...",function(){
          methodExpectation.ToBeCalled(2).WithParams("param1","param2").WithParams("param3","param4").Returns(10);
          methodExpectation.Notify(["param1","param2"]);
          methodExpectation.Notify();
          expect(function(){methodExpectation.Verify()}).toThrow("Invalid arguments length. Expected 2 but was 0");
        });
        it("should verify all setups in order. Testing expectation 2.3...",function(){
          methodExpectation.ToBeCalled(2).WithParams("param1","param2").WithParams("param3","param4").Returns(10);
          methodExpectation.Notify(["param1","param2"]);
          methodExpectation.Notify(["param4","param3"]);
          expect(function(){methodExpectation.Verify()}).toThrow("Invalid argument value. Argument 1 expected to be param3 but was param4");
        });
        it("should verify all setups in order. Testing expectation 2.4...",function(){
          methodExpectation.ToBeCalled(2).WithParams("param1","param2").WithParams("param3","param4").Returns(10);
          methodExpectation.Notify(["param1","param2"]);
          methodExpectation.Notify(["param3",0]);
          expect(function(){methodExpectation.Verify()}).toThrow("Invalid argument type. Argument 2 expected to be of type string but was number");
        });
        it("should verify all setups in order. Testing expectation 3.1...",function(){
          var returnValue1="returnValue1";
          var returnValue2="returnValue2"; 
          methodExpectation.ToBeCalled(2).WithParams("param1","param2").WithParams("param3","param4").Returns(returnValue1).Returns(returnValue2);
          expect(methodExpectation.Notify(["param1","param2"])).toEqual(returnValue1);
          expect(methodExpectation.Notify(["param3","param4"])).toEqual(returnValue2);
          methodExpectation.Verify();
        });
        //This method tests the same functionality as the previous one but expectations have been divided in order to keep code more readable
        it("should verify all setups in order. Testing expectation 3.2...",function(){
          var returnValue1="returnValue1";
          var returnValue2="returnValue2"; 
          methodExpectation.ToBeCalled(2);
          methodExpectation.WithParams("param1","param2").Returns(returnValue1);
          methodExpectation.WithParams("param3","param4").Returns(returnValue2);
          expect(methodExpectation.Notify(["param1","param2"])).toEqual(returnValue1);
          expect(methodExpectation.Notify(["param3","param4"])).toEqual(returnValue2);
          methodExpectation.Verify();
        });

        it("Buggy case when returns must return false",function(){
          var returnValue1=false;
          methodExpectation.WithParams("param1","param2").Returns(returnValue1);
          expect(methodExpectation.Notify(["param1","param2"])).toEqual(returnValue1);
          methodExpectation.Verify();
        });

        it("Buggy case when using Generic parameter multiple times in same Expectation",function(){
          var returnValue1=false;
          methodExpectation.WithParams("param1",It.IsAnyObject(),It.IsAnyString()).Returns(returnValue1);
          expect(methodExpectation.Notify(["param1",new Object(), ""])).toEqual(returnValue1);
          methodExpectation.Verify();
        });
    });
});