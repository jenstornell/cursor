var gulp = require('gulp');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');

// Core CSS
gulp.task('css', function() {
  return gulp.src([
    'assets/css/src/global.scss',
    'assets/css/src/**/*.scss',
    '!assets/css/src/output.scss',
    '!assets/css/src/input.scss',
    ])
    .pipe(concat('style.min.scss'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('assets/css/dist'))
    .pipe(notify("CSS generated!"));
});

// Input CSS
gulp.task('input', function() {
  return gulp.src([
    'assets/css/src/input.scss',
    ])
    .pipe(concat('input.min.scss'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('assets/css/dist'))
    .pipe(notify("CSS generated!"));
});

// Core CSS
gulp.task('output', function() {
  return gulp.src([
    'assets/css/src/output.scss',
    ])
    .pipe(concat('output.min.scss'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('assets/css/dist'))
    .pipe(notify("CSS generated!"));
});

// JS lib
gulp.task('js_lib', function() {
  gulp.src([
    'assets/js/src/lib/**/*.js'
    ])
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('assets/js/dist'))
    .pipe(notify("JS generated!"));
});

// JS custom
gulp.task('js_custom', function() {
  gulp.src([
    'assets/js/src/custom/**/*.js'
    ])
    .pipe(concat('custom.min.js'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('assets/js/dist'))
    .pipe(notify("JS generated!"));
});

// Default
gulp.task('default', function() {
    gulp.watch('assets/css/src/**/*.scss', ['css']);
    gulp.watch('assets/css/src/input.scss', ['input']);
    gulp.watch('assets/css/src/output.scss', ['output']);
    gulp.watch('assets/js/src/lib/**/*.js', ['js_lib' ]);
    gulp.watch('assets/js/src/custom/**/*.js', ['js_custom' ]);
});