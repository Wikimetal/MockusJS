function GenericParameter(type){
  this.type=type;
};
GenericParameter.prototype.GetType=function()
{ 
  return this.type;
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
GenericParameter.IsAnyObject=function()
{
  var parameter=new GenericParameter()
  parameter.type=typeof(new Object());
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