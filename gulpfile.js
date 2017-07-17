var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var buildProduction = utilities.env.production;
var del = require('del');
var shell = require('gulp-shell');
var lib = require('bower-files')({
    "overrides": {
        "bootstrap": {
            "main": [
                "less/bootstrap.less",
                "dist/css/bootstrap.css",
                "dist/js/bootstrap.js"
            ]
        }
    }
});
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
//var jshint = require('gulp-jshint');


gulp.task('myTask', function() {
    console.log('hello gulp');
});


//This concats the code so that it's short'
gulp.task('concatInterface', function() {
    return gulp.src(['./resources/js/*interface.js']) //    array of js files to be concated
        .pipe(concat('allConcat.js')) //makes a folder called allConcat.js
        .pipe(gulp.dest('./tmp')); // destination is the tmp folder
});

//When browserify is run it will also run concat at the same time but it has to be predefined

gulp.task('jsBrowserify', ['concatInterface'], function() {
    return browserify({
            entries: ['./tmp/allConcat.js']
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build/js'));
});
//combined functionality of jsBrowserify into minify so that it works at once. This is beautiful
gulp.task("minifyscripts", ["jsBrowserify"], function() {
    return gulp.src("./build/js/app.js")
        .pipe(uglify())
        .pipe(gulp.dest("./build/js"));
});
// combines functionality of build,clean,browserify,and serve. Once gulp build is run it will build,clean,bower and serve.
gulp.task("build", ["clean",'ts'], function() {
    if (buildProduction) {
        gulp.start('minifyscripts');
    } else {
        gulp.start('jsBuild');
    }
    gulp.start(['Bower', 'serve'])
    gulp.start('sassBuild');
});
gulp.task("clean", function() {
    return del(['build', 'tmp']);
});

//gulp.task('jshint', function () {
//    return gulp.src(['js/*.js'])
//        .pipe(jshint())
//        .pipe(jshint.reporter('default'));
//});

gulp.task('bowerJS', function() {
    return gulp.src(lib.ext('js').files)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
}); // takes everything and places it into the vendor js folder plus minifying.
gulp.task('bowerCSS', function() {
    return gulp.src(lib.ext('css').files)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./build/css'));
});
gulp.task('Bower', ['bowerCSS', 'bowerJS']);
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });
    gulp.watch(['js/*.js'], ['jsBuild']); //for live reloading
    gulp.watch(['bower.json'], ['bowerBuild']);
    gulp.watch(['*.html'], ['htmlBuild']);
//     gulp.watch(['resources/styles/*.css', 'resources/styles/*.scss'] ['cssBuild']);
//     gulp.watch(['app/*.ts'], ['tsBuild']); required for angular
});
gulp.task('jsBuild', ['jsBrowserify'], function() {
    browserSync.reload();
});
gulp.task('bowerBuild', ['Bower'], function() {
    browserSync.reload();
});
gulp.task('htmlBuild', function() {
    browserSync.reload();
});
// gulp.task('tsBuild', ['ts'], function(){
//   browserSync.reload();
// });
// // clean task
// gulp.task('tsClean', function(){
//   return del(['app/*.js', 'app/*.js.map']);
// });
// gulp.task('ts', ['tsClean'], shell.task([
//   'tsc'
// ]));
gulp.task('cssBuild', function() {
    return gulp.src(['scss/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});
gulp.task('sassBuild', function() {
  return gulp.src(['resources/styles/*'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'));
// });
