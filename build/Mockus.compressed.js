Object.prototype.ForEach=function(a){var c={},b=!1;for(element in this)if(c[element]||(b=a(element,this[element])),b)break};Function.prototype.Name=function(){var a=this.name;return a?a:(a=this.toString().match(/^function ([^(]+)/))&&2<=a.length?a[1]:null};
function GenericParameter(a){this.type=a}GenericParameter.prototype.GetType=function(){return this.type};GenericParameter.prototype.IsAny=function(a){var b=a.Name?a.Name():null;b||(b=typeof a);this.type=b;return this};GenericParameter.prototype.IsAnyFunction=function(){this.type="function";return this};GenericParameter.prototype.IsAnyObject=function(){this.type="object";return this};GenericParameter.prototype.IsAnyString=function(){this.type="string";return this};
GenericParameter.prototype.IsAnyNumber=function(){this.type="number";return this};var It=new GenericParameter;
function MethodExpectation(a){this.type="method";this.name=a;this.expectedNotifications=this.timesNotified=0;this.NotificationPointers=[];this.VerificationPointers=[];this.functions=[];for(var b in window)window.hasOwnProperty(b)&&"function"===typeof window[b]&&this.functions.push(window[b])}MethodExpectation.prototype.GetType=function(){return this.type};MethodExpectation.prototype.GetName=function(){return this.name};
MethodExpectation.prototype.ToBeCalled=function(a){var b=this;if(b.ToBeCalledsAlreadyInitiated)throw"ToBeCalled over "+this.type+" "+this.name+" can only be defined once per test";a=a?a:1;b.expectedNotifications+=a;b.timesExpected=a;b.timesCalled=0;b.NotificationPointers.push(function(){b.timesCalled++});b.VerificationPointers.push(function(){if(b.timesExpected!=b.timesCalled)throw"Times to be called not succeed. Expected "+b.timesExpected+" but was "+b.timesCalled;});b.ToBeCalledsAlreadyInitiated=
!0;return this};
MethodExpectation.prototype.WithParams=function(){var a=this;a.expectedNotifications++;a.WithParamsAlreadyInitiated||(a.WithParamsExpectations=[],a.WithParamsNotifications=[]);a.WithParamsExpectations.push(arguments);a.WithParamsAlreadyInitiated||(a.NotificationPointers.push(function(b){a.WithParamsNotifications.push(b)}),a.VerificationPointers.push(function(){for(var b=0;b<a.WithParamsExpectations.length;b++){if(b>=a.WithParamsNotifications.length)throw"WithParams has been set up "+a.WithParamsExpectations.length+
" times but has been called "+a.WithParamsNotifications.length+" times";for(var d=a.WithParamsExpectations[b],e=a.WithParamsNotifications[b],k=d.length,g=Array(d.length),f=Array(d.length),c=0;c<d.length;c++)f[c]=d[c]instanceof GenericParameter?d[c].GetType():typeof d[c],g[c]=d[c];var d=[],h=[],j=0;e&&(j=e.length);for(c=0;c<j;c++)d[c]=e[c],h[c]=typeof e[c];if(k!=j)throw"Invalid arguments length. Expected "+k+" but was "+j;for(c=0;c<f.length;c++)if(f[c]!=h[c]){e=h[c];try{var l=eval(f[c]);if(!(d[c]instanceof
l))throw"";}catch(m){if("object"==h[c])for(b=0;b<a.functions.length;b++)d[c]instanceof a.functions[b]&&(e=a.functions[b].Name?a.functions[b].Name():"object");throw"Invalid argument type. Argument "+(c+1)+" expected to be of type "+f[c]+" but was "+e;}}for(c=0;c<d.length;c++)if(g[c]!=d[c]&&!(g[c]instanceof GenericParameter))throw"Invalid argument value. Argument "+(c+1)+" expected to be "+g[c]+" but was "+d[c];}}));a.WithParamsAlreadyInitiated=!0;return this};
MethodExpectation.prototype.Returns=function(a){this.expectedNotifications++;this.NotificationPointers.push(function(){return a});this.VerificationPointers.push(function(){throw"Returns expectation not accomplished. Expected to return "+a;});return this};
MethodExpectation.prototype.Notify=function(a){if(0==this.NotificationPointers.length)throw"Element: "+this.name+" has been called without a valid setup";if(this.timesNotified>=this.expectedNotifications)throw"Element: "+this.name+" has been called more times than setups performed";this.timesNotified++;for(var b=0;b<this.NotificationPointers.length;b++){var d=this.NotificationPointers[b](a);if(d)return this.NotificationPointers.splice(b,1),this.VerificationPointers.splice(b,1),d}};
MethodExpectation.prototype.Verify=function(){for(var a=0;a<this.VerificationPointers.length;a++)this.VerificationPointers[a]()};
function Mockus(){}Mockus.Mock=function(d){var b=new d,c=new d;b.ForEach(function(a,e){"function"==typeof e&&(b[a]=function(){c[a].Notify(arguments)})});c.ForEach(function(a,b){if("function"==typeof b)c[a]=new MethodExpectation(a);else throw"Property mocking not implemented yet: "+a;});b.Expects=c;b.VerifyAll=function(){c.ForEach(function(a){try{"function"==typeof b[a]&&c[a].Verify()}catch(e){throw"Mock for component "+d.Name()+": "+c[a].GetType()+" "+a+" -> "+e;}})};return b};