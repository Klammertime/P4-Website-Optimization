# Website Performance Optimization portfolio project

Usage
-----
1. Clone this repository
2. Navigate to your local copy of index.html through your web browser 

**OR**

Navigate to page hosted on github.com [here](http://klammertime.github.io/frontend-nanodegree-mobile-portfolio/)

Work
----
After cloning the project, work in the files located in the src directory.

Build
-----
1. Download and install npm by way of installing node.js (it comes packaged with it): [node.js](https://nodejs.org/en/) 
2. While in the root project directory, run: 
  
```
npm install
```

3. To build the dist folder, from the root project directory run the following:

```
gulp
```

Structure
---------
* development files (i.e. originals) are in the _src_ directory
* production files (i.e. minified and processed project files) are in the _dist_ directory

### Development:

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

### Production:

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


###pizza.html & files

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
* [Invoked strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) by adding 'use strict'; at the top of the file.
* reduce background pizzas from 199 to 24 since most you do not see

#### src/views/css/style.css
* concatenate style.css & bootstrap-grid.css into combined.css
* minify combined.css
* .mover class: Took advantage of hardware accelerated CSS using 'backface-visibility: hidden' to increase site performance and triggered GPU using 'transform: translateZ(0)'. Added will-change: transform.
  
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
**Further Reading**

[http://blog.teamtreehouse.com/increase-your-sites-performance-with-hardware-accelerated-css](http://blog.teamtreehouse.com/increase-your-sites-performance-with-hardware-accelerated-css)

[http://designmodo.com/backface-visibility-css-animation/](http://designmodo.com/backface-visibility-css-animation/)

[https://css-tricks.com/almanac/properties/b/backface-visibility/](https://css-tricks.com/almanac/properties/b/backface-visibility/)

[https://developer.mozilla.org/en-US/docs/Web/CSS/transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

[https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/](https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/)

[http://www.html5rocks.com/en/tutorials/workers/basics/](http://www.html5rocks.com/en/tutorials/workers/basics/)

[https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

[https://en.bem.info/method/key-concepts/](https://en.bem.info/method/key-concepts/)

[http://www.sitepoint.com/bem-smacss-advice-from-developers/](http://www.sitepoint.com/bem-smacss-advice-from-developers/)

[http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)

[http://csstriggers.com/](http://csstriggers.com/)
