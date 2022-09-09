function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var s=Object.prototype.toString.call(e).slice(8,-1);return"Object"===s&&e.constructor&&(s=e.constructor.name),"Map"===s||"Set"===s?Array.from(e):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?_arrayLikeToArray(e,t):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var s=0,n=new Array(t);s<t;s++)n[s]=e[s];return n}define(["exports","preact/jsx-runtime","./tslib.es6-44d49373",'module',"./hooks/UNSAFE_usePress","./hooks/UNSAFE_useHover","./utils/UNSAFE_classNames","preact/compat","./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_mergeInterpolations","./utils/PRIVATE_clientHints","./clientHints-4b478df0","./classNames-b3be51c1"],(function(e,t,s,n,a,r,o,i,l,c,u,d,b){"use strict";const y=()=>null,p="b1m12t60",f="h1h5apjf",m="p11lfugp",_="usfllum",g="mabs2bd",A="d1fq6ucp",h="bpzvdp8",I=_toConsumableArray(Object.values(l.dimensionInterpolations)),j=c.mergeInterpolations(I),v="ios"===d.getClientHints().platform?{ontouchstart:function(){}}:{},S=d.getClientHints().isHybrid,O=i.forwardRef(((e,n)=>{var{variant:o="outlined",isDisabled:i=!1,size:l="md",elementDetails:c={type:"button"},styling:u="default",edge:d="none",accessibleLabel:I}=e,O=s.__rest(e,["variant","isDisabled","size","elementDetails","styling","edge","accessibleLabel"]);const{pressProps:x}=a.usePress(O.onAction?O.onAction:y,{isDisabled:i}),{hoverProps:H,isHover:N}=r.useHover({isDisabled:S}),T=j(O),{class:k}=T,w=s.__rest(T,["class"]),z=b.classNames(["default"===u&&p,"unstyled"===u&&_,"min"===u&&p||g,`oj-c-button-${o}`,`oj-c-button-${l}`,i&&A,"bottom"===d&&h,!S&&m,S&&N&&f]),$=Object.assign({},c),{type:D="button"}=$,L=s.__rest($,["type"]),E="button"===D?{type:"button"}:{role:"link"},U=O.title||I,C=c.type;return t.jsx(C,Object.assign({ref:n,disabled:i,class:`${z} ${k}`,style:w,autofocus:O.autofocus,title:U,tabIndex:i?-1:0,"aria-label":I},L,E,x,v,H,{children:O.children}))})),x="tqmqswo",H="i1n928z1",N="s18f9tk6",T="e7wof2a",k="s1p2y79g",w="s1y1p2f8",z="e1rcbirt",$="l1egk2oi",D=e=>null==e;function L(e){var{size:n="md",display:a="all"}=e,r=s.__rest(e,["size","display"]);const o="all"==a||"icons"==a,i="all"==a||"label"==a,l=$,c=r.startIcon&&("icons"===a||!r.children)&&!r.endIcon,u=!D(r.startIcon)&&"all"===a,d=!D(r.endIcon)&&"all"===a,y=r.startIcon&&r.endIcon,p=`${H} oj-c-button-layout-${n} ${z}`,f=b.classNames([H,`oj-c-button-layout-${n}`,c?w:k]),m=b.classNames([x,u&&!y&&T,d&&!y&&N]);return t.jsxs("span",Object.assign({class:l},{children:[o&&r.startIcon&&t.jsx("span",Object.assign({class:f},{children:r.startIcon})),i&&r.children&&t.jsxs("span",Object.assign({class:m},{children:[" ",r.children," "]})),o&&r.endIcon&&t.jsx("span",Object.assign({class:p},{children:r.endIcon}))]}))}const E=i.forwardRef((({variant:e="outlined",isDisabled:s=!1,size:n="md",display:a="all",endIcon:r,startIcon:o,autofocus:i,edge:l,onAction:c,label:u="",accessibleLabel:d,title:b,width:y},p)=>{const f=!o&&!r||"label"===a,m=f?u:t.jsx(L,Object.assign({display:a,startIcon:o,endIcon:r,size:n},{children:u}));return t.jsx(O,Object.assign({ref:p,isDisabled:s,size:n,width:y,autofocus:i,edge:l,variant:e,styling:f?"min":"default",onAction:c,accessibleLabel:null!=d?d:"icons"===a?u:void 0,title:null!=b?b:"icons"===a?null!=d?d:u:void 0,"aria-label":"icons"===a?u:null},{children:m}))}));e.Button=E}));
//# sourceMappingURL=Button-519246a3.js.map