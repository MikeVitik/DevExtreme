var animationFrame = require('../../../animation/frame'),
    noop = function() { },
    easingFunctions = {
        easeOutCubic: function(pos, start, end) { return (pos === 1) ? end : ((1 - Math.pow((1 - pos), 3)) * (end - start) + (+start)); },
        linear: function(pos, start, end) { return (pos === 1) ? end : (pos * (end - start) + (+start)); }
    };

exports.easingFunctions = easingFunctions;

var animationSvgStep = {
    segments: function(elem, params, progress, easing, currentParams) {
        var from = params.from,
            to = params.to,
            curSeg,
            seg,
            i, j,
            segments = [];

        for(i = 0; i < from.length; i++) {
            curSeg = from[i];
            seg = [curSeg[0]];
            if(curSeg.length > 1) {
                for(j = 1; j < curSeg.length; j++) {
                    seg.push(easing(progress, curSeg[j], to[i][j]));
                }
            }
            segments.push(seg);
        }
        currentParams.segments = params.end && progress === 1 ? params.end : segments;
        elem.attr({ segments: segments });
    },

    arc: function(elem, params, progress, easing) {
        var from = params.from,
            to = params.to,
            current = {};
        for(var i in from) {
            current[i] = easing(progress, from[i], to[i]);
        }
        elem.attr(current);
    },

    transform: function(elem, params, progress, easing, currentParams) {
        var from = params.from,
            to = params.to,
            current = {};
        for(var i in from) {
            current[i] = currentParams[i] = easing(progress, from[i], to[i]);
        }
        elem.attr(current);
    },

    base: function(elem, params, progress, easing, currentParams, attributeName) {
        var obj = {};
        obj[attributeName] = currentParams[attributeName] = easing(progress, params.from, params.to);
        elem.attr(obj);
    },

    _: noop,

    complete: function(element, currentSettings) {
        element.attr(currentSettings);
    }
};

function step(now) {
    var that = this,
        animateStep = that._animateStep,
        attrName;
    that._progress = that._calcProgress(now);

    for(attrName in that.params) {
        var anim = animateStep[attrName] || animateStep.base;
        anim(that.element, that.params[attrName], that._progress, that._easing, that._currentParams, attrName);
    }

    that.options.step && that.options.step(that._easing(that._progress, 0, 1), that._progress);

    if(that._progress === 1) return that.stop();

    return true;
}

function delayTick(now) {
    if(now - this._startTime >= this.delay) {
        this.tick = step;
    }
    return true;
}

function start(now) {
    this._startTime = now;
    this.tick = this.delay ? delayTick : step;
    return true;
}

function Animation(element, params, options) {
    var that = this;
    that._progress = 0;
    that.element = element;
    that.params = params;
    that.options = options;
    that.duration = options.partitionDuration ? options.duration * options.partitionDuration : options.duration;
    that.delay = options.delay && options.duration * options.delay || 0;
    that._animateStep = options.animateStep || animationSvgStep;
    that._easing = easingFunctions[options.easing] || easingFunctions['easeOutCubic'];
    that._currentParams = {};
    that.tick = start;
}

Animation.prototype = {
    _calcProgress: function(now) {
        return Math.min(1, (now - this.delay - this._startTime) / this.duration);
    },

    stop: function(disableComplete) {
        var that = this,
            options = that.options,
            animateStep = that._animateStep;

        that.stop = that.tick = noop;

        animateStep.complete && animateStep.complete(that.element, that._currentParams);
        options.complete && !disableComplete && options.complete();
    }
};

function AnimationController(element) {
    var that = this;
    that._animationCount = 0;
    that._timerId = null;
    that._animations = {};
    that.element = element;
}
exports.AnimationController = AnimationController;

AnimationController.prototype = {
    _loop: function() {
        var that = this,
            animations = that._animations,
            activeAnimation = 0,
            now = new Date().getTime(),
            an,
            endAnimation = that._endAnimation;

        for(an in animations) {
            if(!animations[an].tick(now)) {
                delete animations[an];
            }
            activeAnimation++;
        }
        if(activeAnimation === 0) {
            that.stop();
            that._endAnimationTimer = endAnimation && setTimeout(function() {
                if(that._animationCount === 0) {
                    endAnimation();
                    that._endAnimation = null;
                }
            });
            return;
        }
        that._timerId = animationFrame.requestAnimationFrame.call(null, function() {
            that._loop();
        }, that.element);
    },

    addAnimation: function(animation) {
        var that = this;
        that._animations[that._animationCount++] = animation;
        clearTimeout(that._endAnimationTimer);
        if(!that._timerId) {
            clearTimeout(that._startDelay);
            that._startDelay = setTimeout(function() {
                that._timerId = 1;
                that._loop();
            }, 0);
        }
    },

    animateElement: function(elem, params, options) {
        if(elem && params && options) {
            elem.animation && elem.animation.stop();
            this.addAnimation(elem.animation = new Animation(elem, params, options));
        }
    },

    onEndAnimation: function(endAnimation) {
        this._animationCount ? (this._endAnimation = endAnimation) : endAnimation();
    },

    dispose: function() {
        this.stop();
        this.element = null;
    },

    stop: function() {
        var that = this;

        that._animations = {};
        that._animationCount = 0;
        animationFrame.cancelAnimationFrame(that._timerId);
        clearTimeout(that._startDelay);
        clearTimeout(that._endAnimationTimer);
        that._timerId = null;
    },

    lock: function() {
        var an,
            animations = this._animations,
            unstoppable, // T261694
            hasUnstoppableInAnimations;

        for(an in animations) {
            unstoppable = animations[an].options.unstoppable;
            hasUnstoppableInAnimations = hasUnstoppableInAnimations || unstoppable;
            if(!unstoppable) {
                animations[an].stop(true);
                delete animations[an];
            }
        }
        (!hasUnstoppableInAnimations) && this.stop();
    }
};

exports.animationSvgStep = animationSvgStep;

///#DEBUG
exports.Animation = Animation;
exports.noop = noop;
///#ENDDEBUG
