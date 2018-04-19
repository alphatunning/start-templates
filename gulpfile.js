var gulp = require('gulp');
	imagemin = require('gulp-imagemin');
	clean = require('gulp-clean');
	concat = require('gulp-concat');
	htmlreplace = require('gulp-html-replace');
	uglify = require('gulp-uglify');
	browserSync = require('browser-sync');
	jshint = require("gulp-jshint");
	jshintStylish = require('jshint-stylish');
	scsslint = require('gulp-scss-lint');
	autoprefixer = require('gulp-autoprefixer');
	sass = require('gulp-sass');
	sourcemaps = require('gulp-sourcemaps');
	cache = require('gulp-cache');
	rename = require('gulp-rename');
	minifyCSS = require('gulp-minify-css');
	htmlmin = require('gulp-htmlmin');
	usemin = require('gulp-usemin');
	nunjucks = require('gulp-nunjucks-html');

// Development Tasks 
// -----------------

gulp.task('nunjucks', function(){
	return gulp.src(['src/templates/**/*.html', '!src/templates/partials/**'])
			.pipe(nunjucks({
					searchPaths: ['src/templates/']
			}))
			.pipe(gulp.dest('src/'))
			.pipe(browserSync.reload({
				stream: true
				}));
});

gulp.task('default', ['sass', 'nunjucks'],function(){

	gulp.start('server');
	gulp.watch('src/templates/**/*.html', ['nunjucks']);
	gulp.watch('src/assets/scss/**/*.scss', ['sass']);
	gulp.watch('src/assets/js/**/*.js', browserSync.reload);

	});

gulp.task('sass', function() {
	return gulp.src('src/assets/scss/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer('last 2 version'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('src/assets/css'))
	.pipe(browserSync.reload({
		stream: true
		}));
	});

gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: 'src'
		}
		});
	});

//Quality codes
gulp.task('scss-lint', function() {
	return gulp.src('/scss/*.scss')
	.pipe(scsslint())
	.pipe(gulp.dest('dist/css'));
	});

gulp.task('hint-js', function (event) {
	return gulp.src('src/js/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter(jshintStylish));
	});

// Optimization Tasks 
// ------------------
// OBS: If there is error, run "gulp build --max_old_space_size=3000"
gulp.task('build', ['clean'],function() {
	gulp.start('nunjucks','usemin', 'images','fonts');
	});

gulp.task('clean', function() {
	return gulp.src('dist')
	.pipe(clean());
	});

// Optimizing CSS and JavaScript 
gulp.task('usemin',['sass'], function() {
  return gulp.src('src/*.html')
    .pipe(usemin({
      css: [ minifyCSS ],
      js: [ uglify ],
    }))
    .pipe(gulp.dest('dist/pages'));
});

// Optimizing Images 
gulp.task('images', function() {
	return gulp.src('src/assets/img/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	.pipe(gulp.dest('dist/assets/img'));
	});

// Copying fonts 
gulp.task('fonts', function() {
	return gulp.src('src/assets/fonts/**/*')
	.pipe(gulp.dest('dist/assets/fonts'))
	})