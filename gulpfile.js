const {src, dest, parallel, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');

function server() {
    browserSync.init({
        server: {baseDir: 'src/'},
        online: true,
    });
}

function scripts() {
    return src([
        'src/js/main.js',
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js'))
    .pipe(browserSync.stream())
}

function styles() {
    return src([
        'src/styles/main.scss',
    ])
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('src/css'))
    .pipe(browserSync.stream())
}

function images() {
	return src('src/images/src/**/*')
	.pipe(newer('src/images/dest/'))
	.pipe(imagemin())
	.pipe(dest('src/images/dest/'))
}

function startwatch() {
    watch('src/**/styles/**/*', styles);

    watch(['src/**/*.js', '!src/**/*.min.js'], scripts);

    watch('src/**/*.html').on('change', browserSync.reload);

    watch('src/images/src/**/*', images);
}

function buildcopy() {
	return src([
		'src/css/**/*.min.css',
		'src/js/**/*.min.js',
        'src/images/dest/**/*',
        'src/fonts/**/*',
		'src/**/*.html',
		], { base: 'src' })
	.pipe(dest('dist'))
}

exports.build = series(styles, scripts, images, buildcopy);

exports.images = images;

exports.default = parallel(styles, scripts, server, startwatch);
