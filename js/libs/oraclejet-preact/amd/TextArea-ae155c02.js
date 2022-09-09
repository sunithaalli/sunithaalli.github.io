define(["exports","preact/jsx-runtime","preact","preact/compat","./hooks/UNSAFE_useFormContext","./hooks/UNSAFE_useFormFieldContext","./hooks/UNSAFE_useFocusableTextField","./UNSAFE_Label","./UNSAFE_TextField","./hooks/UNSAFE_useTextField","./UNSAFE_UserAssistance","./hooks/UNSAFE_useLengthFilter","./TextFieldInput-9061f5dc"],(function(e,s,t,i,n,l,a,o,r,d,u,c,x){"use strict";const F=i.forwardRef((({assistiveText:e,autoComplete:i="off",autoFocus:F=!1,helpSourceLink:h,helpSourceText:b,id:g,isDisabled:m,isReadonly:p,isRequired:v=!1,isRequiredShown:A,label:L,labelEdge:j,labelStartWidth:f,maxLength:S,maxLengthUnit:E,messages:R,placeholder:T,resize:U,role:y,rows:C,textAlign:I,userAssistanceDensity:O,value:D,onInput:N,onCommit:_},k)=>{const{isDisabled:P,isReadonly:w,labelEdge:q,labelStartWidth:M,textAlign:W,userAssistanceDensity:z}=n.useFormContext(),B=null!=m?m:P,G=null!=p?p:w,H=null!=j?j:q,J=null!=f?f:M,K=null!=I?I:W,Q=null!=O?O:z,{enabledElementRef:V,readonlyElementRef:X,focusProps:Y,isFocused:Z}=a.useFocusableTextField({isDisabled:B,isReadonly:G,ref:k}),{formFieldContext:$,inputProps:ee,labelProps:se,textFieldProps:te,userAssistanceProps:ie}=d.useTextField({id:g,isDisabled:B,isFocused:Z,isReadonly:G,labelEdge:H,messages:R,value:D,variant:"textarea"}),{isMaxLengthExceeded:ne,valueLength:le,onFilteredInput:ae}=c.useLengthFilter({maxLength:S,maxLengthUnit:E,value:D,onInput:N,onCommit:_}),oe="none"!==H?s.jsx(o.Label,Object.assign({},se,{children:L})):void 0,re={label:"none"!==H?oe:void 0,labelEdge:"none"!==H?H:void 0,labelStartWidth:"none"!==H?J:void 0},de="none"===H?L:void 0,ue=B||G?"efficient"!==Q?void 0:s.jsx(u.InlineUserAssistance,Object.assign({userAssistanceDensity:Q},ie)):s.jsx(u.InlineUserAssistance,Object.assign({assistiveText:e,helpSourceLink:h,helpSourceText:b,messages:R,isRequiredShown:A,userAssistanceDensity:Q},ie));if(G)return s.jsx(l.FormFieldContext.Provider,Object.assign({value:$},{children:s.jsx(r.ReadonlyTextField,Object.assign({role:"presentation",inlineUserAssistance:ue,variant:"textarea"},re,{children:s.jsx(r.ReadonlyTextFieldInput,{ariaLabel:de,ariaLabelledby:se.id,as:"textarea",elementRef:X,rows:C,autoFocus:F,id:g,textAlign:K,value:D,hasInsideLabel:void 0!==L&&"inside"===H})}))}));const ce=s.jsxs(t.Fragment,{children:[s.jsx(x.TextFieldInput,Object.assign({as:"textarea",ariaLabel:de,autoComplete:i,autoFocus:F,hasInsideLabel:void 0!==oe&&"inside"===H,isRequired:v,inputRef:V,onInput:ae,onCommit:_,placeholder:T,role:y,rows:C,textAlign:K,value:D},ee)),void 0!==S&&s.jsx(r.MaxLengthLiveRegion,Object.assign({},{isMaxLengthExceeded:ne,maxLength:S,valueLength:le}))]});return s.jsx(l.FormFieldContext.Provider,Object.assign({value:$},{children:s.jsx(r.TextField,Object.assign({mainContent:ce,inlineUserAssistance:ue,onBlur:null==Y?void 0:Y.onfocusout,onFocus:null==Y?void 0:Y.onfocusin,resize:U},te,re))}))}));e.TextArea=F}));
//# sourceMappingURL=TextArea-ae155c02.js.map
