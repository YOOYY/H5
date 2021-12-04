var gulp = require("gulp"),
    pug = require('gulp-pug'),
    sass = require('gulp-sass')(require('sass')),

    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    mock = require('./mock.js');

//图片配置
var cssPath = "./app/scss",
    htmlPath = "./app/pug",
    jsPath = "./app/js";
var cssOutPath = "./build/css",
    htmlOutPath = "./build/html",
    jsOutPath = "./build/js";

//html
gulp.task('pug', () =>
    gulp.src([htmlPath + '/**/*.pug', '!' + htmlPath + '/share/**'])
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest(htmlOutPath))
    .pipe(reload({
        stream: true
    }))
);

//css
gulp.task('scss', function () {
    return gulp.src(cssPath + '/*.scss')
        .pipe(sass().on('error', sass.logError).on('error', function () {
            throw ('scss转css错误');
        }))
        .pipe(gulp.dest(cssOutPath))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('js', () =>
    gulp.src(jsPath + '/**/*.js')
    .pipe(gulp.dest(jsOutPath))
    .pipe(reload({
        stream: true
    }))
);

//服务器
gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: './build/',
            directory: true,
            index: ["index.html"],
            tunnel: true,
            online: false,
            middleware: mock.data()
        }
    });
    gulp.watch(htmlPath + '/**/*.pug', gulp.series('pug'));
    gulp.watch(cssPath + '/**/*.scss', gulp.series('scss'));
    gulp.watch(jsPath + '/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series(['pug', 'scss', 'js', 'server']));