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
### index.html
* minify html
* inline css
* resize & optimize images
* minify perfmatters.js and load async; load google analytics async. move js bottom of page.
* browser caching using a cache manifest
* load google analytics script async
* replace google font with browser font and remove font script
* add media print attribute to print.css
 save images instead of linking to google server


### pizza.html 
* minify html
* concatenate style.css & bootstrap-grid.css into combined.css
* minify combined.css
* resize & optimize images
* minify js
* browser caching using a cache manifest, pizza.appcache
* move main.js to bottom of the page
* replace html event handler attribue with event listener
* use requestAnimationFrame(updatePositions) per instructed here: [html5rocks](http://www.html5rocks.com/en/tutorials/speed/animations/
* to change pizza sizes, replace the the pizza images instead of changing their widths. Batch style changes of new image and div width change
* reduce background pizzas from 199 to 17 since most you do not see
