MockusJS
========

Mocking library for JS

How it works?
- First you have to create the mock for the type you desire.
 Remember that Mockus will only mock types, it will not work if you try yo mock an instance of any type.

  **function MyType(){};**  
  **MyType.prototype.MyMethod=function(){};**  
  **var myMock=Mockus.Mock(MyType);**  
  
- Once we've created the mock, the we can perform expectations over it. We've got different expectation types:

  *ToBeCalled*  
  **myMock.Expects.MyMethod.ToBeCalled();**  
  -or-  
  **myMock.Expects.MyMethod.ToBeCalled(5);**  
  This expectation will setup a listener that will be aware of the times that the method of the expectation is called.
  If no parameter is sent, it will be check that is called 1 time. 
  
  *WithParams*  
  **myMock.Expects.MyMethod.WithParams("param1","param2"...)**  
  This expectation will setup a listener that will be aware of the parameters that are sent to the method of the expectation.
  Every expectation will be aware of a single call, so, for the first expectation we'll check the parameters of the first call, for the second expectation, the second call, and so on.
  
  When you want to setup a WithParams expectation but you are not sure about the parameters' values, you can setup a generic parameter, that will check only the type and not the value.
  You've got some options to do so:
  - It.IsAny(MyType)  
  **myMock.Expects.MyMethod.WithParams(It.IsAny(MyType));**  
  This will check that the first parameter that will be passed to our method is an instance of MyType, but it will not check that instance itself.
  
  - It.IsAnyFunction()
  - It.IsAnyObject()
  - It.IsAnyString()
  - It.IsAnyNumber()
  
  *Returns*  
  **myMock.Expects.MyMethod.Returns("returnValue");**
  This expectation will setup a listener that will return the desired value when mocked method is called.  
  Expectations are executed in order, so if you want to perform some "Returns" expectations over a method, keep in mind that:  
  
  **myMock.Expects.MyMethod.Returns("returnValue1");**  
  **myMock.Expects.MyMethod.Returns("returnValue2");**  
     
  First call to mocked method will return "returnValue1"  
  Second call to mocked method will return "returnValue2"  
  Third call to mocked method will NOT return anything  
  
  Returns also will throw an error when an expectation is not accomplished.
      
- Once we've set up the expectations and out method to be tested is called, is time to verify our mock. Easy:
  **myMock.VerifyAll();**

- Errors! What happens when expectations are not accomplished? Mockus will throw an expection when an expectation is not accomplished.
Exceptions contain the whole information to allow you solve the problem. An example:  
  
*Mock for component IEventManager: method AddEvent -> Times to be called not succeed. Expected 3 but was 2*  
*Mock for component IEventManager: method AddEvent -> Invalid argument value. Argument 2 expected to be keydown but was keyup*  
*Mock for component IEventManager: method AddEvent -> Invalid argument type. Argument 2 expected to be of type function but was string*

*LIMITATIONS*
- This version will not allow to mock types with properties, will work only with types with methods.

- For more details. Please have a look to the tests inside /test/lib. There you'll have some nice Jasmine tests which will help you to understand how it works


  