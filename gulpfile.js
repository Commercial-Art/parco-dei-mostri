var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var notify = require("gulp-notify");
var ghPages = require('gulp-gh-pages');

gulp.task('css', function () {
  return gulp.src('src/css/*.css')
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('build/css/'))
    .pipe(notify("css task completed"));
});

gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('build/js/'))
    .pipe(notify("js task completed"));
});

gulp.task('img', function () {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('build/img/'))
    .pipe(notify("img task completed"));
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build/'))
    .pipe(notify("html task completed"));
});

gulp.task('CNAME', function () {
  return gulp.src('src/CNAME')
    .pipe(gulp.dest('build/'))
    .pipe(notify("CNAME task completed"));
});

gulp.task('watch', function() {
  gulp.watch('src/css/*.css', ['css']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/img/**/*', ['img']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/CNAME', ['CNAME']);
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['css', 'js', 'img', 'html', 'CNAME'], function() {
  gulp.start('watch');
});
