'use strict';
var gulp = require('gulp');
var del = require('del');
var imageminPngquant = require('imagemin-pngquant');
var pngquant = require('imagemin-pngquant');
var imageminOptipng = require('imagemin-optipng');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
    // pages = require('gulp-gh-pages'); TODO: Figure out if its ghPages

var $ = require('gulp-load-plugins')({
    lazy: true
});

var options = {
    dist: 'dist',
    src: './src/',
    views: './src/views/',
    allJs: [
        './src/js/*.js',
        './src/views/js/*.js'
    ],
    allCss: [
        './src/css/*.css',
        './src/views/css/*.css'
    ],
    allimages: [
        './img/*',
        './views/images/*'
    ],
    html: [
        './src/index.html',
        './src/project-2048.html',
        './src/project-mobile.html',
        './src/project-webperf.html',
    ],
    pizzaImage: 'src/views/images/*.png',
    imageOptim: 'src/views/imageOptim/'
};

gulp.task('resize100', function() {
    return gulp.src(options.views + 'images/pizzeria.jpg')
        .pipe($.imageResize({
            width: 100,
            upscale: false,
            imageMagick: true
        }))
        .pipe($.rename({
            suffix: '_100'
        }))
        .pipe(gulp.dest(options.imageOptim));
});

gulp.task('resizeBG', function() {
    return gulp.src(options.pizzaImage)
        .pipe($.imageResize({
            width: 73.333,
            height: 100,
            upscale: false,
            imageMagick: true
        }))
        .pipe($.rename({
            suffix: '_BG'
        }))
        .pipe(gulp.dest(options.imageOptim));
});

gulp.task('resizeLarge', function() {
    return gulp.src(options.pizzaImage)
        .pipe($.imageResize({
            width: 232,
            upscale: false,
            imageMagick: true
        }))
        .pipe($.rename({
            suffix: '_Large'
        }))
        .pipe(gulp.dest(options.imageOptim));
});

gulp.task('resizeMedium', function() {
    return gulp.src(options.pizzaImage)
        .pipe($.imageResize({
            width: 164.79,
            upscale: false,
            imageMagick: true
        }))
        .pipe($.rename({
            suffix: '_Medium'
        }))
        .pipe(gulp.dest(options.imageOptim));
});

gulp.task('resizeSmall', function() {
    return gulp.src(options.pizzaImage)
        .pipe($.imageResize({
            width: 116.25,
            upscale: false,
            imageMagick: true
        }))
        .pipe($.rename({
            suffix: '_Small'
        }))
        .pipe(gulp.dest(options.imageOptim));
});

/* After images resized need to be optimized or compressed using an algorithm that decides
* what data to keep and what it can throw away while still maintaining visual integrity.
* Plus need to get rid of extra metadata added during imageResize.
*/
gulp.task('optimizePizza', ['resize100', 'resizeBG', 'resizeLarge', 'resizeMedium', 'resizeSmall'], function() {
    return gulp.src('src/views/**/*')
         .pipe($.if('*.jpg', $.imagemin({
              use:[imageminJpegRecompress({
                loops:3,
                min: 70,
                max: 90,
                quality:'high'
              })]
            })))
        .pipe($.if('*.png', $.imagemin({
              use:[imageminOptipng({
                optimizationLevel: 3
              })]
            })))
        .pipe(gulp.dest('dist/views'));
});

gulp.task('optimize', function() {
    return gulp.src('src/img/*.*')
        .pipe($.if('*.jpg', $.imagemin({
              use:[imageminJpegRecompress({
                loops:3,
                min: 70,
                max: 90,
                quality:'high'
              })]
            })))
        .pipe($.if('*.png', $.imagemin({
              use:[imageminOptipng({
                optimizationLevel: 3
              })]
            })))
        .pipe(gulp.dest('dist/img/'));
});

// gulp.task('unCSSPizza', function() {
//     gulp.src('./src/views/css/style.css')
//         .pipe($.uncss({
//             html: './src/views/pizza.html'
//         }))
//         .pipe(gulp.dest('./src/views/css'));
// });

gulp.task('unCSS', function() {
    gulp.src('./src/css/style.css')
        .pipe($.uncss({
            html: options.html
        }))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('html', ['optimize'], function() {
    return gulp.src('./src/*.html', {
            base: './src'
        })
        .pipe($.useref())
        .pipe($.if('*.js', $.cached('linting')))
        .pipe($.if('*.js', $.jshint()))
        .pipe($.if('*.js', $.jshint.reporter()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(gulp.dest(options.dist));
});

gulp.task('htmlPizza', ['optimizePizza'], function() {
    return gulp.src(options.views + 'pizza.html')
        .pipe($.useref())
        .pipe($.if('*.js', $.cached('linting')))
        .pipe($.if('*.js', $.jshint()))
        .pipe($.if('*.js', $.jshint.reporter()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(gulp.dest(options.dist + '/views'));
});

gulp.task('clean', function() {
    del([options.dist, options.imageOptim]);
});

gulp.task('build', ['html', 'htmlPizza'], function() {
    return gulp.src([
            // "js/modernizr-custom.js",
            // "js/picturefill.min.js"
        ], {
            base: './src'
        })
        .pipe(gulp.dest(options.dist));
});

gulp.task('deploy', function() {
        return gulp.src(options.dist + '/**/*')
            .pipe($.ghPages());
    })

// Run gulp
gulp.task('default', ['clean'], function() {
    gulp.start('build')
});
