function _toConsumableArray(r){return _arrayWithoutHoles(r)||_iterableToArray(r)||_unsupportedIterableToArray(r)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(r,e){if(r){if("string"==typeof r)return _arrayLikeToArray(r,e);var t=Object.prototype.toString.call(r).slice(8,-1);return"Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(r,e):void 0}}function _iterableToArray(r){if("undefined"!=typeof Symbol&&null!=r[Symbol.iterator]||null!=r["@@iterator"])return Array.from(r)}function _arrayWithoutHoles(r){if(Array.isArray(r))return _arrayLikeToArray(r)}function _arrayLikeToArray(r,e){(null==e||e>r.length)&&(e=r.length);for(var t=0,n=new Array(e);t<e;t++)n[t]=r[t];return n}define(["exports","./tslib.es6-44d49373","preact/jsx-runtime","./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_mergeInterpolations",'module',"./utils/UNSAFE_interpolations/boxalignment","./utils/UNSAFE_interpolations/flexbox","./utils/UNSAFE_interpolations/flexitem","./flexbox-937ddde3","./flexitem-6444aa08"],(function(r,e,t,n,o,a,i,l,s,u,c){"use strict";const y=[].concat(_toConsumableArray(Object.values(n.dimensionInterpolations)),_toConsumableArray(Object.values(u.flexboxInterpolations)),_toConsumableArray(Object.values(c.flexitemInterpolations)),_toConsumableArray(Object.values(i.boxAlignmentInterpolations))),b=o.mergeInterpolations(y);r.Flex=r=>{var{children:n}=r,o=e.__rest(r,["children"]);const a=b(o),{class:i}=a,l=e.__rest(a,["class"]);return t.jsx("div",Object.assign({class:`b12c3cqv ${i}`,style:l},{children:n}))}}));
//# sourceMappingURL=Flex-40c710fc.js.map
