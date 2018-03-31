/* global require */

const autoPrefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  cssNano = require('gulp-cssnano'),
  del = require('del'),
  dependencies = require('gulp-web-dependencies'),
  esLint = require('gulp-eslint'),
  git = require('gulp-git'),
  gulp = require('gulp'),
  install = require('gulp-install'),
  mustache = require('gulp-mustache'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourceMaps = require('gulp-sourcemaps'),
  through = require('through2'),
  uglify = require('gulp-uglify'),
  webServer = require('gulp-webserver');

////////////////////////////////////////////////////////////////////////////////

gulp.task('cleanup', () => del(['./dist/**']));

////////////////////////////////////////////////////////////////////////////////

const jsGlob = './src/**/*.js';

const buildJS = () => gulp.src(jsGlob)
  .pipe(mustache())
  .pipe(esLint())
  .pipe(esLint.format())
  .pipe(babel())
  .pipe(gulp.dest('./dist/'))
  .pipe(rename((path) => path.basename += '.min'))
  .pipe(sourceMaps.init())
  .pipe(uglify())
  .pipe(sourceMaps.write('.'))
  .pipe(gulp.dest('./dist/'));

gulp.task('cleanBuildJS', ['cleanup'], () => buildJS());

////////////////////////////////////////////////////////////////////////////////

const cssGlob = ['./src/**/*.css'];

const buildCSS = () => gulp.src(cssGlob)
  .pipe(mustache())
  .pipe(autoPrefixer())
  .pipe(gulp.dest('./dist/'))
  .pipe(rename((path) => path.basename += '.min'))
  .pipe(sourceMaps.init())
  .pipe(cssNano())
  .pipe(sourceMaps.write('.'))
  .pipe(gulp.dest('./dist/'));

gulp.task('cleanBuildCSS', ['cleanup'], () => buildCSS());

////////////////////////////////////////////////////////////////////////////////

const scssGlob = ['./src/**/*.scss'];

const buildSCSS = () => gulp.src(scssGlob)
  .pipe(mustache())
  .pipe(sass())
  .pipe(autoPrefixer())
  .pipe(gulp.dest('./dist/'))
  .pipe(rename((path) => path.basename += '.min'))
  .pipe(sourceMaps.init())
  .pipe(cssNano())
  .pipe(sourceMaps.write('.'))
  .pipe(gulp.dest('./dist/'));

gulp.task('cleanBuildSCSS', ['cleanup'], () => buildSCSS());

////////////////////////////////////////////////////////////////////////////////

const htmlGlob = ['./src/**/*.html'];

const buildHtml = () => gulp.src(htmlGlob)
  .pipe(mustache())
  .pipe(dependencies({
    dest: './dist/',
    prefix: '/vendors',
  }))
  .pipe(gulp.dest('./dist/'));

gulp.task('cleanBuildHtml', ['cleanup'], () => buildHtml());

////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['cleanup', 'cleanBuildJS', 'cleanBuildCSS', 'cleanBuildSCSS', 'cleanBuildHtml']);

////////////////////////////////////////////////////////////////////////////////

gulp.task('serve', ['default'], () => {
  gulp.src('.')
    .pipe(webServer({
      directoryListing: {
        enable: true,
        path: '.'
      },
      livereload: true,
      open: true,
      port: 8080
    }));

  gulp.watch(jsGlob, () => buildJS());
  gulp.watch(cssGlob, () => buildCSS());
  gulp.watch(scssGlob, () => buildSCSS());
  gulp.watch(htmlGlob, () => buildHtml());
});

////////////////////////////////////////////////////////////////////////////////

gulp.task('goodmorning_gitpull', () => {
  return gulp.src('.')
    .pipe(through.obj((chunk, enc, cb) => {
      git.revParse({
        args: '--abbrev-ref HEAD'
      }, (err, branch) => {
        git.pull('origin', branch, () => {
          cb(null, chunk);
        });
      });
    }));
});

gulp.task('goodmorning_install', ['goodmorning_gitpull'], () => {
  return gulp.src(['./package.json'])
    .pipe(install());
});

gulp.task('goodmorning', ['goodmorning_gitpull', 'goodmorning_install'], () => {
  console.log('  ________                  .___    _____                      .__              ._.');
  console.log(' /  _____/  ____   ____   __| _/   /     \\   ___________  ____ |__| ____    ____| |');
  console.log('/   \\  ___ /  _ \\ /  _ \\ / __ |   /  \\ /  \\ /  _ \\_  __ \\/    \\|  |/    \\  / ___\\ |');
  console.log('\\    \\_\\  (  <_> |  <_> ) /_/ |  /    Y    (  <_> )  | \\/   |  \\  |   |  \\/ /_/  >|');
  console.log(' \\______  /\\____/ \\____/\\____ |  \\____|__  /\\____/|__|  |___|  /__|___|  /\\___  /__');
  console.log('        \\/                   \\/          \\/                  \\/        \\//_____/ \\/');
});

////////////////////////////////////////////////////////////////////////////////

gulp.task('goodnight_gitpush', () => {
  return gulp.src('.')
    .pipe(through.obj((chunk, enc, cb) => {
      git.revParse({
        args: '--abbrev-ref HEAD'
      }, (err, branch) => {
        git.push('origin', branch, () => {
          cb(null, chunk);
        });
      });
    }));
});

gulp.task('goodnight', ['goodnight_gitpush'], () => {
  console.log('  ________                  .___  _______  .__       .__     __  ._.');
  console.log(' /  _____/  ____   ____   __| _/  \\      \\ |__| ____ |  |___/  |_| |');
  console.log('/   \\  ___ /  _ \\ /  _ \\ / __ |   /   |   \\|  |/ ___\\|  |  \\   __\\ |');
  console.log('\\    \\_\\  (  <_> |  <_> ) /_/ |  /    |    \\  / /_/  >   Y  \\  |  \\|');
  console.log(' \\______  /\\____/ \\____/\\____ |  \\____|__  /__\\___  /|___|  /__|  __');
  console.log('        \\/                   \\/          \\/  /_____/      \\/      \\/');
});
