# scrollWatcher 📜👀

A small JavaScript library for scroll-based data-driven graphics (without any nasty [scrolljacking](http://blog.arronhunt.com/post/66973746030/stop-scrolljacking)). scrollWatcher sticks an element at a fixed position onscreen, and then provides the distance scrolled through its (much taller) parent as a percentage.

- [Demo here](http://wsj.github.io/scroll-watcher/)

As seen on WSJ.com in [How Fed Rates Move Markets](http://graphics.wsj.com/reacting-to-fed-rates/) and [What ECB Stimulus Has Done](http://graphics.wsj.com/what-ecb-qe-stimulus-has-done/).

## Is scrollWatcher the right library for you?

- Want something to always stick on the page? Use [CSS `position: fixed;`](https://css-tricks.com/almanac/properties/p/position/#article-header-id-2).
- Want something to stick when you scroll past it? Use [jQuery fixto plugin](https://github.com/bbarakaci/fixto) or [jQuery Sticky](https://github.com/garand/sticky).
- Want a sticky header that hides on scroll? Use [headroom.js](http://wicky.nillia.ms/headroom.js/).
- Want to trigger events on scroll? Use [Waypoints](http://imakewebthings.com/waypoints/).
- **If you want to use scroll as a way of interacting with a data-driven graphic without scrolljacking, use scrollWatcher.**

## Quickstart

1. Include [jQuery](http://jquery.com) and the sticky-positioning [fixto plugin](https://github.com/bbarakaci/fixto) on the page.

2. In your HTML, you'll need a tall outer element, with one much shorter element inside of it.

    ```html
    <div class="outer" style="height: 2000px;">
        <div class="inner"></div>
    </div>
    ```

3. In your JavaScript, you'll need to call `scrollWatcher` with a configuration object using `parent` and `onUpdate` arguments. The function passed into `onUpdate` will run every 20 miliseconds.

    ```js
    scrollWatcher({
        parent: '.outer',
        onUpdate: function( scrollPercent, parentElement ){
            $('.inner').text('Scrolled '+scrollPercent+'% through the parent.');
        }
    });
    ```

## Examples

Check out the source code to see how these are used.

- [Basic demo](http://wsj.github.io/scroll-watcher/)
- [Using a D3 scale](http://wsj.github.io/scroll-watcher/examples/d3-scale.html)
- [Using a D3 time scale](http://wsj.github.io/scroll-watcher/examples/d3-scale-time.html)
- [Checking if the user has got there yet](http://wsj.github.io/scroll-watcher/examples/active.html)

## Other features

### Starting and stopping

If you create a new instance of scrollWatcher:

```js
var myWatcher = scrollWatcher({
    onUpdate: function( scrollPercent, parentElement ){
        console.log('Scrolled '+scrollPercent+'% through the parent.');
    },
    parent: '.outer'
});
```

... you can then start, pause and stop at any time.

```js
// stop checking but keep stuck
myWatcher.pause();

// stop checking and unstick
myWatcher.stop();

// start checking and restick
myWatcher.start();
```

### Check if active

There are two read-only properties:

- `active` is true when the scrollWatcher instance is currently onscreen (and running). 

    ```js
    var isActive = myWatcher.active;
    ```
        
- `hasBeenActive` is true when the scrollWatcher instance has been onscreen (and run) at least once.

    ```js
    var isOrWasActive = myWatcher.hasBeenActive;
    ```

You may want to use these to (for example) hide a "keep scrolling!" message.

### Check for device support

Use `scrollWatcher.supported()` to check whether or not scrollWatcher will work in the current browser.

## Browser support

scrollWatcher works on all modern browsers, including IE 9 and up. However, **it does not work on iOS 7 and lower** due to the way Safari handles CSS `position: fixed;`.

## Testing

To run tests, open [`tests.html`](http://github.com/wsj/scroll-watcher/tests.html) in your browser and wait a couple of seconds.

## Version history

**v1.0.0** (April 19, 2016)

- Initial public release

## License

[ISC](/LICENSE)
