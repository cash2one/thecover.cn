var gulp = require('gulp');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var filesize = require('gulp-filesize');
var browserSync = require('browser-sync').create();
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
});
gulp.task('clean', function () {
  return gulp.src('dist', {
        read: false
      })
      .pipe(clean());
});
gulp.task('copyHtml', function () {
  gulp.src('src/html/*.html')
      //.pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist'));
});
gulp.task('copyImg', function () {
  gulp.src('src/img/*.*').pipe(gulp.dest('dist/img/'));
});
gulp.task('copySwf', function () {
  gulp.src('node_modules/video.js/dist/video-js.swf').pipe(gulp.dest('dist/'));
});
gulp.task('copyJs', function () {
  gulp.src('src/script/modernizr-custom.js').pipe(gulp.dest('dist/'));
});
gulp.task('concat_js_dev', function () {
  return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/packery/dist/packery.pkgd.min.js', 'node_modules/swiper/dist/js/swiper.jquery.min.js', 'node_modules/jquery.dotdotdot/src/js/jquery.dotdotdot.min.js', 'node_modules/perfect-scrollbar/dist/js/min/perfect-scrollbar.jquery.min.js', 'node_modules/video.js/dist/video.min.js', 'src/script/conf_dev.js', 'src/script/helpers.js', 'src/script/main.js'])
      .pipe(changed('dist/', {
        extension: '.js'
      }))
      .pipe(sourcemaps.init())
      .pipe(concat('all.js'))
      .pipe(filesize())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
gulp.task('concat_js_test', function () {
  return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/packery/dist/packery.pkgd.min.js', 'node_modules/swiper/dist/js/swiper.jquery.min.js', 'node_modules/jquery.dotdotdot/src/js/jquery.dotdotdot.min.js', 'node_modules/perfect-scrollbar/dist/js/min/perfect-scrollbar.jquery.min.js', 'node_modules/video.js/dist/video.min.js', 'src/script/conf_test.js', 'src/script/helpers.js', 'src/script/main.js'])
      .pipe(changed('dist/', {
        extension: '.js'
      }))
      .pipe(sourcemaps.init())
      .pipe(concat('all.js'))
      .pipe(filesize())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
gulp.task('concat_css_dev', function () {
  return gulp.src(['node_modules/normalize.css/normalize.css', 'node_modules/swiper/dist/css/swiper.min.css', 'node_modules/video.js/dist/video-js.min.css', 'node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.min.css', 'src/stylesheet/main.css'])
      .pipe(changed('dist/', {
        extension: '.css'
      }))
      .pipe(sourcemaps.init())
      .pipe(concat('all.css'))
      .pipe(cleanCSS({
        compatibility: 'ie8'
      }))
      .pipe(filesize())
      .pipe(autoprefixer({
        browsers: ['IE > 7', 'iOS > 7', 'Firefox > 20', '> 5%'],
        cascade: false
      }))
      .pipe(filesize())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/'))
      .pipe(browserSync.reload({
        stream: true
      }));
});
gulp.task('dev', ['concat_js_dev', 'concat_css_dev', 'copyHtml', 'copyImg', 'copySwf', 'copyJs'], function () {
  console.log('开发版编译完成');
});
gulp.task('test', ['concat_js_test', 'concat_css_dev', 'copyHtml', 'copyImg', 'copySwf', 'copyJs'], function () {
  console.log('测试版编译完成');
});
gulp.task('watch', ['browserSync'], function () {
  gulp.watch('src/**/*', ['dev']);
  // Other watchers
});
