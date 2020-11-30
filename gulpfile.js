var gulp = require("gulp"),
    concat = require("gulp-concat"), //合并js指令
    connect = require("gulp-connect"), //配置服务器实现热更新+自动刷新
    uglify = require("gulp-uglify"), //压缩js文件
    less = require("gulp-less"), //将less文件编译成css文件
    rename = require('gulp-rename'), //重命名
    htmlmin = require('gulp-htmlmin'), // html压缩
    imagemin = require('gulp-imagemin'), // 图片压缩
    minifyCSS = require('gulp-minify-css'), //对css文件进行压缩
    autoprefix = require('gulp-autoprefixer'), //自动添加兼容浏览器的前缀
    fileinclude = require('gulp-file-include'), //公共文件的引用
    livereload = require('gulp-livereload'); //监听文件变化刷新页面

gulp.task("iconfont", function () {
    gulp.src(["src/css/iconfont/**/*", ])
        .pipe(gulp.dest("dist/css/iconfont"));
});

gulp.task('fileinclude', function () {
    // 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
    gulp.src(['src/**/*.html', '!src/include/**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task("html", function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src("src/html/**/*.html")
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest("dist/html/"))
        .pipe(connect.reload());
});

gulp.task("index", function () {
    gulp.src("src/index.html")
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest("dist/"))
        .pipe(connect.reload());
});

gulp.task("mock", function () {
    gulp.src("src/mock/*")
        .pipe(gulp.dest("dist/mock"))
        .pipe(connect.reload());
});

gulp.task("imgs", function () {
    gulp.src("src/imgs/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/imgs/"))
        .pipe(connect.reload());
});

gulp.task("bundleLess", function () {
    gulp.src("src/css/**/*")
        .pipe(less())
        .pipe(autoprefix())
        .pipe(minifyCSS())
        // .pipe(rename({
        //     dirname: '' // 清空路径
        // }))
        .pipe(gulp.dest("dist/css/"))
        .pipe(connect.reload());
});
gulp.task("bundleJs", function () {
    gulp.src("src/js/**/*")
        .pipe(uglify())
        // .pipe(rename({
        //     dirname: '' // 清空路径
        // }))
        .pipe(gulp.dest("dist/js/"))
        .pipe(connect.reload());
});



gulp.task("watch", function () {
    gulp.watch("src/js/**/*", ["bundleJs"]);
    gulp.watch("src/imgs/**/*", ["imgs"]);
    gulp.watch("src/css/**/*", ["bundleLess"]);
    gulp.watch("src/html/*.html", ["html"]);
    gulp.watch("src/html/**/*.html", ["html"]);
    gulp.watch("src/mock/*", ["mock"]);
    gulp.watch("src/index.html", ["index"]);
});

gulp.task("server", function () {
    connect.server({
        root: "dist",
        port: 8010,
        livereload: true
    })
})

gulp.task("default", ["iconfont", "html", "imgs", "bundleJs", "bundleLess", "watch", "server", "mock", "index"]);