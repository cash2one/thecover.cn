var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var changed = require('gulp-changed');
var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var filesize = require('gulp-filesize');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
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
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist'));
});
gulp.task('copyImg', function () {
  gulp.src('src/img/**/*').pipe(gulp.dest('dist/img/'));
});
gulp.task('copySwf', function () {
  gulp.src('node_modules/video.js/dist/video-js.swf').pipe(gulp.dest('dist/'));
});
gulp.task('copyJs', function () {
  gulp.src('src/script/modernizr-custom.js').pipe(gulp.dest('dist/'));
});
gulp.task('concat_js_dev', function () {
  return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/packery/dist/packery.pkgd.min.js', 'node_modules/swiper/dist/js/swiper.jquery.min.js', 'node_modules/jquery.dotdotdot/src/js/jquery.dotdotdot.min.js', 'src/script/conf_dev.js', 'src/script/helpers.js', 'src/script/main.js'])
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
  return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/packery/dist/packery.pkgd.min.js', 'node_modules/swiper/dist/js/swiper.jquery.min.js', 'node_modules/jquery.dotdotdot/src/js/jquery.dotdotdot.min.js', 'node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.min.js', 'node_modules/video.js/dist/video.min.js', 'src/script/conf_test.js', 'src/script/helpers.js', 'src/script/main.js'])
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
gulp.task('uglify_myjs', function () {
  return gulp.src(['src/script/conf_production.js', 'src/script/helpers.js', 'src/script/main.js'])
      .pipe(concat('my.js'))
      .pipe(uglify())
      .pipe(gulp.dest('src/script/'))
});
gulp.task('concat_js_production', function () {
  return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/packery/dist/packery.pkgd.min.js', 'node_modules/swiper/dist/js/swiper.jquery.min.js', 'node_modules/jquery.dotdotdot/src/js/jquery.dotdotdot.min.js','src/script/my.js'])
      .pipe(concat('all.js'))
      .pipe(gulp.dest('dist/'))
      .pipe(uglify())
});
gulp.task('concat_css_dev', function () {
  return gulp.src(['node_modules/normalize.css/normalize.css', 'node_modules/swiper/dist/css/swiper.min.css', 'src/stylesheet/main.css'])
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
gulp.task('concat_css_production', function () {
  return gulp.src(['node_modules/normalize.css/normalize.css', 'node_modules/swiper/dist/css/swiper.min.css', 'src/stylesheet/main.css'])
      .pipe(changed('dist/', {
        extension: '.css'
      }))
      .pipe(concat('all.css'))
      .pipe(cleanCSS({
        compatibility: 'ie8'
      }))
      .pipe(autoprefixer({
        browsers: ['IE > 8', 'iOS > 7', 'Firefox > 20', '> 5%'],
        cascade: false
      }))
      // .pipe(rev())
      .pipe(gulp.dest('dist/'))
});
gulp.task('clean_my_css', function () {
  return gulp.src(['src/stylesheet/main.css'])
      .pipe(cleanCSS({
        compatibility: 'ie8',
        keepSpecialComments: '*',
        keepBreaks: true
      }))
      .pipe(autoprefixer({
        browsers: ['IE > 8', 'iOS > 7', 'Firefox > 20', '> 5%'],
        cascade: false
      }))
      .pipe(gulp.dest('dist/'));
});
gulp.task('dev', ['concat_js_dev', 'concat_css_dev', 'copyHtml', 'copySwf', 'copyJs', 'copyImg'], function () {
  console.log('开发版编译完成');
});
gulp.task('test', ['concat_js_test', 'concat_css_dev', 'copyHtml', 'copySwf', 'copyJs', 'copyImg'], function () {
  console.log('测试版编译完成');
});
gulp.task('production', ['concat_css_production', 'copyHtml', 'copySwf', 'copyJs', 'copyImg', 'concat_js_production'], function () {
  console.log('生产版编译完成');
});
gulp.task('watch_dev', ['browserSync'], function () {
  gulp.watch('src/**/*', ['dev']);
  // Other watchers
});
gulp.task('watch_prod', ['browserSync'], function () {
  gulp.watch('src/**/*', ['production']);
  // Other watchers
});