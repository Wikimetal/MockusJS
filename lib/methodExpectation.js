function MethodExpectation(name){
  this.type="method";
  this.name=name;
  this.timesNotified=0;
  this.expectedNotifications=0;
  this.NotificationPointers=new Array();
  this.VerificationPointers=new Array();
  this.functions = new Array();
  for (var f in window) if (window.hasOwnProperty && window.hasOwnProperty(f) && typeof window[f] === 'function')
      this.functions.push(window[f]);
};
MethodExpectation.prototype.GetType=function()
{
  return this.type;
};

MethodExpectation.prototype.GetName=function()
{
  return this.name;
};

MethodExpectation.prototype.ToBeCalled=function()
{
  var self=this;
  if(self.ToBeCalledsAlreadyInitiated)
    throw "ToBeCalled over "+this.type+" "+this.name+" can only be defined once per test";
  var timesToBeCalled=arguments[0]?arguments[0]:1;
  self.expectedNotifications+=timesToBeCalled;
  self.timesExpected=timesToBeCalled;
  self.timesCalled=0;
  self.NotificationPointers.push(function(){
    self.timesCalled++;
  });
  self.VerificationPointers.push(function(){
    if(self.timesExpected!=self.timesCalled)
      throw "Times to be called not succeed. Expected "+self.timesExpected+" but was "+self.timesCalled;
  });
  self.ToBeCalledsAlreadyInitiated=true;
  return this;
};

MethodExpectation.prototype.WithParams=function()
{
  var self=this;
  self.expectedNotifications++;
  if(!self.WithParamsAlreadyInitiated)
  {
    self.WithParamsExpectations=new Array();
    self.WithParamsNotifications=new Array();
  }
  self.WithParamsExpectations.push(arguments);
  
  if(!self.WithParamsAlreadyInitiated)
  {
    self.NotificationPointers.push(function(args){
      self.WithParamsNotifications.push(args)
    });
    self.VerificationPointers.push(function(){
      for(var i=0;i<self.WithParamsExpectations.length;i++)
      {
        if(i>=self.WithParamsNotifications.length)
          throw "WithParams has been set up "+self.WithParamsExpectations.length+" times but has been called "+self.WithParamsNotifications.length+" times";
          
        var expectationArguments=self.WithParamsExpectations[i];
        var notificationArguments=self.WithParamsNotifications[i];
        
        var argsExpectedLength=expectationArguments.length;
        var expectedArguments=new Array(expectationArguments.length);
        var expectedArgumentsType=new Array(expectationArguments.length);
        for(var j=0;j<expectationArguments.length;j++)
        {
          if(expectationArguments[j] instanceof GenericParameter)
            expectedArgumentsType[j]=expectationArguments[j].GetType();
          else
            expectedArgumentsType[j]=typeof(expectationArguments[j]);
          expectedArguments[j]=expectationArguments[j];
        }
        
        var currentArguments=new Array();
        var currentArgumentsTypes=new Array();
        var currentArgumentsLength=0;
        
        if(notificationArguments)
          currentArgumentsLength=notificationArguments.length;
          
        for(var j=0;j<currentArgumentsLength;j++)
        {
          currentArguments[j]=notificationArguments[j];
          currentArgumentsTypes[j]=typeof(notificationArguments[j]);
        }

        if(argsExpectedLength!=currentArgumentsLength)
          throw "Invalid arguments length. Expected "+argsExpectedLength+" but was "+currentArgumentsLength;
        for(var j=0;j<expectedArgumentsType.length;j++)
          if(expectedArgumentsType[j]!=currentArgumentsTypes[j])
          {
            var type=currentArgumentsTypes[j];
            try
            {
              var typeExpected=eval(expectedArgumentsType[j]);
              var sameType=(currentArguments[j] instanceof typeExpected);
              if(!sameType)
                throw "";
            }
            catch(e)
            {
              if(currentArgumentsTypes[j]=="object")
                for(var k=0;k<self.functions.length;k++)
                  if(currentArguments[j] instanceof self.functions[k])
                    type=MockusName?MockusName(self.functions[k]):"object";
              throw "Invalid argument type. Argument "+(j+1)+" expected to be of type "+expectedArgumentsType[j]+" but was "+type;
            }
          }
        for(var j=0;j<currentArguments.length;j++)
          if(expectedArguments[j]!=currentArguments[j] && !(expectedArguments[j] instanceof GenericParameter))
            throw "Invalid argument value. Argument "+(j+1)+" expected to be "+expectedArguments[j]+" but was "+currentArguments[j];
          else if (expectedArguments[j] instanceof GenericParameter)
          {
            if(expectedArguments[j].GetStringifiedValue() != null)
            {
              var strigifiedParameterValue = JSON.stringify(currentArguments[j]);
              if (expectedArguments[j].GetStringifiedValue() != strigifiedParameterValue)
                throw "Invalid argument value. Argument "+(j+1)+" expected to be "+expectedArguments[j].GetStringifiedValue()+" but was " + strigifiedParameterValue;
            }
            else if (expectedArguments[j].ShouldContain() != null)
            {
              var strigifiedParameterValue = currentArguments[j].toString();
              if (strigifiedParameterValue.replace(/ /g,'').indexOf(expectedArguments[j].ShouldContain().replace(/ /g,'')) < 0)
                throw "Invalid argument value. Argument "+(j+1)+" expected to contain "+expectedArguments[j].ShouldContain()+" but was " + currentArguments[j].toString();
            }
          }
      }
    });
  }
  self.WithParamsAlreadyInitiated=true;
  return this;
};

MethodExpectation.prototype.Returns=function(returnValue)
{
  var self=this;
  self.expectedNotifications++;
  self.NotificationPointers.push(function(){
    return returnValue;
  });
  self.VerificationPointers.push(function(){
    throw "Returns expectation not accomplished. Expected to return "+returnValue;
  });
  return this;
};

MethodExpectation.prototype.Notify=function(args){
  var self=this;
    if(self.NotificationPointers.length==0)
      throw "Element: "+self.name+" has been called without a valid setup";
    if(self.timesNotified>=self.expectedNotifications)
      throw "Element: "+self.name+" has been called more times than setups performed";
    self.timesNotified++;
    for(var i=0;i<self.NotificationPointers.length;i++)
    {
      var returnValue=self.NotificationPointers[i](args);
      if(returnValue+"" != "undefined")
      {
        self.NotificationPointers.splice(i,1);
        self.VerificationPointers.splice(i,1);
        return returnValue;
      }
    }
};

MethodExpectation.prototype.Verify=function(){
  var self=this;
    for(var i=0;i<self.VerificationPointers.length;i++)
      self.VerificationPointers[i]();
};

