console.log('Hi')

function browserSync(done) {
    browser.init({
        server: {
            baseDir: "./build"
        },
        port: 4000
    });
    done(); // calback функція яка запуститься якщо все буде ок 
}

function browserSyncReload(done){
    browser.reload();
    done()
}

const paths = {
    styles: {
        src: 'app/styles/**/*.scss', // шукає сорси з папки стайлз, або з підпапки
        dest: 'build/css' // куда скомпілює destination
    },
    js: {
        src: 'app/js/**/*.js',
        dest: 'build/js'
    },
    images: {
        src: 'app/images/*.*',
        dest: 'build/images'
    },
    html: {
        src: 'app/**/*.html',
        dest: 'build/'
    }
}

function styles(){
    return gulp.src(paths.styles.src) // галп має брати сорси
        .pipe(sass()) // це метод галпа, який дозволяє запускати якісь модулі
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min' // добавляє після main.
        }))
        .pipe(gulp.dest(paths.styles.dest)) // кидає ту всю біду в папку по дестінейшин
        .pipe(browser.stream()) // останній пайп який дозволяє слідкувати за змінами
}

function html(){
    return gulp.src(patch.html.src)
        .pipe(gulp.dest(patch.html.dest)) // html не зжимається
        .pipe(browser.stream())
}

function watch(){
    gulp.watch(paths.styles.src, styles) // перший параментр, це є шлях за якими файлами слідкує, другий це ф-я яка обробляє ці файли
    gulp.watch(paths.html.src, html)
    gulp.watch('./app/index.html', gulp.series(browserSyncReload)) // вказуємо наш серверний файлик
    // є галп 3, зараз 4.В 3 працювало послідовно Зараз все працює асихронно, тим самим код компілюється швидше
    // є така штука як series, parallel ; послідовний і паралельний

}

const build = gulp.parallel(styles,html);

gulp.task('build', build)

gulp.task('default', gulp.parallel(watch, build ,browserSync))