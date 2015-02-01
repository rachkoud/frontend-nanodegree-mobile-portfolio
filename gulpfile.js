var gulp = require('gulp'),
    imageop = require('gulp-image-optimization'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    minifyHtml = require("gulp-minify-html"),
    express = require('express'),
    inlinesource = require('gulp-inline-source');;

// app contains the sources and dist has the optimizations
var bases = {
 app: 'app/',
 dist: 'dist/',
};

var paths = {
    scripts: ['**/*.js'],
    styles: ['**/*.css'],
    html: ['**/*.html'],
    images: ['**/*.{png,jpg}'],
    imagesOptimizedWithJPEGMiniAndImageAlpha: ['allImagesOptimizedWithJPEGMiniAndImageAlpha/**/*.{png,jpg}'],
    fonts: ['**/*.woff2'],
    inlineSources: ['index.html']
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

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
    // Copy fonts
    gulp.src(paths.fonts, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist));

    // Copy html files
    return gulp.src(paths.html, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist));
});

// Uglify scripts
gulp.task('uglify-scripts', ['clean'], function() {
    return gulp.src(paths.scripts, {cwd: bases.app})
        .pipe(uglify())
        .pipe(gulp.dest(bases.dist));
});

// Minify styles
gulp.task('minify-css', ['clean'], function() {
    return gulp.src(paths.styles, {cwd: bases.app})
        .pipe(minifyCSS())
        .pipe(gulp.dest(bases.dist))
});

// Inline javascript and css with attribute inline
gulp.task('inline-js-and-css', ['clean', 'copy', 'minify-css', 'uglify-scripts'], function () {
    return gulp.src(paths.inlineSources, {cwd: bases.dist})
        .pipe(inlinesource())
        .pipe(gulp.dest(bases.dist));
});

// Minify html
gulp.task('minify-html', ['inline-js-and-css'], function () {
    return gulp.src(paths.html, {cwd: bases.dist})
        .pipe(minifyHtml())
        .pipe(gulp.dest(bases.dist));
});

// Optimize images
gulp.task('images-optimization', ['clean'], function() {
    // Images optimized with gulp-image-optimization didn't help to remove the image optimization warning from the pageSpeed
    // gulp.src(paths.images, {cwd: bases.app})
    //     .pipe(imageop({
    //         optimizationLevel: 7,
    //         progressive: true,
    //         max: 50,
    //         interlaced: true
    //     })).pipe(gulp.dest(bases.dist)).on('end', cb).on('error', cb);

    // Copy image optimized by JPEGMini (jpg) and ImageAlpha (png)
    return gulp.src(paths.imagesOptimizedWithJPEGMiniAndImageAlpha, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist));
});

// Default Task
gulp.task('default', ['clean', 'copy', 'minify-html', 'minify-css', 'inline-js-and-css', 'uglify-scripts', 'images-optimization', 'webserver']);