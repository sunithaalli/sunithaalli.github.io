define(["exports","./tslib.es6-44d49373","preact/jsx-runtime","./hooks/UNSAFE_useFormFieldContext","./utils/UNSAFE_classNames",'css!./UNSAFE_Label.css',"./hooks/UNSAFE_useFormContext","./classNames-b3be51c1","preact","preact/hooks"],(function(e,s,i,a,n,d,o,r,l,t){"use strict";const c={base:"bqpszk1",startBase:"s8tyzhy",topBase:"t1nf0aj6",insideBase:"ibq10wn",insideReadonlyInEnabledForm:"itgrc9d",insideReadonlyNotInEnabledForm:"iurpzj3",insideNonReadonly:"im4lvc5",insideNonReadonlyHasValue:"i3diidy",insideDisabled:"i1jkkk8p",insideFocused:"i1fr54gj",insideError:"ilnjrnk",insideWarning:"i1p5m3qn",noWrap:"n8alcy4"},u=e=>{var{hasValue:a,readonly:n,disabled:d,isFocused:l,variant:t="inside"}=e,u=s.__rest(e,["hasValue","readonly","disabled","isFocused","variant"]);const{isFormLayout:b,isReadonly:F,labelWrapping:y}=o.useFormContext(),m="inside"===t||"insideError"===t||"insideWarning"===t?r.classNames([c.base,c.insideBase,n&&(b&&!F?c.insideReadonlyInEnabledForm:c.insideReadonlyNotInEnabledForm),!n&&c.insideNonReadonly,!n&&(a||l)&&c.insideNonReadonlyHasValue,!n&&l&&c.insideFocused,d&&c.insideDisabled,!d&&!n&&("insideError"===t||"insideWarning"===t)&&c[t]]):"start"===t?r.classNames([c.base,c.startBase,"truncate"===y&&c.noWrap]):"top"===t?r.classNames([c.base,c.topBase,"truncate"===y&&c.noWrap]):void 0;return i.jsx("label",Object.assign({},u,{class:m}))};e.Label=e=>{var{forId:n}=e,d=s.__rest(e,["forId"]);const{hasValue:o,isDisabled:r,isFocused:l,isReadonly:t}=a.useFormFieldContext();return i.jsx(u,Object.assign({for:n,hasValue:o,disabled:r,isFocused:l,readonly:t},d))},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_Label.js.map
