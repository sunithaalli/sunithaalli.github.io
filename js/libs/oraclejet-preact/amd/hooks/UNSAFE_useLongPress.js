define(["exports","preact/hooks"],(function(e,n){"use strict";const t={pointerDownId:null,startTime:0};e.useLongPress=function(e,{isDisabled:o=!1,minimumTime:r=250}={isDisabled:!1,minimumTime:250}){const i=n.useRef(t),s=n.useCallback((e=>{"mouse"==e.pointerType&&0!=e.button||(i.current=i.current.pointerDownId?t:{pointerDownId:e.pointerId,startTime:e.timeStamp})}),[]),u=n.useCallback((n=>{if(n.pointerId===i.current.pointerDownId){n.timeStamp-i.current.startTime>r&&e({x:n.offsetX,y:n.offsetY})}a()}),[e]),a=n.useCallback((()=>{i.current=t}),[]);return{longPressProps:o?{}:{onPointerDown:s,onPointerUp:u,onPointerLeave:a,onPointerCancel:a}}},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_useLongPress.js.map