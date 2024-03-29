/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojvcomponent', 'preact', 'ojs/ojdomutils', 'ojs/ojdatacollection-common'], function (exports, jsxRuntime, ojvcomponent, preact, DomUtils, DataCollectionUtils) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    exports.ActionCard = class ActionCard extends preact.Component {
        constructor(props) {
            super(props);
            this._rootRef = preact.createRef();
            this._handleOjAction = (event) => {
                if (this._isFromActiveSource(event)) {
                    event.stopPropagation();
                }
            };
            this._handleStart = (event) => {
                if (!this._isFromActiveSource(event)) {
                    this.setState({ active: true });
                }
            };
            this._handleUpEnd = (event) => {
                var _a, _b;
                if (!this._isFromActiveSource(event) && this.state.active) {
                    this.setState({ active: false });
                    (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, { originalEvent: event });
                }
            };
            this._handleTouchcancel = (event) => {
                if (!this._isFromActiveSource(event)) {
                    this.setState({ active: false });
                }
            };
            this._handleMove = (event) => {
                if (this.state.active && !this._isFromActiveSource(event)) {
                    this.setState({ active: false });
                }
            };
            this._handleKeydown = (event) => {
                if (!this._isFromActiveSource(event) &&
                    !event.repeat &&
                    (event.key === 'Enter' || event.key === ' ')) {
                    this.setState({ active: true });
                }
            };
            this._handleKeyup = (event) => {
                var _a, _b;
                if (!this._isFromActiveSource(event) && (event.key === 'Enter' || event.key === ' ')) {
                    this.setState({ active: false });
                    (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, { originalEvent: event });
                }
            };
            this._handleFocusin = (event) => {
                this.setState({ focus: true });
            };
            this._handleFocusout = (event) => {
                this.setState({ focus: false });
            };
            this.state = {
                active: false,
                focus: false
            };
        }
        render(props, state) {
            var _a;
            let classString = 'oj-actioncard';
            if (state.active) {
                classString += ' oj-active';
            }
            if (state.focus && !DomUtils.recentPointer()) {
                classString += ' oj-focus-highlight';
            }
            const tabIndex = (_a = props.tabIndex) !== null && _a !== void 0 ? _a : 0;
            return (jsxRuntime.jsx(ojvcomponent.Root, Object.assign({ tabIndex: tabIndex, class: classString, role: "button", onKeyUp: this._handleKeyup, onMouseUp: this._handleUpEnd, onKeyDown: this._handleKeydown, onMouseDown: this._handleStart, onTouchStart: this._handleStart, onTouchEnd: this._handleUpEnd, onTouchCancel: this._handleTouchcancel, onTouchMove: this._handleMove, onfocusin: this._handleFocusin, onfocusout: this._handleFocusout }, {
                onojAction: this._handleOjAction
            }, { ref: this._rootRef }, { children: this.props.children })));
        }
        componentDidMount() {
            this._rootRef.current.addEventListener('touchstart', this._handleStart, { passive: true });
            this._rootRef.current.addEventListener('touchend', this._handleUpEnd, { passive: false });
            this._rootRef.current.addEventListener('touchcancel', this._handleTouchcancel, {
                passive: true
            });
            this._rootRef.current.addEventListener('touchmove', this._handleMove, { passive: true });
        }
        _isFromActiveSource(event) {
            return DataCollectionUtils.isEventClickthroughDisabled(event, this._rootRef.current);
        }
    };
    exports.ActionCard.metadata = { "slots": { "": {} }, "events": { "ojAction": { "bubbles": true } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["tabIndex", "role"] } };
    exports.ActionCard = __decorate([
        ojvcomponent.customElement('oj-action-card')
    ], exports.ActionCard);

    Object.defineProperty(exports, '__esModule', { value: true });

});
