var CONFIG = {
    src: "./src",
    output: "./_dist"
};
var gulp = require("gulp"),
    gulpif = require("gulp-if"),
    es3ify = require("gulp-es3ify");
var path = require("path");
var through = require("through2");
//设置打包缓存
var runSequence = require("run-sequence");
var browserify = require("browserify");
var proxyMiddleware = require("http-proxy-middleware");
var source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var sass = require("gulp-sass"), //压缩css
    cssmin = require("gulp-clean-css"),
    //修改css url
    autoprefixer = require("gulp-autoprefixer"),
    glob = require("glob"),
    es = require("event-stream");
///合并任务
var merge = require("merge-stream");
//获取命令参数
var argv = require("yargs").argv;
//清除
var clean = require("gulp-clean");
var spritesmith = require("gulp.spritesmith");
//可以多级目录

var evr = !!argv.p;
// console.log(argv);
const src = CONFIG.src; //当前路径下的文件夹名
const outpath = CONFIG.output;

var ztGulp = {
    tasks: {
        htmlmin: function() {
            var filen = "";
            return gulp
                .src(src + "/**/*.{html,shtml}")
                .pipe(
                    through.obj(function(file, enc, cb) {
                        filen = file.relative.split(path.sep);
                        filen.pop();
                        filen = "/" + filen.join("/");
                        cb(null, file);
                    })
                )
                .pipe(gulp.dest(outpath + filen))
                .pipe(
                    reload({
                        stream: true
                    })
                );
        },
        modulepack: function(done) {
            glob(src + "/**/main.js", function(err, files) {
                if (err) done(err);
                var tasks = files.map(function(entry) {
                    //console.log(outpath+entry.replace(src,'').replace('main.js',''));
                    var curout = outpath + entry.replace(src, "").replace("main.js", "");
                    return browserify({
                        entries: [entry]
                    })
                        .bundle()
                        .pipe(source("all.js"))
                        .pipe(buffer()) //将vinyl对象内容中的Stream转换为Buffer
                        .pipe(es3ify())
                        .pipe(gulp.dest(curout))
                        .pipe(
                            reload({
                                stream: true
                            })
                        );
                });
                es.merge(tasks).on("end", done);
            });
        },
        buildcss: function() {
            let filen = "",
                isless = false;
            //排除文件,排除lib，modules，node_modules,貌似暂时无效啊
            return (
                gulp
                    .src(src + "/!(lib|modules|node_modules)/**/*.{css,scss,sass,less}")
                    .pipe(
                        through.obj(function(file, enc, cb) {
                            isless = false;
                            let type = path.extname(file.relative);
                            //是单纯的css也经过sass处理
                            if (type == ".less") isless = true;

                            filen = file.relative.split(path.sep);
                            filen.pop();
                            filen = "/" + filen.join("/");
                            cb(null, file);
                        })
                    )
                    .pipe(sass())
                    //.pipe( gulpif(issass, sass().on('error', sass.logError)) )
                    //.pipe( gulpif(isless, less()) )
                    .pipe(
                        autoprefixer({
                            browsers: ["last 2 versions", "Android >= 4.0"],
                            cascade: true
                        })
                    )
                    .pipe(gulp.dest(outpath + filen))
                    .pipe(
                        reload({
                            stream: true
                        })
                    )
            );
        },
        imagemin: function() {
            var filen = "";
            return gulp
                .src([src + "/!(lib|modules|node_modules)/**/*.{png,jpg,gif,ico,svg}"])
                .pipe(
                    through.obj(function(file, enc, cb) {
                        filen = file.relative.split(path.sep);
                        filen.pop();
                        filen = "/" + filen.join("/");
                        cb(null, file);
                    })
                )
                .pipe(gulp.dest(outpath + filen))
                .pipe(
                    reload({
                        stream: true
                    })
                );
        },
        copy: function() {
            var filen = "";
            /////拷贝当前目录下的
            //let task1 = gulp.src(src + "/*.!(html|shtml)").pipe(gulp.dest(outpath));
            ///二级目录以上的
            let task2 = gulp
                .src(src + "/**/!(lib|modules|node_modules|js|css|images|icons|api)/*.*")
                .pipe(
                    through.obj(function(file, enc, cb) {
                        filen = file.relative.split(path.sep);
                        filen.pop();
                        filen = "/" + filen.join("/");
                        cb(null, file);
                    })
                )
                .pipe(gulp.dest(outpath + filen));

            return merge([task2]);
        },
        clean: function() {
            return gulp
                .src(outpath, {
                    read: false
                })
                .pipe(clean());
            //清空目录
        },
        clear: function(done) {
            //return cache.clearAll(done);
        },
        server: function() {
            //port = parseInt(9999 * Math.random());
            var proxyTargetKey = "api.php"; //默认为数组，参数为空则不使用
            var proxyTarget = "http://act.balls.web.ztgame.com/bgf2018/"; //使用代理
            // 代理配置, 实现环境切换
            var middleware = proxyMiddleware(proxyTargetKey, {
                target: proxyTarget,
                changeOrigin: true
            });
            browserSync.init({
                server: {
                    baseDir: outpath,
                    index: "index.html",
                    middleware: middleware
                }
            });
        }
    },

    watch: function() {
        //监听排除文件夹外的第一级目录，和二级以上的文件
        gulp.watch([src + "/!(lib|modules|node_modules|js|css|images)/**"], ["copy"]);
        //只监听html文件
        gulp.watch(src + "/**/*.{html,shtml}", ["htmlmin"]);
        //监听二级目录下的样式文件,一级以上只执行copy
        gulp.watch(src + "/!(lib|modules|node_modules)/**/*.{css,scss,sass,less}", ["buildcss"]);
        //监听二级目录下的js文件,执行打包（只会打包成一个文件）。一级以上只执行copy
        gulp.watch(src + "/!(lib|modules|node_modules)/**/*.{js,ts}", ["modulepack"]);
        //监听二级目录下的img文件,执行优化。一级以上只执行copy
        gulp.watch(src + "/!(lib|modules|node_modules)/**/*.{png,jpg,gif,ico,svg}", ["imagemin"]);
    },
    setTasks: function() {
        for (var i in this.tasks) {
            gulp.task(i, this.tasks[i].bind(this));
        }
        gulp.task("compile", ["modulepack", "buildcss"]);
        //开发构建
        gulp.task("dev", function(done) {
            condition = false;
            runSequence(["clean"], ["copy"], ["compile"], ["htmlmin"], ["imagemin"], ["server"], done);
        });
        gulp.task("default", ["dev"]); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务
    },
    init: function() {
        this.setTasks();
        this.watch();
    }
};
ztGulp.init();
