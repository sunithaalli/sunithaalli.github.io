/**
 * splitPane module - module jmSplitPane
 */
 "use strict";
 define(['jquery'],function($) {
 
     var calc = (function() {
         var prefixes = ["", "-webkit-", "-moz-", "-o-"], el;
         for (var i = 0; i < prefixes.length; i++){
             //MDS
             el = document.createElement('div');
             el.style.cssText = "width:" + prefixes[i] + "calc(9px)";
             if (el.style.length){
                 return prefixes[i] + "calc";
             }
         }
     })();
     var splitPane = {    
         split : function (ids, options) {
             var dimension, clientDimension, clientAxis, position, gutterClass, pairs = [];
             if (options === undefined){
                 options = {
                     gutterSize: 10,
                     minSize: 50,
                     snapOffset: 20,
                     direction: 'horizontal'
                 };
             }
             if (ids === undefined){
                 return;
             }
             if (options.direction === 'horizontal'){
                 dimension = 'width';
                 clientDimension = 'clientWidth';
                 clientAxis = 'clientX';
                 position = 'left';
                 gutterClass = 'gutter gutter-horizontal';
             }
             else if (options.direction === 'vertical'){
                 dimension = 'height';
                 clientDimension = 'clientHeight';
                 clientAxis = 'clientY';
                 position = 'top';
                 gutterClass = 'gutter gutter-vertical';
             }
             var startDragging = function(event){
                 event.preventDefault();
                 
                 this.dragging = true;
                 this.a.addEventListener('selectstart', preventSelection);
                 this.a.addEventListener('dragstart', preventSelection);
                 this.b.addEventListener('selectstart', preventSelection);
                 this.b.addEventListener('dragstart', preventSelection);
                 
                 this.a.style.userSelect = 'none';
                 this.a.style.webkitUserSelect = 'none';
                 this.a.style.MozUserSelect = 'none';
                 this.b.style.userSelect = 'none';
                 this.b.style.webkitUserSelect = 'none';
                 this.b.style.MozUserSelect = 'none';
                 
                 const grabOffsetVar = event[clientAxis] - this.gutter.getBoundingClientRect()[position];
                 this.grabOffset = grabOffsetVar;
                 //console.log("graboffset:"+this.grabOffset);
                 calculateSizes.call(this);
                 
                 // optional drag start method
                 if (options.onDragStart){
                     //console.log("dragstart splitpane");
                     options.onDragStart();
                 }
                 
             };
             var stopDragging = function(event){
                 if (!this.dragging) return;
                 this.dragging = false;
                 //console.log(event);
                 
                 this.a.removeEventListener('selectstart', preventSelection);
                 this.a.removeEventListener('dragstart', preventSelection);
                 this.b.removeEventListener('selectstart', preventSelection);
                 this.b.removeEventListener('dragstart', preventSelection);
                 
                 this.a.style.userSelect = '';
                 this.a.style.webkitUserSelect = '';
                 this.a.style.MozUserSelect = '';
                 this.b.style.userSelect = '';
                 this.b.style.webkitUserSelect = '';
                 this.b.style.MozUserSelect = '';
                 //canvas.drawAll();
                 // optional drag end method
                 if (options.onDragEnd){
                     if (options.onDragEnd instanceof Array){
                         for (var iDrag = 0; iDrag < options.onDragEnd.length; iDrag++){
                             options.onDragEnd[iDrag]();
                         }
                     }
                     else {
                         options.onDragEnd(); // drawAll should be invoked here
                     }
                 }
             };
             var drag = function(event){
                 if (!this.dragging) return;
                 var offset = event[clientAxis] - this.start;
                 offset = offset - this.grabOffset;
                 
                 if (offset <= this.aMin + options.snapOffset){
                     offset = this.aMin;
                 }
                 else if (offset >= this.size - this.bMin - options.snapOffset){
                     offset = this.size - this.bMin;
                 }
                 adjust.call(this, offset);

                 // onDrag method
                 if (options.onDrag){
                     if (options.onDrag instanceof Array){
                         for (var iDrag = 0; iDrag < options.onDrag.length; iDrag++){
                             options.onDrag[iDrag]();
                         }
                     }
                     else {
                         //console.log("dragging splitpane");
                         options.onDrag();
                     }
                 }
             };
             
             
         var calculateSizes = function(){
             let padding = 0; // set as padding on parent div
             this.size = this.a.getBoundingClientRect()[dimension] + this.b.getBoundingClientRect()[dimension] + this.aGutterSize + this.bGutterSize;
             this.parentSize = this.parent[clientDimension]-padding;
             this.percentage = Math.min(this.size  / (this.parent[clientDimension]-padding) * 100, 100);
             this.start = this.a.getBoundingClientRect()[position];
             
         };
         var adjust = function(offset){
             // A size is same as offset, B size is total size - A size
             // Both sizes are calculated from the initial parent percentage
             this.a.style[dimension] = calc + '(' + (offset / this.size * this.percentage) + '% - ' + this.aGutterSize + 'px)';
             this.b.style[dimension] = calc + '(' + (this.percentage - (offset / this.size * this.percentage)) + '% - ' + this.bGutterSize + 'px)';
         };
         var fitMin = function(){
             if (this.a.getBoundingClientRect()[dimension] < this.aMin){
                 this.a.style[dimension] = (this.aMin - this.aGutterSize) + 'px';
                 this.b.style[dimension] = (this.size - this.aMin - this.aGutterSize) + 'px';
                 
             }
             else if (this.b.getBoundingClientRect()[dimension] < this.bMin){
                this.a.style[dimension] = (this.size - this.bMin - this.bGutterSize) + 'px';
                 this.b.style[dimension] = (this.bMin - this.bGutterSize) + 'px';
             }
         };
         var fitMinReverse = function(){
             if (this.b.getBoundingClientRect()[dimension] < this.bMin){
                this.a.style[dimension] = (this.size - this.bMin - this.bGutterSize) + 'px';
                 this.b.style[dimension] = (this.bMin - this.bGutterSize) + 'px';
             }
             else if (this.a.getBoundingClientRect()[dimension] < this.aMin){
                 this.a.style[dimension] = (this.aMin - this.aGutterSize) + 'px';
                 this.b.style[dimension] = (this.size - this.aMin - this.aGutterSize) + 'px';
             }
         };
         var balancePairs = function(pairs){
             for (var i = 0; i < pairs.length; i++){
                 calculateSizes.call(pairs[i]);
                 fitMin.call(pairs[i]);
             }
             for (var i = pairs.length - 1; i >= 0; i--){
                 calculateSizes.call(pairs[i]);
                 fitMinReverse.call(pairs[i]);
             }
         };
         var preventSelection = function(){ return false; };
         var parent = document.getElementById(ids[0]).parentNode;
         
         if (!options.sizes){
             var percent = 100 / ids.length;
             
             options.sizes = [];
             
             for (var i = 0; i < ids.length; i++){
                 options.sizes.push(percent);
             }
         }
         if (!Array.isArray(options.minSize)){
             var minSizes = [];
             for (var i = 0; i < ids.length; i++){
                 minSizes.push(options.minSize);
             }
             options.minSize = minSizes;
         }
         
         for (var i = 0; i < ids.length; i++){
             var el = document.getElementById(ids[i]);
             var isFirst = (i === 1); // first pair
             var isLast = (i === ids.length - 1);
             var size;
             var gutterSize = options.gutterSize;
             var pair;
             if (i > 0){
                 pair = {
                     a: document.getElementById(ids[i - 1]),
                     b: el,
                     aMin: options.minSize[i - 1],
                     bMin: options.minSize[i],
                     dragging: false,
                     parent: parent,
                     isFirst: isFirst,
                     isLast: isLast,
                     direction: options.direction
                 };
                 
                 pair.aGutterSize = options.gutterSize;
                 pair.bGutterSize = options.gutterSize;
                 if (isFirst){
                     pair.aGutterSize = options.gutterSize / 2;
                 }
                 if (isLast){
                     pair.bGutterSize = options.gutterSize / 2;
                 }
                 var gutter = document.createElement('div');
                 gutter.className = gutterClass;
                 if (options.id) gutter.id = options.id;
                 if (options.role) $(gutter).attr("role",options.role);
                 gutter.style[dimension] = options.gutterSize + 'px';
                 gutter.addEventListener('mousedown', startDragging.bind(pair));
                 
                 parent.addEventListener('mouseup', stopDragging.bind(pair));
                 parent.addEventListener('mousemove', drag.bind(pair));
                 parent.addEventListener('mouseleave', stopDragging.bind(pair));
                 
                 parent.insertBefore(gutter, el);
                 
                 pair.gutter = gutter;
                 
              }
              if (i === 0 || i === ids.length - 1){
                  gutterSize = options.gutterSize / 2;
              }
              if (typeof options.sizes[i] === 'string' || options.sizes[i] instanceof String){
                  size = options.sizes[i];
              }
              else {
                  size = calc + '(' + options.sizes[i] + '% - '+gutterSize + 'px)';
              }
              
              $(el).css(dimension, size);
              
              if (i > 0){
                  pairs.push(pair);
              }
         }
         balancePairs(pairs);
         }
     };
     return splitPane;
 });
 
 //# sourceURL=splitPane.js
 