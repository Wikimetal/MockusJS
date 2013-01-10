function Mockus(){};
Mockus.Mock=function(type)
{
  var mock=new type();
  var expectationMock=new type();
  
  mock.ForEach(function(elementName,element){
    if(typeof(element)==typeof(function(){}))
      mock[elementName]=function(){
        expectationMock[elementName].Notify(arguments);
      }
  });
  
  expectationMock.ForEach(function(elementName,element){
    if(typeof(element)==typeof(function(){}))
      expectationMock[elementName]=new MethodExpectation(elementName);
    else
      throw "Property mocking not implemented yet: "+elementName;
  });
  
  mock.Expects=expectationMock;

  mock.VerifyAll=function()
  {
    expectationMock.ForEach(function(elementName,element){
      try{
        if(typeof(mock[elementName])==typeof(function(){}))
          expectationMock[elementName].Verify();
      }
      catch(e){
        throw "Mock for component " + type.Name() + ": "+expectationMock[elementName].GetType()+" "+elementName+" -> "+e;
      }
    });
  };
  return mock;
};