(function MrAndMs() {

    if (window.Mr) return;
    window.Mr = Mr;

    function Mr(selector, context) {
        return Mr.find(selector, context);
    }

    function Ms(selector, context) {
        if (!selector) { throw 'selector can not be null.'; };

        this._elements = [];
        this.selector = selector;

        var type = typeof (selector);
        if (type == 'object') {
            if (isArray(selector)) {
                for (var i = 0; i < selector.length; i++) {
                    this._elements.push(selector[i]);
                }
            } else this._elements.push(selector);
        } else if (type == 'number') { // 
			
        } else if (type == 'string') { // css selector
			if(window.Sizzle){
				var matchedElems = Sizzle(this.selector, context);
				var len = matchedElems.length;
				for(var i = 0 ; i < len ; i++){
					this._elements.push(matchedElems[i]);
				}
            }
			/*
			else if (document.querySelectorAll) {
                var nodeList = document.querySelectorAll(this.selector);
                var len = nodeList.length;
                for (var i = 0; i < len; i++) {
                    this._elements.push(nodeList.item(i));
                }
            }*/
        } else if (type == 'function') { // document loaded
            contentLoaded(this.selector, false);
        }
    }

    Mr._extend = function (target, extObj) {
        if (extObj.length) { // array or arguments
            var len = extObj.length;
            for (var i = 0; i < len; i++) {
                Mr._extend(target, extObj[i]);
            }
        } else if (extObj) {
            target = target || {};
            for (var p in extObj) {
                target[p] = extObj[p];
            }
        }
    };

    function SWF(movieName) {
        this.movieName = movieName;
    }

    Mr._extend(SWF.prototype, {
        call: function (funcName, args) {
            var that = this;
            (function loadSWF() {
                var target = Mr._getSwf(that.movieName);
                if (target && target[funcName]) {
                    target[funcName].apply(target, args || []);
                } else {
                    window.setTimeout(loadSWF, 500);
                }
            })();
        }
    });

    function Animation(animObj, tweenType, easeType) {
        this.ONSTART = 'onstart';
        this.ONUPDATE = 'onupdate';
        this.ONCOMPLETE = 'oncomplete';
        this.funcNames = {};
        this.funcNames[this.ONSTART] = this.funcNames[this.ONUPDATE] = this.funcNames[this.ONCOMPLETE] = false;
        this.animObj = null;
        this.timeInterval = null;
        this.stoped = false;

        var contains = false;
        for (var property in this.funcNames) {
            var func = animObj[property];
            if (func != 'undefined' && typeof (func) == 'function') {
                this.funcNames[property] = true;
                contains = true;
            }
        }

        if (!contains) {
            throw new Error('animObj dones\'t contains one of these functions "onstart", "onupdate", "oncomplete".');
        }

        this.easeType = easeType;
        this.tweenType = tweenType;

        this.animObj = animObj;
    }

    // b : beginning value, 0
    // t : current time
    // c : change in value
    // d : fps, 5
})()
