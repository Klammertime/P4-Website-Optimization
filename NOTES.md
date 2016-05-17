
##Udacity: Browser Rendering Optimization

* If a site takes a long time to load, 80% is usually in the front-end, not back-end, which is the opposite of what people had thought. So most of the performance burden lies on the front-end devs shoulders.
* Google survey found #1 user request was a smooth experience, such as when scrolling. 
* Web performance is the unsung hero of UX, leaving an indelible impression on the user.
* If there is any visual change, from scrolling to clicking on an animation, the browser will put up a new frame. Most devices refresh their screen 60 times per second, 60Hz, or 60fps. People notice when we miss one of these frames and they hate it. If browser takes too long to make a frame, it will get missed out, the frame rate will drop and users will see stuttering. If its really bad, the whole screen will lock up.
* 16ms/frame is all you have to make a frame to make it stay smooth, but since the browser has housekeeping work to do in making each frame you have more like 10ms/frame.
* In order to optimize fps you need to understand what goes into making a frame. So, **what goes into making a frame?** Udacity's course 'Website Performance Optimization' goes into this in more detail but roughly, the browser makes a GET request to a server, the server responds by sending some HTML, the browser parses the document and creates the DOM. Then it gets the CSS, combines the DOM and CSS, which is known as recalculating styles. When combined, you get the render tree. The render tree only shows what is displayed, so if you have CSS that says `display: none`, that won't show up in the render tree. Conversely, if you have CSS that has a pseudo element `:after` or `:before`, this gets added to the render tree even though it doesn't get added to the DOM. Only visible elements are in the render tree. So this is where the critical rendering path gets you. This is the **style** portion.
* Once the browser knows which rules apply to a single element, it can start to calculate **layout**, or how much space elements take up and where they are on the screen.
* Since one layout item can affect the other elements, such as the header height, all the way down the tree, this process can be rather involved for the browser. **Layout is also called reflow**.
* Then it starts to **paint** the page. For an image, the browser is actually decoding a photograph into memory pixel by pixel. Painting can be done into a single surface, but sometimes the browser makes multiple surfaces, called layers or **compositor** layers. 
* This covered this part of the pipeline: **style > layout > paint > composite**
* **Dev tools > timeline** This is where we spend most of our time to check fps etc.
* This resource has all you need to know to use the timeline in dev tools -->**Performance profiling with the Timeline**: [https://developer.chrome.com/devtools/docs/timeline#rendering-event-properties](https://developer.chrome.com/devtools/docs/timeline#rendering-event-properties)

* Now we're adding JavaScript to the front of the pipeline, since besides static pages, this is usually what creating a frame looks like when we are dealing with more than just a static page: **JavaScript > Style > Layout > Paint > Composite**
* **JavaScript** Normally you use JS to handle work that results in visual changes, whether its jQuery's animation functions or adding DOM elements to the page. But you don't have to use JS to make visual changes to the page. You can also use CSS animations or web animation API. 
* Changes we make in JS won't necessarily affect every part of the pipeline.

###Rendering Pipeline in Action (3 main examples of different types of changes)
**Example 1)** We make a visual change with JS or CSS (JS), the browser must recalculate the styles of the elements that were affected (Style). If you affected the layout, such as an elements geometry, width or height or position in relation to another element, then the browswer will have to check all of the other elements and reflow the page (Layout), all affected areas will need to repainted (Paint) and final painted elements will need to be composited (Composite).
**Example 2)** Change a paint only propery such as background image or text color or shadows. We make the change (JS), styles calculated (Style), don't do layout since geometry not affected, do paint and composite.
**Example 3)** Just compositing, which would involve JS, Style and Composite.
* Knowing what triggers what is so confusing, so use [csstriggers.com](csstriggers.com) to find out.
* You are supposed to pick your battles, since their are tradeoffs to different changes you make.
 
###RAIL or LIAR: Load, Idle, Animations, Response
* 4 major areas of an app's lifecycle: **RAIL**(really LIAR if in order):
**Load, Idle, Animations, Response**. However, most apps do multiple loads, so load is not always at the beginning, for example, with XHR, web sockets, etc. 
* **Load & Idle**: Users want app to load quickly. You want your initial load to be done in 1 second. After an app is loaded, its usually idle, waiting for the user to interact. This is our opportunity to deal with things we deferred to meet that 1 sec load time. Normally these idle periods are 50ms long however we might have several of them in one go. These idle times are fantastic times to get some heavy lifting done so when the user interacts things are fast. (Best practice is to keep your post-load work to 50ms chunks)
    - So there are some critical things you need to do during load, for example if you are going to a news site, you need to load news text and basic critical functionality, but you can possibly handle the following during the idle period: image assets, videos, comments section.
