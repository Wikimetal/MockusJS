function Mockus(){};
Mockus.Mock=function(type)
{
  var mock=new type();
  var expectationMock=new type();
  
  MockusForEach(mock,function(elementName,element){
    if(typeof(element)==typeof(function(){}))
      mock[elementName]=function(){
        return expectationMock[elementName].Notify(arguments);
      }
  });
  
  MockusForEach(expectationMock,function(elementName,element){
    if(typeof(element)==typeof(function(){}))
      expectationMock[elementName]=new MethodExpectation(elementName);
    else
      throw "Property mocking not implemented yet: "+elementName;
  });
  
  mock.Expects=expectationMock;

  mock.VerifyAll=function()
  {
    MockusForEach(expectationMock,function(elementName,element){
      try{
        if(typeof(mock[elementName])==typeof(function(){}))
          expectationMock[elementName].Verify();
      }
      catch(e){
        throw "Mock for component " + MockusName(type) + ": "+expectationMock[elementName].GetType()+" "+elementName+" -> "+e;
      }
    });
  };
  return mock;
};