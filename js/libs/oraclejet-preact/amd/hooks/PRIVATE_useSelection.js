define(["exports","preact/hooks","../utils/UNSAFE_arrayUtils","../utils/UNSAFE_keys"],(function(e,t,r,n){"use strict";r.stringLiteralArray(["toggle","replace"]);const l=(e,t,r,l,s,o,i,u,c,y)=>{const a=t(e);if(null==a)return;if(e.shiftKey&&u&&y&&((e,t,r,l)=>"multiple"===r&&"toggle"!==l&&n.containsKey(t,e))(u,r,l,s))return y({value:{start:u,end:a}}),void(i&&(i.current=a));let K=r;n.containsKey(r,a)?"toggle"===s||e.ctrlKey||e.metaKey||" "===e.key?K=n.removeKey(r,a,o):"multiple"===l&&(r.all||r.keys.size>1)&&(K={all:!1,keys:new Set([a])}):K="single"===l||"replace"===s&&!e.ctrlKey&&!e.metaKey?{all:!1,keys:new Set([a])}:n.addKey(r,a),r!=K&&c&&c({value:K})};e.useSelection=function(e,r,s,o,i,u,c,y,a,K,f){const k=t.useRef(),d=t.useCallback((t=>{l(t,e,r,s,i,o,k,c,u,f),t.shiftKey||(k.current=void 0)}),[e,r,s,i,o,k,c,u,f]),p=t.useCallback((t=>{" "===t.key&&l(t,e,r,s,i,o,k,c,u,t.shiftKey?f:void 0)}),[k.current,e,r,s,i,o,c,u,f]),v=t.useCallback((e=>{if(" "!==e.key){if("ArrowDown"===e.key||"ArrowUp"===e.key)if(e.shiftKey&&a&&K){let t=r;!k.current&&n.isKeyDefined(y)&&(t={all:!1,keys:new Set([y])});const l=a(k.current||y,"ArrowDown"!==e.key)();l&&(n.containsKey(t,l)?k.current&&(t=n.removeKey(t,k.current,o)):t=n.addKey(t,l),k.current=l,K(l)),r!=t&&u&&u({value:t})}else k.current=void 0}else e.preventDefault()}),[k.current,r,o,u]);return{selectionProps:"none"===s||null==u?{}:{onClick:d,onKeyDown:v,onKeyUp:p}}},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=PRIVATE_useSelection.js.map
