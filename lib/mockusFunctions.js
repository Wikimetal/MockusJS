function MockusForEach(currentObj,fpointer) {
    var obj = new Object();
    var stop = false;
    for (element in currentObj) {
        if (!obj[element])
            stop = fpointer(element,currentObj[element]);
        if (stop)
            break;
    }
}

function MockusName(currentObj)
{
  var name=currentObj.name;
  if(name)
    return name;
  var matches=currentObj.toString().match(/^function ([^(]+)/);
  return (matches && matches.length>=2)?matches[1]:null;
}