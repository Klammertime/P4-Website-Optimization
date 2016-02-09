"use strict";
    var gulp = require('gulp'),
         del = require('del'),
       pages = require('gulp-gh-pages'),
      rename = require('gulp-rename'),
          fs = require('fs'),
        path = require('path'),
     traceur = require('gulp-traceur'),
       babel = require('gulp-babel'),
     plumber = require('gulp-plumber'),
      useref = require('gulp-useref'),
      uglify = require('gulp-uglify'),
      gulpif = require('gulp-if'),
   minifyCss = require('gulp-minify-css'),
      svgmin = require('gulp-svgmin'),
    manifest = require('gulp-appcache'),
        bust = require('gulp-buster'),
      jshint = require('gulp-jshint'),

      cache  = require('gulp-memory-cache'),
      gulpcached = require('gulp-cached'),
      browserSync = require('browser-sync');


var options = {
    dist: 'dist',
    src: 'src'
};


// Create clean task.
gulp.task('clean', function() {
    return del([options.dist]);
});

// Takes html file and runs through useref, tells html
// what script and style files have based on index.html
gulp.task('html', function() {
    return gulp.src(options.src + '/index.html', {since: cache.lastMtime('js')})
        .pipe(useref())
        .pipe(gulpif('*.js', gulpcached('linting')))
        .pipe(gulpif('*.js', jshint()))
        .pipe(gulpif('*.js', jshint.reporter()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(options.dist));
});

gulp.task('viewsHtml', function() {
    return gulp.src(options.src + 'views/pizza.html', {since: cache.lastMtime('js')})
        .pipe(useref())
        .pipe(gulpif('*.js', gulpcached('linting')))
        .pipe(gulpif('*.js', jshint()))
        .pipe(gulpif('*.js', jshint.reporter()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(options.dist + '/views'));
});

// gulp.task('buildJs', function () {
//     return gulp.src('src/**/*.js', {since: cache.lastMtime('js')})
//         .pipe(jshint())
//         .pipe(cache('js'))
//         .pipe(concat('app.js'))
//         .pipe(dest('build'));
// });

// gulp.task('watch', function () {
//     gulp.watch('src/**/*.js', gulp.series('buildJs'))
//         .on('change', cache.update('js'));
// });

// gulp.task('build', gulp.series('buildJs', 'watch'));

gulp.task('watchFiles', function() {
    return gulp.watch(es6Path)
        .on('change', cache.update('js'));
});

gulp.task('manifest', ['svg', 'html'], function(){
  return gulp.src([options.dist + '/**/*'])
    .pipe(manifest({
  relativePath: './',
      hash: true,
      preferOnline: true,
      // network: ['http://*', 'https://*', '*', 'http://*.*.*/*/*', 'https://*.*/*/*/*'],
      filename: 'memory.appcache',
      exclude: 'memory.appcache'
     }))
    .pipe(gulp.dest(options.dist));
});


gulp.task('build', ['html', 'viewsHtml', 'watchFiles'], function() {
    return gulp.src([
            // 'index.html'
        ], {
            base: options.src
        })
        .pipe(bust())

        .pipe(gulp.dest(options.dist));
});

gulp.task('deploy', function() {
    return gulp.src(options.dist + '/**/*')
        .pipe(pages());
});

gulp.task('serve', ['watchFiles']);

// Build task is a dependency of default task so can run command "gulp".
gulp.task('default', ['clean'], function() {
    gulp.start('build');
});