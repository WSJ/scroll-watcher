/*
scrollWatcher v1.0.0
Developed by Elliot Bentley for The Wall Street Journal
Released under the ISC license
*/
function scrollWatcher(opts){
    var isRunning = false;
    var $outer = $(opts.parent);
    var $inner = $(opts.parent).children().eq(0);
    var that = {
        active: false,
        hasBeenActive: false
    };

    // use jQuery fixTo plugin to make element sticky
    var outerId = Math.random().toString().replace('.','');
    
    if (typeof opts.onUpdate !== 'function') {
        throw('scrollWatcher needs an "onUpdate" callback.');
    }
    
    // this runs on each interval
    var maxedOut = false;
    var previousPos = 0;
    var onTick = function(){
        checkInnerHeight();
        var scrollDistance = getScrollDistance();
        var scrollPos = getScrollPos(scrollDistance);
        var cappedScrollPos = capPercentage(scrollPos);
        var scrollPosMaxOrMore = ( (scrollPos >= 100) || (scrollPos <= 0) );
        
        // 'maxedOut' is true when the scrollPos is outside of 0-100
        // and has run once at that maxed-out scroll position.
        // It improves performance by only running the callback when necessary
        if (scrollPos !== previousPos) {
            maxedOut = false;
        }
        if (!scrollPosMaxOrMore) {
            // 'active' property is for external API
            that.active = true;
            that.hasBeenActive = true;
            maxedOut = false;
        }
        if (!maxedOut) {
            // run callback function as specified by user
            opts.onUpdate( cappedScrollPos, $outer );
        }
        if (scrollPosMaxOrMore) {
            maxedOut = true;
            // 'active' property is for external API
            that.active = false;
        }
        previousPos = scrollPos;
    }    
    // gets scroll position as pixels from top of parent
    var getScrollDistance = function(){
        // cross-browser compatibility functionality from MDN
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        return y - $outer.offset().top;
    }
    // gets scroll position as % of container
    var getScrollPos = function(scrollDistance){
        var scrollPerc = ( scrollDistance / ( $outer.height() - $(window).height() ) ) * 100;
        return scrollPerc;
    }
    // toggles stickiness of 'inner' element
    var stickUnstick = function(scrollPos){
        if (scrollPos === 0){
            $inner.css('position','relative');
        } else if (scrollPos === 100) {
            $inner.css('position','absolute');
            $inner.css('bottom','0');
        } else {
            $inner.css('position','fixed');
        }
    }
    
    // prevent number from going under 0% or over 100%
    var capPercentage = function(scrollPerc){
        if (scrollPerc > 100) {
            scrollPerc = 100;
        } else if (scrollPerc < 0) {
            scrollPerc = 0;
        }
        return scrollPerc;
    }
    
    // check if child element is taller than window height
    var previousInnerHeight;
    var checkInnerHeight = function(){
        var newInnerHeight = $inner.height();
        if (newInnerHeight === previousInnerHeight) {
            return;
        }
        $inner.css( 'height', 'auto' );
        newInnerHeight = $inner.height();
        var overflow = $(window).height() - newInnerHeight;
        if (overflow >= 0) {
            newInnerHeight = $(window).height() - (overflow+5);
            $inner.css( 'height', newInnerHeight );
            $inner.css( 'margin-bottom', overflow );
        }
        previousInnerHeight = newInnerHeight;
    }

    // stop checking and unstick
    that.stop = function(){
        that.pause();
        $outer.attr('id','');
        $inner.fixTo('destroy');
        return this;
    };
    // stop checking but keep stuck
    that.pause = function(){
        isRunning = false;
        return this;
    };
    // starts watching for scroll movement
    that.start = function(){
        // sticky stuff
        $outer.attr('id',outerId);
        $inner.fixTo('#'+outerId);
        var fn = function() {
          if (isRunning === true) {
            onTick();
            window.requestAnimationFrame(fn);
          }
        }
        isRunning = true;
        window.requestAnimationFrame(fn);
        return this;
    }
    // could be a useful alias
    that.resume = that.start;

    // start watching immediately
    that.start();
        
    return that;
}

// does current device support scrollWatcher? returns true or false
scrollWatcher.supported = function(){
    
    // feature sniff for old browsers
    return ('indexOf' in []);
            
    // before iOS 8, CSS position fixed did not work
    var iOS_matches = navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS (\d_\d)/i);
    if (iOS_matches) {
        var version = parseFloat(iOS_matches[iOS_matches.length-1].replace('_','.'));
        if (version < 8) {
            return false;
        }
    }
    
    return true;
}