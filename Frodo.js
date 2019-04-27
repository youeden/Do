(function Frodo() {

    if (window.Frodo) return;
    window.Frodo = Frodo;


    function Frodo(selector, context) {
        return Frodo.find(selector, context);
    }


    // defined an supporter,just like Sam in > THE RING OF KING
    function Sam(selector, context) {
        if (!selector) { throw 'selector can not be null.'; };

        this._elements = [];
        this.selector = selector;

        var type = typeof (selector);
        if (type == 'object') {
            if (isArray(selector)) {
                for (let i = 0; i < selector.length; i++) {
                    this._elements.push(selector[i]);
                }
            } else this._elements.push(selector);
        } else if (type == 'number') { // 
			
        } else if (type == 'string') { // css selector
			if(window.Sizzle){
				let matchedElems = Sizzle(this.selector, context);
			    let len = matchedElems.length;

				for(let i = 0 ; i < len ; i++){
					this._elements.push(matchedElems[i]);
				}
            }
			
			else if (document.querySelectorAll) {
                let nodeList = document.querySelectorAll(this.selector);
                let len = nodeList.length;
                for (var i = 0; i < len; i++) {
                    this._elements.push(nodeList.item(i));
                    /* here, querySelectorAll return a node list and it is [STATIC] node list; include some functions eg: item(), and this item() will store node name, It accept at lest one argument  */
                }
            }
        } else if (type == 'function') { // document loaded
            contentLoaded(this.selector, false);
        }
    }

    Mr._extend = function (target, extObj) {
        if (extObj.length) { // array or arguments
            let len = extObj.length;
            for (let i = 0; i < len; i++) {
                Mr._extend(target, extObj[i]);
            }
        } else if (extObj) {
            target = target || {};
            for (let p in extObj) {
                target[p] = extObj[p];
            }
        }
    };


    function Animation(animObj, tweenType, easeType) {
        this.ONSTART = 'onstart';
        this.ONUPDATE = 'onupdate';
        this.ONCOMPLETE = 'oncomplete';
        this.funcNames = {};
        this.funcNames[this.ONSTART] = this.funcNames[this.ONUPDATE] = this.funcNames[this.ONCOMPLETE] = false;
        this.animObj = null;
        this.timeInterval = null;
        this.stoped = false;

        let contains = false;
        for (let property in this.funcNames) {
            let func = animObj[property];
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

    // b : beginning value;  t : current time;  c : change in value;  d : delay times
    var Tween = {
        Linear: function (t, b, c, d) { return c * t / d + b; },
        Quad: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        Cubic: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        Quart: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        Quint: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        Sine: {
            easeIn: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        Expo: {
            easeIn: function (t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function (t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        Circ: {
            easeIn: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        Elastic: {
            easeIn: function (t, b, c, d, a, p) {
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function (t, b, c, d, a, p) {
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function (t, b, c, d, a, p) {
                if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
                if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        },
        Back: {
            easeIn: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        Bounce: {
            easeIn: function (t, b, c, d) {
                return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function (t, b, c, d) {
                if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        },
        func : function(tweenType, easeType) {
            let func = Tween[tweenType];
            let innerEaseType = easeType || "easeIn";

            if(typeof func == "function") {
                return func;     
            }else if (typeof func == "object") {
                return func[easeType];    
            }else {
                return Tween.Linear;    
            }
        }
    }




})();
