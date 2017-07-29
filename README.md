# Website Optimization

**Project 4: Website Optimization (68 hrs)** ~ [Udacity Front End Web Developer Nanodegree Program](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001)

I optimized a provided website with a number of optimization- and performance-related issues so that it achieved a target PageSpeed score and runs at 60 frames per second. [**This page**](http://klammertime.github.io/P4-Website-Optimization/views/pizza.html) of the provided website will really drive home the challenge presented. (I did not design this ;)

### [**VIEW WEBSITE HERE**](http://klammertime.github.io/P4-Website-Optimization/)

Usage
-----
1. Clone this repository
2. Navigate to your local copy of index.html through your web browser 

Work
----
After cloning the project, work in the files located in the src directory.

Build
-----
* Download and install npm by way of installing node.js (it comes packaged with it): [node.js](https://nodejs.org/en/) 
* While in the root project directory, run: 
  
```
npm install
```

* To build the dist folder, from the root project directory run the following:

```
gulp
```

Structure
---------
* development files (i.e. originals) are in the _src_ directory
* production files (i.e. minified and processed project files) are in the _dist_ directory

## Development:

```
src
|-- index.html
|-- project-2048.html
|-- project-mobile.html
|-- project-webperf.html
|-- portfolio.appcache
|-- css
|-- js
|-- img
 -- views
    |-- pizza.html
    |-- pizza.appcache
    |-- css
    |-- js
    |-- images
     -- imageOptim
```

## Production:

```
dist
|-- index.html
|-- project-2048.html
|-- project-mobile.html
|-- project-webperf.html
|-- portfolio.appcache
|-- css
|-- js
|-- img
 -- views
    |-- pizza.html
    |-- pizza.appcache
    |-- css
    |-- js
     -- imageOptim
```

Optimizations
-------------
### index.html & files

#### index.html
* minify html
* resize & optimize images
* browser caching using a cache manifest
* save images instead of linking to google server

#### css/style.css
* inline css
* replace google font with browser font and remove font script from index.html
* add media print attribute to print.css

#### js/perfmatters.js
* minify perfmatters.js and load async; load google analytics async 
* move js bottom of page.


### pizza.html & files

#### src/views/pizza.html 
* minify html
* resize & optimize images
* browser caching using a cache manifest, pizza.appcache
* move main.js to bottom of the page

#### src/views/js/main.js
* minify js
* replace html event handler attribue with event listener
* use requestAnimationFrame(updatePositions) as instructed here: [html5rocks](http://www.html5rocks.com/en/tutorials/speed/animations/)
* to change pizza sizes, replace the the pizza images instead of changing their widths. Batch style changes of new image and div width change
* changed all usage of querySelector and querySelectorAll to either getElementsByClassName or getElementById if possible since these are live node lists and faster.
* declared the pizzasDiv variable outside of loop so the function only makes one DOM call: var pizzasDiv = document.getElementById("randomPizzas");
* moved DOM call, movingPizzas, outside the for statement and
saved it into a local variable 
var movingPizzas = document.getElementById("movingPizzas1");
* [invoked strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
* reduce background pizzas from 199 to 24 since most you do not see

#### src/views/css/style.css
* concatenate style.css & bootstrap-grid.css into combined.css
* minify combined.css
* Took advantage of hardware accelerated CSS using 'backface-visibility: hidden' to increase site performance and triggered GPU using 'transform: translateZ(0)'. Added 'will-change: transform'.
  
  ```
  .mover {
      position: fixed;
      width: 256px;
      z-index: -1;
      will-change: transform;
      transform: translateZ(0);
      backface-visibility: hidden;
  }
  ```

## Technologies Used
Chrome Developer Tools, Critical Rendering Path, CSS, HTML, 60 FPS Rendering

## Style Guide Used
[Udacity Front-End Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/)

## Resources

* **Udacity Supporting Courses**: [https://github.com/udacity/frontend-nanodegree-mobile-portfolio](https://github.com/udacity/frontend-nanodegree-mobile-portfolio), [Website Performance Optimization](https://www.udacity.com/course/website-performance-optimization--ud884), [Browser Rendering Optimization](https://www.udacity.com/course/browser-rendering-optimization--ud860)
* **Treehouse**: [Increase your sites performance with hardware accelerated css](http://blog.teamtreehouse.com/increase-your-sites-performance-with-hardware-accelerated-css), [Front End Performance Optimization](https://teamtreehouse.com/library/front-end-performance-optimization), [Website Optimization](https://teamtreehouse.com/library/website-optimization), [Using Gulp's Gulp Useref for a Full Build Pipeline](https://teamtreehouse.com/library/using-gulps-gulpuseref-for-a-full-build-pipeline)
* **Pluralsight**: [Using Google PageSpeed Insights to Improve Web Performance] (https://www.pluralsight.com/courses/google-pagespeed-insights-web-performance), [Website Performance](https://www.pluralsight.com/courses/website-performance)
* **MDN**:[CSS transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform), [Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management), [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), [will-change CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
* **CSS-Tricks**: [Backface-visibility](https://css-tricks.com/almanac/properties/b/backface-visibility/), [will-change/](https://css-tricks.com/almanac/properties/w/will-change/), [transform](https://css-tricks.com/almanac/properties/t/transform/)
* **SitePoint**: [CSS will-change Property](http://www.sitepoint.com/introduction-css-will-change-property/), [BEM and SMACSS: Advice From Developers Who’ve Been There](http://www.sitepoint.com/bem-smacss-advice-from-developers/)
* **html5Rocks**: [Accelerated Rendering in Chrome](http://www.html5rocks.com/en/tutorials/speed/layers/), [The Basics of Web Workers](http://www.html5rocks.com/en/tutorials/workers/basics/)
* [Writing Fast, Memory-Efficient JavaScript](https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/)
* [BEM: Key concepts](https://en.bem.info/method/key-concepts/)
* [How (not) to trigger a layout in WebKit](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)
* [GPU Accelerated Compositing in Chrome](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)
* [Mozilla Gfx Team Blog - Hardware acceleration and compositing](https://mozillagfx.wordpress.com/2013/07/22/hardware-acceleration-and-compositing/)
* [Using backface-visibility and CSS Animations](http://designmodo.com/backface-visibility-css-animation/)
* [http://csstriggers.com/](http://csstriggers.com/)
* [A Modern Approach to Improving Website Speed](https://www.webpagefx.com/blog/web-design/improve-website-speed/)
* [Simulate Mobile Devices with Device Mode](https://developers.google.com/web/tools/chrome-devtools/device-mode/?utm_source=dcc&utm_medium=redirect&utm_campaign=2016q3)
