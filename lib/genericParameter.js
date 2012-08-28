function GenericParameter(type){
  this.type=type;
};
GenericParameter.prototype.GetType=function()
{ 
  return this.type;
};
GenericParameter.prototype.IsAny=function(type)
{
  var typeName=type.name;
  if(!typeName)
    typeName=typeof(type);
  this.type=typeName;
  return this;
};
GenericParameter.prototype.IsAnyFunction=function()
{
  this.type=typeof(function(){});
  return this;
};
GenericParameter.prototype.IsAnyObject=function()
{
  this.type=typeof(new Object());
  return this;
};
GenericParameter.prototype.IsAnyString=function()
{
  this.type=typeof("");
  return this;
};
GenericParameter.prototype.IsAnyNumber=function()
{
  this.type=typeof(0);
  return this;
};
var It=new GenericParameter();