* Now that you've loaded the app and gotten some post-load work done, the user is going to start interacting with the app so you need to be responsive to that. We aren't taking responsive sizes, we are talking about responsive in the sense that it reacts to the user's input without delay. 
* How responsive does it need to be though? Studies show that their is a limit of 100ms, or 1/10th of a second after someone presses something on screen before they notice any lag. So if you can respond to all user input in 100ms, you're good. That's easy to do if all they did was tap a button etc., but this is more challenging if someone does something that requires animation.
* **The most challenging performance issues always come out of the need to hit 60fps, which is either interactions that stick to the user's finger or animations and transitions. For those you have 16ms. But really you have 10ms-12ms.**
* There are many ways to handle animations and it depends on the project. 
* Teacher used something called, FLIP, first last invert play.

### Load (1 sec) > Idle (50ms chunks) > Animation (16ms or really 10-12ms) > Response (100ms or 1/10th sec)
* It looks like each frame only has ~10ms to be done with the entire cycle of JS > Style > Layout  > Paint > Composite. So if you interrupt one of those, such as Layout, with JS, it can cause issues. 
* Looking into the JS portion of the pipeline more closely: avoid micro-optimizations. Like obsessing over for...loop or while loop. We don't know how the JS engine will treat or run our code, since the code we write is not what get's run. Only start looking into microoptimizations if you've exhausted your other options. There are other things you can do before that, such as the following: 
    **1) Make sure the JS runs at the right time with requestAnimationFrame**: 
    * The browser has very little time to render the frame at 60 frames per second. So in that 10ms you have to do it all, which means the JavaScript portion should be kept at 3-4ms at most since their will be other work like style calculations, layer managment and compositing that will come afterwards. Imagine the browser is in the middle of doing style work and then in comes style work that needs attention. The browser has to deal with the JS that just came in before it can move to other tasks. That new JS will make the work for the frame to have to be redone, which could mean missing the frame. 
    * requestAnimationFrame schedules JavaScript to run at the earliest possible moment in each frame. That gives the browser as much time as possible to run JS, then style, layout, paint, then composite.
    * Older code on the web for animation uses setTimeout or setInterval because in the past that's all there was (jQuery still does). The problem with these is that the JS engine pays no attention to the rendering pipleline when scheduling these. Not a good fit for animations. 
    * Here's how you use it:
        ```
        2) Fcn gets called, do your animation, and at the end of it, you schedule the next one. The browser takes care of when it should run and how.
        function animate() {
        // Do something here
        requestAnimationFrame(animate);
        }
        1) You make a call to it and tell it which function to call
        requestAnimationFrame(animate);
        ```
    * All browsers support rAF except IE9, where you can use polyfill.
    **2) Make sure the JS doesn't take too long to run with Web Workers**:
    * Since everything for the frame has to share that 16ms timespan, JS has a portion of that. Its easy for JS to take a while to run, especially for frameworks and libraries, since they need time to do their work, such as handling views, callbacks or analyzing data. You can find out how long the JS takes to run in the Timeline, with JS Profiler turned on. Then hit record. Only use the profiler when you know you have a problem with long running JS. 
    * Web Workers: These provide an interface for spawning scripts to run in the background. Normally web sites run in a single thread running on the operating system. WW allow you to run JS in a totally different scope than the main window and on a totally different operating system thread. Whatever is happening in the main thread won't be affected by the worker thread and the opposite is true.
    * For More on web workers: [https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
    **3) Memory Management**: 
    * JS is garbage collected, which means as devs we don't have to worry about it but the downside is that the JS engine has to handle that itself and when it decides to run the garbage collector, nothing else runs. This can cause visible pauses. You can't always predict whether your code will be garbagey, so that's why you have to measure it using chrome dev tools in timeline, switch on memory profile then record it. 
    * You can see a steep line then it drops off, which is the garbage collection occurring. If there are a lot of fast climbs, we are assigning memory fast and often. Also, when garbage collection runs, does it take it back to zero? If not, their is a memory leak.
    * You can uncheck memory then go to the details below, or cmd f, enter GC in search to see how long its taking. (GC is garbage collection).
    * For More on memory management: 
        - [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
        - [Udacity - JS Memory Management](https://classroom.udacity.com/nanodegrees/nd001/parts/00113454012/modules/273584856175461/lessons/4138168623/concepts/41645386230923)
    
### Styles & Layout
* There are also style modifications we can make, such as **reducing selector complexity**, which means using fewer tags and class names to select elements. Instead of `:nth-child(3)` since it has to figure out if it's the 3rd child or not, you can use another class, or combine the classes using BEM, Block Element Modifier, such as `.box--three` where box is the Block, there is no element, and three is the modifier, instead of using:
    ```
    <div class="box"></div>
    <div class="box b-3"></div>
    ```
More about BEM: [http://www.sitepoint.com/bem-smacss-advice-from-developers/](http://www.sitepoint.com/bem-smacss-advice-from-developers/)
* You can also **reduce the # of affected elements**, which means fewer changes to the render tree.

* **What is layout thrashing?** It's when you put layout before the style calculations, which is not a problem unless you then make a style change. This is especially bad if its within a loop. This is called a **forced synchronous layout**. Here is a perfect example of layout thrashing:
```
var paragraphs = document.querySelector('p');
var greenBlock = document.getElementById('block');

// This is going to cause **layout thrashing**, each time
// you calculate layout, style then changes so you have to calculate
// layout over again.
for(var p = 0; p < paragraphs.length; p++){
    // This is triggering layout, its a layout calculation
    var blockWidth = greenBlock.offsetWidth;
    // This is triggering style, it's changing the style
    paragraphs[p].style.width = blockWidth + 'px';
}

```
If you trigger forced syncronous layout, in waterfall view, dev tools denotes it with 
an ! mark or in flame chart view, a red triangle.

**Does not cause FSL**:
```
// Layout is run OUTSIDE of the loop
var newWidth = container.offsetWidth;
divs.forEach(function(elem, index, arr){
    // Then we batch style changes
    elem.style.width = newWidth;
})
```

**Causes FSL**:
```
divs.forEach(function(elem, index, arr) {
// Layout run inside loop
    if(window.scrollY < 200) {
    // Then style changed
        elem.style.opacity = 0.5;
    }
})
```
**How could we fix code so it does not cause FSL?**
A: Read layout properties then **batch** style changes
(Note, he converted the DOM obj to an array because he likes forEach)
**FSL Code**

```
divs.forEach(function(elem, index, arr) {
    // Layout triggered each time
    if (elem.offsetHeight < 500) {
        // Style changed each time, style triggered
        elem.style.maxHeight = '100vh';
    }
})
```

**Our Fix**

```
// this only reads layout once at beginning 
if (elem.offsetHeight < 500) {
    divs.forEach(function(elem, index, arr) {
        // Then it batch style changes afterwards
        elem.style.maxHeight = '100vh';
    })
}
```
* **What triggers layout?** Any property for which a browser must run geometric information, like positions and dimensions (widths, heights, left, top). When you don't change the style, you can use the previous frame's layout values.
* [How (not) to trigger a layout in WebKit](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)
* This is very common apparently, and causes layout thrashing.
* Whether you animate styles with JS or CSS, if you change layout in either, you still incur the same cost. Width, top, height all triggers layout which triggers paint, always. Shadow triggers paint, which is also very expensive. 
* During animations, avoid layout and pain alltogether if you can. 

### Painting & Compositing
* Last 2 stages in the pipeline. Paint is the fastest way to kill your fps. Paint problems are the worst bottleneck you're likely to encounter.
* Dev tools > timeline > rendering, check 'show paint rectangles' and you can see whats being painted.
* Compositing: Multiple layers, such as one layer with page content, and 1 layer with side nav.
* Composite layers: In timeline, can see 'update layer tree' and 'composite layers'. More layers you have, more time browser spend compisiting layers, so there is a tradeoff between reducing paint time by having more layers and reducing compositing with less layers.
* Generally you should let the browser manage layers since it knows what its doing but if you're hitting a paint issue, you might want to promote an element to its own layer. First see if it has its own layer. Dev tools > hit esp > rendering, switch on show composited layer borders. You'll see box outlines that are on their own layer.
* **How do you put an element on its own compositor layer?** We tell the browser to expect a visual change with the will-change CSS property, it can then choose to put the element on its own compositor layer.
To prepare for the transform, the browser creates a new layer. The benefit of will-change is that creating a new layer is expensive, needs to be created then painted, so you are doing it ahead of time, not on the fly, which is expensive.

```
.circle {
    will-change: transform;
}
```
For older browsers you have to use this hack:

```
.circle {
    transform: translateZ(0);
}
```
* In a production environment, you'll probably need both.

##Udacity: Website Performance Optimization
* **Minify, compress and cache** HTML, CSS, JS. Remove unnecessary styles.
* **Avoid render blocking CSS**: In order to paint the page, you have to have constructed the DOM and CSSOM trees, you don't want to paint an unstyled page. By default, the browser assume CSS is render blocking. To optimize this, you can scope styles to certain conditions by splitting the CSS into multiple files, like print styles into print.css by adding a media attribute `media='print'`, it will still download all of the files, but wouldn't block rendering on print styles. The same works for media queries, `media="orientation: landscape"`
* **Avoid parser blocking scripts**: User defer or async. Async says if can, browser should execute script asynchronously, and doesn't block on async js. Defer attribute tells browser that script should execute after document has been parsed. 
* General strategies for optimization:
    - Minify, Compress, Cache: HTML, CSS, JavaScript
    - Minimize use of render blocking resources (CSS): Use media queries on <link> to unblock rendering & inline CSS
    - Minimize use of parser blocking resouces (JS): defer JS execution and use async attribute on <script>
* General buckets or themes: 1) Minimize bytes or critical bytes 2) Reduce critical resouces 3) Shorten critical rendering path length, best-case is 1, keep round-trips down.

   

