/* MockusJS v1.0.2 */
function MockusForEach(a,b){var d={},c=!1;for(element in a)if(d[element]||(c=b(element,a[element])),c)break}function MockusName(a){var b=a.name;return b?b:(a=a.toString().match(/^function ([^(]+)/))&&2<=a.length?a[1]:null};
function GenericParameter(a){this.type=a;this.contains=this.stringifiedValue=null}GenericParameter.prototype.GetType=function(){return this.type};GenericParameter.prototype.GetStringifiedValue=function(){return this.stringifiedValue};GenericParameter.prototype.ShouldContain=function(){return this.contains};GenericParameter.IsAny=function(a){var b=new GenericParameter;b.type="function";var c=MockusName?MockusName(a):null;c||(c=typeof a);b.type=c;return b};
GenericParameter.IsAnyFunction=function(){var a=new GenericParameter;a.type="function";return a};GenericParameter.IsAnonymousFunctionThatContains=function(a){var b=new GenericParameter;b.type="function";b.contains=a;return b};GenericParameter.IsAnyObject=function(){var a=new GenericParameter;a.type="object";return a};
GenericParameter.IsStringifiedObject=function(a){if(!JSON||!JSON.stringify)throw Error("JSON.stringify not supported in your browser. Please update your browser or add dependency JSON2 library (https://github.com/douglascrockford/JSON-js)");var b=new GenericParameter;b.type=typeof a;b.stringifiedValue=JSON.stringify(a);return b};GenericParameter.IsAnyString=function(){var a=new GenericParameter;a.type="string";return a};
GenericParameter.IsAnyNumber=function(){var a=new GenericParameter;a.type="number";return a};var It=GenericParameter;
function MethodExpectation(b){this.type="method";this.name=b;this.expectedNotifications=this.timesNotified=0;this.NotificationPointers=[];this.VerificationPointers=[];this.functions=[];for(var c in window)window.hasOwnProperty&&window.hasOwnProperty(c)&&"function"===typeof window[c]&&this.functions.push(window[c])}MethodExpectation.prototype.GetType=function(){return this.type};MethodExpectation.prototype.GetName=function(){return this.name};
MethodExpectation.prototype.ToBeCalled=function(b){var c=this;if(c.ToBeCalledsAlreadyInitiated)throw"ToBeCalled over "+this.type+" "+this.name+" can only be defined once per test";b=b?b:1;c.expectedNotifications+=b;c.timesExpected=b;c.timesCalled=0;c.NotificationPointers.push(function(){c.timesCalled++});c.VerificationPointers.push(function(){if(c.timesExpected!=c.timesCalled)throw"Times to be called not succeed. Expected "+c.timesExpected+" but was "+c.timesCalled;});c.ToBeCalledsAlreadyInitiated=
!0;return this};
MethodExpectation.prototype.WithParams=function(){var b=this;b.expectedNotifications++;b.WithParamsAlreadyInitiated||(b.WithParamsExpectations=[],b.WithParamsNotifications=[]);b.WithParamsExpectations.push(arguments);b.WithParamsAlreadyInitiated||(b.NotificationPointers.push(function(c){b.WithParamsNotifications.push(c)}),b.VerificationPointers.push(function(){for(var c=0;c<b.WithParamsExpectations.length;c++){if(c>=b.WithParamsNotifications.length)throw"WithParams has been set up "+b.WithParamsExpectations.length+
" times but has been called "+b.WithParamsNotifications.length+" times";for(var d=b.WithParamsExpectations[c],g=b.WithParamsNotifications[c],l=d.length,e=Array(d.length),f=Array(d.length),a=0;a<d.length;a++)f[a]=d[a]instanceof GenericParameter?d[a].GetType():typeof d[a],e[a]=d[a];var d=[],h=[],k=0;g&&(k=g.length);for(a=0;a<k;a++)d[a]=g[a],h[a]=typeof g[a];if(l!=k)throw"Invalid arguments length. Expected "+l+" but was "+k;for(a=0;a<f.length;a++)if(f[a]!=h[a]){g=h[a];try{var m=eval(f[a]);if(!(d[a]instanceof
m))throw"";}catch(n){if("object"==h[a])for(c=0;c<b.functions.length;c++)d[a]instanceof b.functions[c]&&(g=MockusName?MockusName(b.functions[c]):"object");throw"Invalid argument type. Argument "+(a+1)+" expected to be of type "+f[a]+" but was "+g;}}for(a=0;a<d.length;a++){if(e[a]!=d[a]&&!(e[a]instanceof GenericParameter))throw"Invalid argument value. Argument "+(a+1)+" expected to be "+e[a]+" but was "+d[a];if(e[a]instanceof GenericParameter)if(null!=e[a].GetStringifiedValue()){if(f=JSON.stringify(d[a]),
e[a].GetStringifiedValue()!=f)throw"Invalid argument value. Argument "+(a+1)+" expected to be "+e[a].GetStringifiedValue()+" but was "+f;}else if(null!=e[a].ShouldContain()&&(f=d[a].toString(),0>f.indexOf(e[a].ShouldContain())))throw"Invalid argument value. Argument "+(a+1)+" expected to contain "+e[a].ShouldContain()+" but was "+d[a].toString();}}}));b.WithParamsAlreadyInitiated=!0;return this};
MethodExpectation.prototype.Returns=function(b){this.expectedNotifications++;this.NotificationPointers.push(function(){return b});this.VerificationPointers.push(function(){throw"Returns expectation not accomplished. Expected to return "+b;});return this};
MethodExpectation.prototype.Notify=function(b){if(0==this.NotificationPointers.length)throw"Element: "+this.name+" has been called without a valid setup";if(this.timesNotified>=this.expectedNotifications)throw"Element: "+this.name+" has been called more times than setups performed";this.timesNotified++;for(var c=0;c<this.NotificationPointers.length;c++){var d=this.NotificationPointers[c](b);if("undefined"!=d+"")return this.NotificationPointers.splice(c,1),this.VerificationPointers.splice(c,1),d}};
MethodExpectation.prototype.Verify=function(){for(var b=0;b<this.VerificationPointers.length;b++)this.VerificationPointers[b]()};
function Mockus(){}
Mockus.Mock=function(d){var b=new d,c=new d;MockusForEach(b,function(a,e){"function"==typeof e&&(b[a]=function(){return c[a].Notify(arguments)})});MockusForEach(c,function(a,b){if("function"==typeof b)c[a]=new MethodExpectation(a);else throw"Property mocking not implemented yet: "+a;});b.Expects=c;b.VerifyAll=function(){MockusForEach(c,function(a,e){try{"function"==typeof b[a]&&c[a].Verify()}catch(f){throw"Mock for component "+MockusName(d)+": "+c[a].GetType()+" "+a+" -> "+f;}})};return b};