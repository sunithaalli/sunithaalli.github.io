define(["exports","preact/jsx-runtime",'css!./UNSAFE_Selector.css',"./utils/UNSAFE_classNames","./utils/UNSAFE_keys","./hooks/PRIVATE_useSelection","./index-e072ff93","./UNSAFE_Flex","./hooks/UNSAFE_useTranslationBundle","./classNames-b3be51c1","./index-6d0068fd","./Flex-40c710fc","preact/hooks","./utils/UNSAFE_arrayUtils","./UNSAFE_Icon","./Icon-93ea9369","./tslib.es6-44d49373","./hooks/UNSAFE_useUser","./UNSAFE_Environment","preact","./UNSAFE_Layer","preact/compat","./hooks/UNSAFE_useTheme","./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_size","./utils/UNSAFE_stringUtils","./stringUtils-5947815e","./_curry1-f1c75636","./utils/UNSAFE_mergeInterpolations","./_curry2-63a708f9","./_has-491b2156","./utils/UNSAFE_interpolations/boxalignment","./keys-1886315d","./utils/UNSAFE_interpolations/flexbox","./flexbox-937ddde3","./utils/UNSAFE_interpolations/flexitem","./flexitem-6444aa08"],(function(e,s,t,c,i,n,l,o,a,r,u,d,b,x,_,h,S,k,U,F,N,f,p,E,A,j,g,m,y,v,C,O,I,z,L,P,T){"use strict";const w="bj1nmyi",K="cn5sfz9",B="b1avpzwb",q="u1rjaeqm",M="s1boze17";function R(e){const t=r.classNames([B,e.checked?M:q]),c=a.useTranslationBundle("@oracle/oraclejet-preact"),i=e.checked?c.selector_selected():c.selector_unselected();return s.jsx("div",Object.assign({class:t,tabIndex:-1,type:"checkbox",checked:e.checked,"aria-label":e.accessibleLabel||i,onClick:e.onClick},{children:e.checked?s.jsx(u.SvgCheckboxOn,{}):s.jsx(u.SvgCheckboxOff,{})}))}const V=e=>{e.stopPropagation()};e.Selector=function({accessibleLabel:e,rowKey:t,selectedKeys:c,onChange:l}){const{selectionProps:o}=n.useSelection((()=>t),c,"multiple",!1,"toggle",l);return s.jsx("div",Object.assign({class:K},(e=>{const s=e.onClick;return s?(e.onClick=e=>{s(e),V(e)},e):{onClick:V}})(o),{children:s.jsx("div",Object.assign({class:w},{children:s.jsx(d.Flex,Object.assign({align:"center",justify:"center",width:"11x",height:"11x"},{children:s.jsx(R,{checked:i.containsKey(c,t),accessibleLabel:e})}))}))}))},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_Selector.js.map
