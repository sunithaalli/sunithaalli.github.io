define(["exports","preact/hooks","preact/jsx-runtime",'css!./UNSAFE_useTooltip.css',"./UNSAFE_useId","../UNSAFE_Floating","../UNSAFE_Layer","./UNSAFE_useHover","./UNSAFE_useFocus","./UNSAFE_useTouch","../utils/UNSAFE_mergeProps","../utils/UNSAFE_arrayUtils","../utils/UNSAFE_classNames","../classNames-b3be51c1","preact/compat","../index-c268b73f","./UNSAFE_useOutsideClick","preact","./UNSAFE_useToggle"],(function(e,t,o,n,s,i,u,r,l,a,c,m,p,d,f,v,h,b,g){"use strict";m.stringLiteralArray(["start","top-start","top","top-end","end","bottom-end","bottom","bottom-start"]),m.stringLiteralArray(["element","pointer"]);const x={wrapper:"w1vvnp2m",base:"b1gymgil",datatip:"d1hwecin"},T=({text:e,isOpen:n=!1,variant:m="tooltip",position:p="bottom",isDisabled:f=!1,anchor:v={x:"element",y:"element"},offset:h={mainAxis:0,crossAxis:0},onToggle:b})=>{const[g,T]=t.useState(n?"mounted":"hidden"),A="datatip"===m,{hoverProps:y,isHover:E}=r.useHover({isDisabled:f}),{focusProps:F,isFocus:_}=l.useFocus({isDisabled:f}),{touchProps:P,isTouch:N}=a.useTouch({isDisabled:f}),{hoverProps:j,isHover:H}=r.useHover({isDisabled:f}),{touchProps:S,isTouch:O}=a.useTouch({isDisabled:f}),U=s.useId(),V=t.useRef(!0),w=t.useRef(null),D=t.useRef(null),R=t.useRef({x:0,y:0}),k="element"===v.x&&"element"===v.y?D:R,C=A?0:250,z=e=>{T(e?"mountTimeout":"unmountTimeout")};let I;if(t.useEffect((()=>{V.current?V.current=!1:_||N||z(E)}),[E]),t.useEffect((()=>{V.current?V.current=!1:E||N||z(_)}),[_]),t.useEffect((()=>{V.current?V.current=!1:E||_||z(N)}),[N]),t.useEffect((()=>{V.current?V.current=!1:["mounted","unmountTimeout"].includes(g)&&T(H||O?"mounted":"unmountTimeout")}),[H,O]),t.useEffect((()=>{let e;switch(g){case"mountTimeout":e=setTimeout((()=>T("mountInitialize")),C);break;case"mountInitialize":T("mounting"),null==b||b({value:!0});break;case"mounting":T("mounted");break;case"unmountTimeout":e=setTimeout((()=>T("unmounting")),C);break;case"unmounting":T("unmounted"),null==b||b({value:!1})}return()=>clearTimeout(e)}),[g]),f)I={};else{const e=Object.assign(Object.assign({"aria-describedby":U,onMouseEnter:e=>{e.eventPhase===Event.AT_TARGET&&(D.current=e.target)}},("pointer"===v.x||"pointer"===v.y)&&{onMouseMove:e=>{e.eventPhase===Event.AT_TARGET&&q(e)}}),{onFocus:e=>{e.eventPhase===Event.AT_TARGET&&(D.current=e.target)}});I=c.mergeProps(y,F,P,e)}if(f||!e)return{tooltipContent:null,tooltipProps:I};const L=({floating:e})=>({mainAxis:null==h?void 0:h.mainAxis,crossAxis:-e.width-(h.crossAxis||0)}),M=({floating:e})=>({mainAxis:null==h?void 0:h.mainAxis,crossAxis:e.width+(h.crossAxis||0)}),G={top:{placement:"top",offsetValue:h},"top-end":{placement:"top-end",offsetValue:M},end:{placement:"right",offsetValue:h},"bottom-end":{placement:"bottom-end",offsetValue:M},bottom:{placement:"bottom",offsetValue:h},"bottom-start":{placement:"bottom-start",offsetValue:L},start:{placement:"left",offsetValue:h},"top-start":{placement:"top-start",offsetValue:L}}[p],X="hidden"===g||"mountTimeout"===g,Y=w.current,$={popoverOpacity:["mounted","unmountTimeout"].includes(g)?A?"100%":"95%":"0%",wrapperHeight:!X&&Y?`${null==Y?void 0:Y.offsetHeight}px`:"auto",popoverHeight:"mountInitialize"===g?"none":["mounted","unmountTimeout"].includes(g)&&Y?`${null==Y?void 0:Y.offsetHeight}px`:"0"};let W;const q=e=>{clearTimeout(W),"pointer"===v.x&&"pointer"===v.y?(R.current={x:e.clientX,y:e.clientY},T("mounted"===g?"mounting":"mounted")):"pointer"===v.x?W=setTimeout((()=>{var t,o;const n=(null===(t=null==D?void 0:D.current)||void 0===t?void 0:t.offsetHeight)||0,s=((null===(o=null==D?void 0:D.current)||void 0===o?void 0:o.offsetTop)||0)+n;R.current={x:e.clientX,y:s},null==b||b({value:!0})}),C):"pointer"===v.y&&(W=setTimeout((()=>{var t,o;const n=(null===(t=null==D?void 0:D.current)||void 0===t?void 0:t.offsetWidth)||0,s=((null===(o=null==D?void 0:D.current)||void 0===o?void 0:o.offsetLeft)||0)+n;R.current={x:s,y:e.clientY},null==b||b({value:!0})}),C))},B=o.jsx(u.Layer,{children:o.jsx(i.Floating,Object.assign({anchorRef:k,placement:G.placement,offsetValue:G.offsetValue},{children:o.jsx("div",Object.assign({id:U,role:"tooltip"},j,S,{class:x.wrapper,style:{height:$.wrapperHeight}},{children:o.jsx("div",Object.assign({style:{opacity:$.popoverOpacity,maxHeight:$.popoverHeight,transition:"max-height 0.1s cubic-bezier(0.0, 0.0, 0.2, 1), opacity 0.1s cubic-bezier(0.0, 0.0, 0.2, 1)"},onTransitionEnd:e=>{"mounting"===g&&T("mounted"),"unmounted"===g&&T("hidden")}},{children:o.jsx("div",Object.assign({ref:w,class:d.classNames([x.base,A?x[m]:""])},{children:e}))}))}))}))});return{tooltipContent:!X&&B,tooltipProps:I}};e.useTooltip=({text:e,position:o="bottom",isDisabled:n=!1,anchor:s={x:"element",y:"element"},offset:i={mainAxis:0,crossAxis:0}})=>{const[u,r]=t.useState(!1),l=n||!e,{tooltipContent:a,tooltipProps:c}=T({text:e,isOpen:u,position:o,isDisabled:l,offset:i,anchor:s,onToggle:({value:e})=>r(e)});return{tooltipContent:a,tooltipProps:c}},e.useTooltipControlled=T,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_useTooltip.js.map
