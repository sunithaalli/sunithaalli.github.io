define(["exports","preact/jsx-runtime","preact","preact/hooks","./UNSAFE_TransitionGroup"],(function(n,e,t,a,i){"use strict";const s=t.createContext({});n.MessagesContext=s,n.MessagesManager=function(n){const{children:r,data:l}=n,{handleEntering:o,handleExiting:c}=function({animations:n,startAnimation:e=(()=>Promise.resolve(!1)),onMessageWillRemove:t}){const{addBusyState:i}=a.useContext(s),r=a.useCallback((n=>{var e;return null!==(e=null==i?void 0:i(n))&&void 0!==e?e:()=>{}}),[i]),l=a.useCallback((async(t,a)=>{if(!a)return;const i=null==n?void 0:n[t];if(i){const n=r(`performing message animation - ${t}`);await e(a,t,i),n()}}),[n,e,r]),o=a.useCallback((async(n,e)=>{await l("enter",n),null==e||e()}),[l]),c=a.useCallback((async(n,e,a)=>{await l("exit",n),a&&(null==t||t(a.key,a.index,n)),null==e||e()}),[l,t]);return{handleEntering:o,handleExiting:c}}(n);return e.jsx(i.TransitionGroup,Object.assign({elementType:t.Fragment},{children:l.map(((n,t)=>e.jsx(i.Transition,Object.assign({metadata:{index:t,key:n.key},onEntering:o,onExiting:c},{children:null==r?void 0:r({index:t,item:n})}),n.key)))}))}}));
//# sourceMappingURL=MessagesManager-71797cf8.js.map
