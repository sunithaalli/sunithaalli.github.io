function _toConsumableArray(r){return _arrayWithoutHoles(r)||_iterableToArray(r)||_unsupportedIterableToArray(r)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(r,t){if(r){if("string"==typeof r)return _arrayLikeToArray(r,t);var e=Object.prototype.toString.call(r).slice(8,-1);return"Object"===e&&r.constructor&&(e=r.constructor.name),"Map"===e||"Set"===e?Array.from(r):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray(r,t):void 0}}function _iterableToArray(r){if("undefined"!=typeof Symbol&&null!=r[Symbol.iterator]||null!=r["@@iterator"])return Array.from(r)}function _arrayWithoutHoles(r){if(Array.isArray(r))return _arrayLikeToArray(r)}function _arrayLikeToArray(r,t){(null==t||t>r.length)&&(t=r.length);for(var e=0,n=new Array(t);e<t;e++)n[e]=r[e];return n}define(["exports","./tslib.es6-44d49373","preact/jsx-runtime","./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_mergeInterpolations","./utils/UNSAFE_interpolations/flexitem","./flexitem-6444aa08"],(function(r,t,e,n,a,o,i){"use strict";const s=[].concat(_toConsumableArray(Object.values(n.dimensionInterpolations)),[i.flexitemInterpolations.flex]),l=a.mergeInterpolations(s);r.Spacer=r=>{var n=t.__rest(r,[]);const a=l(n),{class:o}=a,i=t.__rest(a,["class"]);return e.jsx("div",{class:`${o}`,style:i})}}));
//# sourceMappingURL=Spacer-629b8e88.js.map