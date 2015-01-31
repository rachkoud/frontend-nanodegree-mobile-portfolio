var gulp = require('gulp'),
    watch = require('gulp-watch'),
    imageop = require('gulp-image-optimization'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    minifyHtml = require("gulp-minify-html"),
    express = require('express');

// app contains the sources and dist has the optimizations
var bases = {
 app: 'app/',
 dist: 'dist/',
};

var paths = {
    scripts: ['**/*.js'],
    styles: ['**/*.css'],
    html: ['**/*.html'],
    images: ['**/*.{png,jpg}']
};

// Start web server on port 8080
gulp.task('webserver', function() {
    var app = express();
    var compress = require('compression');

    // New call to compress content
    app.use(compress());

    app.use(express.static(bases.dist));

    app.listen(process.env.PORT || 8080);
});

// Delete the dist directory
gulp.task('clean', function() {
    return gulp.src(bases.dist).pipe(clean());
});

// Uglify scripts
gulp.task('scripts', ['clean'], function() {
    gulp.src(paths.scripts, {cwd: bases.app})
        .pipe(uglify())
        .pipe(gulp.dest(bases.dist));
});

// Minify styles
gulp.task('minify-css', ['clean'], function() {
    gulp.src(paths.styles, {cwd: bases.app})
      .pipe(minifyCSS())
      .pipe(gulp.dest(bases.dist))
});

// Minify html
gulp.task('minify-html', ['clean'], function () {
    gulp.src(paths.html, {cwd: bases.app})
    .pipe(minifyHtml())
    .pipe(gulp.dest(bases.dist));
});

// Optimize images
gulp.task('images-optimization', ['clean'], function(cb) {
    gulp.src(paths.images, {cwd: bases.app})
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })).pipe(gulp.dest(bases.dist)).on('end', cb).on('error', cb);
});

// Default Task
gulp.task('default', ['clean', 'minify-html', 'minify-css', 'scripts', 'images-optimization', 'webserver']);