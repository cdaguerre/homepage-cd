var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    sass        = require('gulp-sass'),
    csso        = require('gulp-csso'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    concat      = require('gulp-concat'),
    plumber     = require('gulp-plumber'),
    livereload  = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
    tinylr      = require('tiny-lr'),
    express     = require('express'),
    app         = express(),
    marked      = require('marked'), // For :markdown filter in jade
    path        = require('path'),
    server      = tinylr();

// --- Basic Tasks ---
gulp.task('css', function() {
  return gulp.src('src/assets/stylesheets/*.scss')
    .pipe( plumber() )
    .pipe(
      sass( {
        includePaths: ['src/assets/stylesheets'],
        errLogToConsole: true
      } ) )
    .pipe( csso() )
    .pipe( gulp.dest('dist/assets/stylesheets/') )
    .pipe( livereload( server ));
});

gulp.task('js', function() {
  gulp.src('src/assets/scripts/*.js')
    .pipe( plumber() )
    .pipe( uglify() )
    .pipe( concat('all.min.js'))
    .pipe( gulp.dest('dist/assets/scripts/'))
    .pipe( livereload( server ));
});

gulp.task('templates', function() {
  gulp.src('src/*.jade')
    .pipe( plumber() )
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe( livereload( server ));
});

gulp.task('fonts', function() {
  gulp.src('src/assets/fonts/**')
    .pipe(gulp.dest('dist/assets/fonts'));
});
gulp.task('images', function() {
  gulp.src('src/assets/images/**')
    .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('express', function() {
  app.use(express.static(path.resolve('./dist')));
  app.listen(1337);
  gutil.log('Listening on port: 1337');
});

gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('src/assets/stylesheets/**/*.scss',['css']);

    gulp.watch('src/assets/scripts/*.js',['js']);

    gulp.watch('src/**/*.jade',['templates']);

  });
});

// Default Task
gulp.task('default', ['fonts', 'images', 'js','css','templates','express','watch']);