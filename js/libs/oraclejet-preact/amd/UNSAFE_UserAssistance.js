define(["exports","preact/jsx-runtime",'css!./UNSAFE_UserAssistance.css',"./hooks/UNSAFE_useTranslationBundle","./utils/UNSAFE_classNames","./classNames-b3be51c1","./UNSAFE_ComponentMessage","./hooks/UNSAFE_useFormContext","./hooks/UNSAFE_useFormFieldContext","./ComponentMessageContainer-bcc3cabe","preact/hooks","./UNSAFE_Environment","preact","./UNSAFE_Layer","preact/compat","./ComponentMessage-2703f6e9","./UNSAFE_Message","./UNSAFE_Flex","./Flex-40c710fc","./tslib.es6-44d49373","./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_arrayUtils","./utils/UNSAFE_size","./utils/UNSAFE_stringUtils","./stringUtils-5947815e","./_curry1-f1c75636","./utils/UNSAFE_mergeInterpolations","./_curry2-63a708f9","./_has-491b2156","./utils/UNSAFE_interpolations/boxalignment","./keys-1886315d","./utils/UNSAFE_interpolations/flexbox","./flexbox-937ddde3","./utils/UNSAFE_interpolations/flexitem","./flexitem-6444aa08","./MessageCloseButton-a2b0bfff","./MessageDetail-de0beb00","./MessageFormattingUtils-1e3d660c","./utils/UNSAFE_getLocale","./Message.types-3f64e234","./MessageStartIcon-99c20c31","./index-e072ff93","./UNSAFE_Icon","./Icon-93ea9369","./hooks/UNSAFE_useUser","./hooks/UNSAFE_useTheme","./index-6d0068fd","./MessageSummary-b689f53c","./MessageTimestamp-16af3be7","./MessageUtils-6ad27689","./utils/UNSAFE_logger","./utils/UNSAFE_soundUtils","./MessagesManager-71797cf8","./UNSAFE_TransitionGroup"],(function(e,s,n,t,i,a,r,o,l,c,u,d,f,g,x,F,U,_,m,S,A,N,p,b,h,E,j,M,y,C,T,k,v,I,w,O,q,L,B,H,R,D,z,G,P,J,K,Q,V,W,X,Y,Z,$){"use strict";function ee({children:e,source:n}){const i=t.useTranslationBundle("@oracle/oraclejet-preact").userAssistance_learnMore();return e=null!=e?e:i,s.jsx("a",Object.assign({class:"r1yxs6yj",target:"_blank",href:n},{children:e}))}function se({assistiveText:e,sourceLink:n,sourceText:t}){return s.jsxs("div",{children:[e&&n?s.jsx("span",Object.assign({class:"h178vflh"},{children:e})):e,n&&s.jsx(ee,Object.assign({source:n},{children:t}))]})}const ne={start:"s1qfwwsi",end:"e1y8b86q"};function te({align:e="end",hasHelp:n=!1,hasMessages:i=!1}){const r=a.classNames([ne[e],(n||i)&&"dq4dyme"]),o=t.useTranslationBundle("@oracle/oraclejet-preact").userAssistance_required();return s.jsx("div",Object.assign({class:r},{children:o}))}const ie={reflow:"r15mbt1n",efficient:"e53t0ow"};function ae({variant:e="reflow",children:n,id:t}){const i=a.classNames(["b1edsw0w",ie[e]]);return s.jsx("div",Object.assign({class:i,id:t},{children:n}))}e.InlineHelp=se,e.InlineHelpSource=ee,e.InlineRequired=te,e.InlineUserAssistance=function({assistiveText:e,helpSourceLink:n,helpSourceText:t,id:i,isRequiredShown:a,messages:r=[],userAssistanceDensity:u}){const{isReadonly:d}=o.useFormContext(),f="efficient"===u&&!1===d,{isFocused:g}=l.useFormFieldContext(),x=r.length>0?s.jsx(c.ComponentMessageContainer,{messages:r}):(e||n)&&g?s.jsx(se,{assistiveText:e,sourceLink:n,sourceText:t}):a?s.jsx(te,{}):null;return x||f?s.jsx(ae,Object.assign({id:i,variant:u},{children:x})):null},e.InlineUserAssistanceContainer=ae,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_UserAssistance.js.map
