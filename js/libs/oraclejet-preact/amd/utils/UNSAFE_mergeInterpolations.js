define(["exports","./UNSAFE_classNames","../_curry1-f1c75636","../_curry2-63a708f9","../_has-491b2156","../classNames-b3be51c1"],(function(n,r,t,e,u,c){"use strict";var o=t._curry1_1,i=e._curry2_1,f=t._isPlaceholder_1;var s=function(n){return function r(t,e,u){switch(arguments.length){case 0:return r;case 1:return f(t)?r:i((function(r,e){return n(t,r,e)}));case 2:return f(t)&&f(e)?r:f(t)?i((function(r,t){return n(r,e,t)})):f(e)?i((function(r,e){return n(t,r,e)})):o((function(r){return n(t,e,r)}));default:return f(t)&&f(e)&&f(u)?r:f(t)&&f(e)?i((function(r,t){return n(r,t,u)})):f(t)&&f(u)?i((function(r,t){return n(r,e,t)})):f(e)&&f(u)?i((function(r,e){return n(t,r,e)})):f(t)?o((function(r){return n(r,e,u)})):f(e)?o((function(r){return n(t,r,u)})):f(u)?o((function(r){return n(t,e,r)})):n(t,e,u)}}};var a=function(n){return"[object Object]"===Object.prototype.toString.call(n)},_=s,l=u._has_1,b=a,d=_((function(n,r,t){var e,u={};for(e in r)l(e,r)&&(u[e]=l(e,t)?n(e,r[e],t[e]):r[e]);for(e in t)l(e,t)&&!l(e,u)&&(u[e]=t[e]);return u})),y=s((function n(r,t,e){return d((function(t,e,u){return b(e)&&b(u)?n(r,e,u):r(t,e,u)}),t,e)}));const h=(n,r,t)=>"class"===n?c.classNames([r,t]):t;n.mergeInterpolations=n=>r=>n.reduce(((n,t)=>y(h,n,t(r))),{}),Object.defineProperty(n,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_mergeInterpolations.js.map