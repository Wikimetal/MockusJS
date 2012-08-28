/*{
  Method:"ForEach",
  Type: "public",
  Description:"Adds this method to the native object",
  Params:{
    {Type:"delegate",Description:"The function to be called for each element found in the object"}
  }
}*/
Object.prototype.ForEach = function (fpointer) {
    var obj = new Object();
    var stop = false;
    for (element in this) {
        if (!obj[element])
            stop = fpointer(element,this[element]);
        if (stop)
            break;
    }
};