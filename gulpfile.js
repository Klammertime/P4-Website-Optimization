'use strict';
var gulp = require('gulp');
var del = require('del');
var pngquant = require('imagemin-pngquant');
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
        'index.html',
        './src/views/pizza.html'
    ],
    pizzaImage: 'src/views/images/*.png'
};

gulp.task('html', function() {
    return gulp.src(options.html)
        .pipe($.useref())
        .pipe($.if('*.js', $.cached('linting')))
        .pipe($.if('*.js', $.jshint()))
        .pipe($.if('*.js', $.jshint.reporter()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(gulp.dest(options.dist));
});

gulp.task('resize73', function() {
    return gulp.src(options.pizzaImage)
        .pipe($.imageResize({
            width: 73.333,
            height: 100,
            upscale: false,
            imageMagick: true
        }))
        .pipe($.rename({
            suffix: '_73'
        }))
        .pipe(gulp.dest(options.dist + '/views/images'));
});

gulp.task('resizeLarge', function() {
    return gulp.src(options.pizzaImage)
        .pipe($.imageResize({
            width: 116,
            upscale: false,
            imageMagick: true
        }))
        .pipe($.rename({
            suffix: '_Large'
        }))
        .pipe(gulp.dest(options.dist + '/views/images'));
});

gulp.task('resizeMedium', function() {
    return gulp.src(options.pizzaImage)
        .pipe($.imageResize({
            width: 77.256,
            upscale: false,
            imageMagick: true
        }))
        .pipe($.rename({
            suffix: '_Medium'
        }))
        .pipe(gulp.dest(options.dist + '/views/images'));
});

gulp.task('resizeSmall', function() {
    return gulp.src(options.pizzaImage)
        .pipe($.imageResize({
            width: 58,
            upscale: false,
            imageMagick: true
        }))
        .pipe($.rename({
            suffix: '_Small'
        }))
        .pipe(gulp.dest(options.dist + '/views/images'));
});

/* After images resized need to be optimized or compressed using an algorithm that decides
* what data to keep and what it can throw away while still maintaining visual integrity.
* Plus need to get rid of extra metadata added during imageResize.
*/
gulp.task('optimize', ['resize73', 'resizeLarge', 'resizeMedium', 'resizeSmall'], function() {
    return gulp.src(options.pizzaImage, {
            base: './src'
        })
        .pipe($.imagemin({
            use: [imageminJpegRecompress({
                loops: 4,
                min: 60,
                max: 95,
                quality: 'high'
            })]
        }))
        .pipe(gulp.dest(options.dist));
});

gulp.task('minifyCSS', function() {
    gulp.src(options.allCss, {
            base: './src'
        })
        .pipe($.cssmin())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(options.dist));
});

gulp.task('html', ['optimize'], function() {
    return gulp.src(options.html)
        .pipe($.useref())
        .pipe($.if('*.js', $.cached('linting')))
        .pipe($.if('*.js', $.jshint()))
        .pipe($.if('*.js', $.jshint.reporter()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(gulp.dest(options.dist));
});

gulp.task('clean', function() {
    del([options.dist]);
});

gulp.task('build', ['html'], function() {
    return gulp.src([
            // "js/modernizr-custom.js",
            // "js/picturefill.min.js",
            '../index.html',
            options.views + 'pizza.html'
        ], {
            base: './src'
        })
        .pipe(gulp.dest(options.dist));
});

gulp.task('deploy', function() {
        return gulp.src(options.dist + '**/*')
            .pipe($.ghPages());
    })

// Run gulp
gulp.task('default', ['clean'], function() {
    gulp.start('build')
});
