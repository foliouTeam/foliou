/**
    @author:liupeng
    @email:1049047649@qq.com
    @blog:http://blog.focusbe.com
    @github:https://github.com/focusbe
**/
(function() {
	var definFun = function(DEVICE) {
		var TouchMove = function(element, callbacks) {
			var startPosition, delta, endPosition;
			var _self = this;
			var _startEvent, _moveEvent, _endEvent;
			var _temptouch;
			var _isTouched = false;
			this._init = function() {
				if (!element) {
					console.warn()("缺少参数");
					return;
				}
				if (DEVICE.isMobile) {
					_startEvent = "touchstart";
					_moveEvent = "touchmove";
					_endEvent = "touchend";
				} else {
					_startEvent = "mousedown";
					_moveEvent = "mousemove";
					_endEvent = "mouseup";
				}
				_self.bind();
			};
			this.bind = function() {
				element.addEventListener(_startEvent, _self._startHandle, false);
				element.addEventListener(_moveEvent, _self._moveHandle, false);
				element.addEventListener(_endEvent, _self._endHandle, false);
			};
			this.unbind = function() {
				element.removeEventListener(_startEvent, _self._startHandle, false);
				element.removeEventListener(_moveEvent, _self._moveHandle, false);
				element.removeEventListener(_endEvent, _self._endHandle, false);
			};
			this._startHandle = function(e) {
				_isTouched = true;
				if (!!e.touches) {
					_temptouch = e.touches[0];
				} else if (typeof e.pageX != "undefined" && typeof e.pageY != "undefined") {
					_temptouch = { pageX: e.pageX, pageY: e.pageY };
				} else {
					return;
				}
				startPosition = { x: _temptouch.pageX, y: _temptouch.pageY };
				if (typeof callbacks.start == "function") {
					callbacks.start(startPosition, e);
				}
				// startPosition = {x:x,y:y};
				// if(typeof(callbacks.start)=='function'){
				//     callbacks.start(startPosition);
				// }
			};
			this._moveHandle = function(e) {
				if (!_isTouched) {
					return;
				}

				if (!!e.changedTouches && typeof e.changedTouches != "undefined") {
					_temptouch = e.changedTouches[0];
				} else if (typeof e.pageX != "undefined" && typeof e.pageY != "undefined") {
					_temptouch = { pageX: e.pageX, pageY: e.pageY };
				} else {
					return;
				}
				delta = { x: _temptouch.pageX - startPosition.x, y: _temptouch.pageY - startPosition.y };
				if (typeof callbacks.move == "function") {
					callbacks.move(delta, e);
				}
			};
			this._endHandle = function(e) {
				if (!_isTouched) {
					return;
				}
				_isTouched = false;
				if (!!e.changedTouches && typeof e.changedTouches != "undefined") {
					_temptouch = e.changedTouches[0];
				} else if (typeof e.pageX != "undefined" && typeof e.pageY != "undefined") {
					_temptouch = { pageX: e.pageX, pageY: e.pageY };
				} else {
					return;
				}

				if (typeof callbacks.end == "function") {
					delta = { x: _temptouch.pageX - startPosition.x, y: _temptouch.pageY - startPosition.y };
					if (typeof callbacks.end == "function") {
						callbacks.end(delta, e);
					}
				}
			};
			this._init();
		};
		return TouchMove;
	};
	// if(typeof(define)!='function'){
	//     window.Touch = definFun(DEVICE);
	// }
	// else{
	//     define(['../device/index'],definFun);
	// }

	if (typeof exports === "object") {
		// CommonJS
		module.exports = definFun(require("../device/"));
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(["../device/index"], definFun);
	} else {
		// Global Variables
		window.Cookie = definFun();
	}
})();
