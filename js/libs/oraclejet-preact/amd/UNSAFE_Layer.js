define(["exports","preact/compat","preact","preact/jsx-runtime"],(function(e,t,r,n){"use strict";const o=r.createContext({}),a=t.forwardRef(((e,t)=>n.jsx("div",{id:"__oj_layerhost_container",ref:t})));a.displayName="Forwarded<LayerHost>",e.Layer=e=>{var r;const n=t.useContext(o),a=null===(r=n.getHost)||void 0===r?void 0:r.call(n),s=t.useMemo((()=>a),[a]),[c,l]=t.useState(null);return t.useLayoutEffect((()=>{var e;if(!s)return;const t=(null!==(e=s.ownerDocument)&&void 0!==e?e:document).createElement("div");return s.appendChild(t),l(t),()=>{s&&t&&s.contains(t)&&s.removeChild(t),l(null)}}),[s]),c&&t.createPortal(e.children,c)},e.LayerContext=o,e.LayerManager=function({children:e}){const[r,s]=t.useState(),c=t.useCallback((e=>{null!==e&&s(e)}),[]);return n.jsx(o.Consumer,{children:t=>{const s=r?{getHost:()=>r}:{},l=t.getHost?t:s;return n.jsxs(o.Provider,Object.assign({value:l},{children:[e,!t.getHost&&n.jsx(a,{ref:c})]}))}})},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_Layer.js.map
