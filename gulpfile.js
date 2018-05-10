/*
* Variables necesarias
* */

/*
* npm install --save-dev gulp gulp-sass gulp-pug pump browser-sync gulp-concat gulp-uglify gulp-cssnano gulp-imagemin gulp-autoprefixer gulp-sourcemaps gulp-javascript-obfuscator
*/
var gulp                 = require('gulp'),
    sass                 = require('gulp-sass'),
    pug                  = require('gulp-pug'),
    pump                 = require('pump'),
    browserSync          = require('browser-sync').create(),
    concat               = require('gulp-concat'),
    uglify               = require('gulp-uglify'),
    cssnano              = require('gulp-cssnano'),
    imagemin             = require('gulp-imagemin'),
    autoprefixer         = require('gulp-autoprefixer'),
    sourcemaps           = require('gulp-sourcemaps'),
    javascriptObfuscator = require('gulp-javascript-obfuscator'),
    babel                = require('gulp-babel');

var javascript = [
    'node_modules/jquery/dist/jquery.js',
    // 'node_modules/lodash/lodash.js',
    // 'node_modules/owl.carousel/dist/owl.carousel.min.js',
    // 'node_modules/pug/lib/index.js',
    // 'node_modules/jquery-validation/dist/jquery.validate.js',
    // 'node_modules/gsap/src/uncompressed/TweenMax.js',
    // 'node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
    // 'node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
    //'node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.velocity.js',
    // 'node_modules/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js',
    // 'node_modules/imagesloaded/imagesloaded.pkgd.min.js',
    // 'node_modules/materialize-css/js/initial.js',
    // 'node_modules/materialize-css/js/jquery.easing.1.4.js',
    // 'node_modules/materialize-css/js/animation.js',
    // 'node_modules/materialize-css/js/velocity.min.js',
    // 'node_modules/materialize-css/js/hammer.min.js',
    // 'node_modules/materialize-css/js/jquery.hammer.js',
    // 'node_modules/materialize-css/js/global.js',
    // 'node_modules/materialize-css/js/sideNav.js',
    // 'node_modules/materialize-css/js/scrollspy.js',
    // 'node_modules/materialize-css/js/buttons.js',
    // 'node_modules/materialize-css/js/dropdown.js',
    // 'node_modules/materialize-css/js/forms.js',
    // 'node_modules/materialize-css/js/waves.js',
    // 'node_modules/materialize-css/js/tabs.js',
    //'node_modules/materialize-css/js/carousel.js',
    // 'resources/js/markerclusterer.js',
    // 'resources/js/video.js',
    // 'resources/js/fallings.js',
    'resources/js/functions.js'
];
/*
* Tareas generales
* */

//Optimiza las imagenes
gulp.task('optimizarimagenes', function () {
    gulp.src('resources/images/**/*')
        .pipe(imagemin({
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
});

//Copia las fuentes a la carpeta fonts
gulp.task('fuentes', function() {
    return gulp.src('resources/fonts/**/*')
        .pipe(gulp.dest('dist/css/fonts'))
});

//Mensajes de errores
function manejoErrores (error) {
    console.log('\x1b[31m%s\x1b[0m', '-------------');
    console.log('\x1b[45m%s\x1b[0m', ' Error');
    console.log(error.toString());
    console.log('\x1b[31m%s\x1b[0m', '-------------');
    this.emit('end')
}

/*
* Servidor de desarrollo
* */
//Creamos el servidor que contrala las demas tareas
gulp.task('serve', ['pug-desarrollo','sass-desarrollo', 'javascript-desarrollo', 'fuentes', 'optimizarimagenes'], function() {
    browserSync.init({
        server: {
            baseDir : "./dist",
            serveStaticOptions: {
                extensions: ["html"]
            }
        }
    });

    gulp.watch("resources/js/**/*.js",        ['javascript-desarrollo']);
    gulp.watch("dist/js/**/*.js").on('change', browserSync.reload);


    
    gulp.watch("resources/scss/**/*.scss",    ['sass-desarrollo']);
    gulp.watch("resources/images/**/*",       ['optimizarimagenes']);
    gulp.watch("resources/fonts/**/*",        ['fuentes']);
    gulp.watch("resources/**/*.pug",          ['pug-desarrollo']);
    gulp.watch("dist/**/*.html").on('change', browserSync.reload);
});

//Compilacion de css
gulp.task('sass-desarrollo', function() {
    return gulp.src([
        "resources/scss/*.scss"
    ])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', manejoErrores))
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});
//Compilacion de Java Script
gulp.task('javascript-desarrollo', (cb) => {
    pump([
            gulp.src(javascript),
            babel({
                plugins: [
                    'transform-es2015-arrow-functions',
                    'transform-es2015-block-scoping',
                    'transform-es2015-classes',
                    'transform-es2015-template-literals',
                    'transform-es2015-object-super'
                ]
            }),
            concat('scripts.js'),
            uglify({
                compress: false,
                mangle: false,
                output: {
                    beautify: true
                }
            }),
            gulp.dest('dist/js')
        ],
        cb
    );
});
//Compilacion de html
gulp.task('pug-desarrollo', function buildHTML() {
    return gulp.src('resources/pug/*.pug')
        .pipe(pug({
            pretty : true
        }))
        .on('error', manejoErrores)
        .pipe(gulp.dest('dist'));
});


/*
* Servidor de desarrollo
* */
//Creamos el servidor que contrala las demas tareas
gulp.task('serve-produccion', ['pug-produccion','sass-produccion', 'javascript-produccion', 'fuentes', 'optimizarimagenes'], function() {
    browserSync.init({
        server: {
            baseDir : "./dist",
            serveStaticOptions: {
                extensions: ["html"]
            }
        }
    });

    gulp.watch("resources/assets/js/**/*.js",        ['javascript-produccion']).on('change', browserSync.reload);
    gulp.watch("resources/assets/scss/**/*.scss",    ['sass-produccion']);
    gulp.watch("resources/assets/images/**/*",       ['optimizarimagenes']);
    gulp.watch("resources/assets/**/*.pug",          ['pug-desarrollo']);
    gulp.watch("dist/**/*.html").on('change', browserSync.reload);
});

//Compilacion de css para produccion
gulp.task('sass-produccion', function() {
    return gulp.src([
        "resources/assets/scss/*.scss"
    ])
        .pipe(sass().on('error', manejoErrores))
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: true
        }))
        .pipe(cssnano())
        .pipe(gulp.dest("public/css"))
        .pipe(browserSync.stream());
});


//Compilacion de html
gulp.task('pug-produccion', function buildHTML() {
    return gulp.src('resources/assets/pug/internas/*.pug')
        .pipe(pug({
            pretty : true
        }))
        .on('error', manejoErrores)
        .pipe(gulp.dest('dist'));
});

//Compilacion de javascript para produccion

gulp.task('javascript-desarrollo', (cb) => {
    pump([
            gulp.src(javascript),
            babel({
                plugins: [
                    'transform-es2015-arrow-functions',
                    'transform-es2015-block-scoping',
                    'transform-es2015-classes',
                    'transform-es2015-template-literals',
                    'transform-es2015-object-super'
                ]
            }),
            concat('scripts.js'),
            uglify({
                compress: true,
                mangle: false,
                output: {
                    beautify: false
                }
            }),
            gulp.dest('dist/js')
        ],
        cb
    );
});

gulp.task('default', ['serve']);
gulp.task('produccion', ['serve-produccion']);