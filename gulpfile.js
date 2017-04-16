'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
// var browserify = require('gulp-browserify');
// var rename = require('gulp-rename');

gulp.task('sass', function(){
    return gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css/'))
    .pipe(reload({stream: true}));
}) 

gulp.task('sass:watch', function(){
    gulp.watch('./css/*.scss', ['sass']);
})

// gulp.task('scripts', function() {
//     gulp.src('./js/app.js')
//         .pipe(browserify({
//           insertGlobals : true,
//           debug : !gulp.env.production
//         }))
//         .pipe(rename(function(path) {
//             path.basename = 'app.bundle';
//         }))
//         .pipe(gulp.dest('./js'))
// });

// gulp.task('scripts::watch', function() {
//     gulp.watch('./js/app.js', ['scripts']);
// })

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('test', function(){
    gulp.watch('./*').on('change', reload);
    gulp.start('browser-sync');
    gulp.start('sass:watch');
    // gulp.start('scripts::watch');
})