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
        './src/index.html',
        './src/project-2048.html',
        './src/project-mobile.html',
        './src/project-webperf.html',
        './src/views/pizza.html'
    ],
    pizzaImage: 'src/views/images/*.png',
    imageOptim: 'src/views/imageOptim/'
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
gulp.task('optimize', ['resizeBG', 'resizeLarge', 'resizeMedium', 'resizeSmall'], function() {
    return gulp.src(options.pizzaImage, {
            base: './src/views/images'
        })
        .pipe($.imagemin({
            use: [imageminJpegRecompress({
                loops: 4,
                min: 60,
                max: 95,
                quality: 'high'
            })]
        }))
        .pipe(gulp.dest(options.imageOptim));
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
    return gulp.src(options.html, {
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

gulp.task('clean', function() {
    del([options.dist, options.imageOptim]);

      del(['dist', 'img', 'css/main.min.css']);

});

gulp.task('build', ['html', 'optimize'], function() {
    return gulp.src([
            // "js/modernizr-custom.js",
            // "js/picturefill.min.js",
            '../index.html',
            options.views + 'pizza.html',
            options.imageOptim +'*.png',
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
