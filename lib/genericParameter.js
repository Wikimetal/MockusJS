function GenericParameter(type){
  this.type=type;
  this.stringifiedValue = null;
  this.contains=null;
};
GenericParameter.prototype.GetType=function()
{ 
  return this.type;
};
GenericParameter.prototype.GetStringifiedValue=function()
{ 
  return this.stringifiedValue;
};
GenericParameter.prototype.ShouldContain = function()
{
  return this.contains;
};
GenericParameter.IsAny=function(type)
{
  var parameter=new GenericParameter()
  parameter.type=typeof(function(){});
  var typeName=MockusName?MockusName(type):null;
  if(!typeName)
    typeName=typeof(type);
  parameter.type=typeName;
  return parameter;
};
GenericParameter.IsAnyFunction=function()
{
  var parameter=new GenericParameter()
  parameter.type=typeof(function(){});
  return parameter;
};
GenericParameter.IsAnonymousFunctionThatContains=function(value)
{
  var parameter=new GenericParameter()
  parameter.type=typeof(function(){});
  parameter.contains = value;
  return parameter;
};
GenericParameter.IsAnyObject=function()
{
  var parameter=new GenericParameter()
  parameter.type=typeof(new Object());
  return parameter;
};
GenericParameter.IsStringifiedObject=function(value)
{
  if(!JSON || !JSON.stringify)
  {
    throw new Error("JSON.stringify not supported in your browser. Please update your browser or add dependency JSON2 library (https://github.com/douglascrockford/JSON-js)");
  }
  var parameter=new GenericParameter()
  parameter.type=typeof(value);
  parameter.stringifiedValue = JSON.stringify(value);
  return parameter;
};
GenericParameter.IsAnyString=function()
{
  var parameter=new GenericParameter()
  parameter.type=typeof("");
  return parameter;
};
GenericParameter.IsAnyNumber=function()
{
  var parameter=new GenericParameter()
  parameter.type=typeof(0);
  return parameter;
};
var It=GenericParameter;