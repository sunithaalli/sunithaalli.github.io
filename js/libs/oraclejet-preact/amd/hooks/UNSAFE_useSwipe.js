define(["exports","preact/hooks"],(function(e,t){"use strict";e.useSwipe=function(e,{threshold:r=10,maximumTime:o=300,tolerance:n=50,isDisabled:f=!1}={threshold:10,maximumTime:300,tolerance:50,isDisabled:!1}){const s=t.useRef({pointerDownId:0,startTime:null,prevoffsetX:0,prevoffsetY:0}),i=t.useCallback((e=>{s.current.pointerDownId?p():s.current={pointerDownId:e.pointerId,startTime:e.timeStamp,prevoffsetX:e.offsetX,prevoffsetY:e.offsetY}}),[]),u=t.useCallback((t=>{t.pointerId===s.current.pointerDownId&&s.current.startTime&&t.timeStamp-s.current.startTime<o&&(s.current.prevoffsetX-t.offsetX>r&&Math.abs(t.offsetY-s.current.prevoffsetY)<=n?null==e||e({direction:"left"}):t.offsetX-s.current.prevoffsetX>r&&Math.abs(t.offsetY-s.current.prevoffsetY)<=n?null==e||e({direction:"right"}):s.current.prevoffsetY-t.offsetY>r&&Math.abs(t.offsetX-s.current.prevoffsetX)<=n?null==e||e({direction:"up"}):t.offsetY-s.current.prevoffsetY>r&&Math.abs(t.offsetX-s.current.prevoffsetX)<=n&&(null==e||e({direction:"down"}))),p()}),[r,e]),p=t.useCallback((()=>{s.current={pointerDownId:null,startTime:0,prevoffsetX:0,prevoffsetY:0}}),[]);return{swipeProps:f?{}:{onPointerDown:i,onPointerUp:u,onPointerCancel:p}}},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_useSwipe.js.map
