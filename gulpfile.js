const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist" //загрузка сервера из папки
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload); //при изменении файлов из рабочей папки src будет reload лайв сервера
});

gulp.task('styles', function() { //в функции ниже выполняется цепочка действий
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css")) //готовый скомпилированный файл кладем в чистовую папку dist
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html')); //когда изменяется src/.html - запускается команда html, описанная ниже
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel('scripts')); //при изменении скриптов в рабочей папке src, заменяем измененные файлы в папку dist тк лайв сервер идет из нее
});

gulp.task('html', function() {
    return gulp.src("src/*.html") //берем все файлы из папки src с расширением html
        .pipe(htmlmin({ collapseWhitespace: true})) //сжимаем удаляя пробелы
        .pipe(gulp.dest("dist/")) //возвращаем сжатый файл уже в чистовую папку
});



//Копируем и переносим файлы из src в dist
gulp.task('scripts', function() {
    return gulp.src("src/js/**/*.js") //берем все файлы из папки src/js/любая папка/ с расширением js
        .pipe(gulp.dest("dist/js")) //скопируем(перенесем) файлы в чистовой каталог
});

gulp.task('fonts', function() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"))
});

gulp.task('images', function() {
    return gulp.src("src/img/**/*")
        .pipe(imagemin()) //сжимаем картиники с помощью команды пакета gulp-imagemin
        .pipe(gulp.dest("dist/img"))
});



gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'html', 'scripts', 'fonts', 'images'));