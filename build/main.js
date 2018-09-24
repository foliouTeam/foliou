var rollup = require('rollup');
var json = require('rollup-plugin-json');
var postcss = require('rollup-plugin-postcss');
var postimage = require('@timdp/rollup-plugin-image');
var posthtml = require('rollup-plugin-posthtml-template');
var fs = require('fs');
var path = require('path');
import Files from './files';
class Build {
    constructor() {
        this.packageDir = "packages";
        this.assetsType = ['css', 'scss', 'html', 'json', 'gif', 'png', 'jpg', 'jpeg', 'svg']
    }
    async getAssets() {
        var _self = this;
        Files.getDirs(path.resolve(__dirname, '../packages/'), function (dirs) {
            dirs.forEach((element, i) => {
                fs.stat(element + '/assets/', function (err, st) {
                    if (!err) {
                        if (st.isDirectory()) {
                            console.log(element + '有资源');
                            Files.getFiles(element + '/assets/').then(function (filelist) {
                                var tempfileData = 'var assets = {};\n';
                                console.log(filelist);
                                var extname;
                                var relname;
                                for (var fileIndex in filelist) {
                                    extname = path.extname(filelist[fileIndex]).replace('.', '');

                                    relname = path.relative(element + '/assets/', filelist[fileIndex]);
                                    if (relname != 'rullup_temp.js' && _self.assetsType.indexOf(extname) > -1) {
                                        //tempfileData+='Assets["'+relname+'"]= require("./'+path.relative(element + '/assets/',filelist[fileIndex]) +'");\nconsole.log(Assets["'+relname+'"])\n'                                     
                                        tempfileData += 'import ' + relname.replace('.', '_').replace('\\', '_') + ' from "../' + relname.replace('\\','/') + '";\nassets["' + relname.replace('\\','/') + '"]=' + relname.replace('.', '_').replace('\\', '_') + ';\n';
                                    }
                                }
                                tempfileData += 'export default assets;';
                                //console.log(tempfileData);
                                try {
                                    Files.exists(null, path.resolve(element,'./assets/.temp/'), function (src,dtc) {
                                        var tempfile = path.resolve(element, './assets/.temp/rullup_temp.js');
                                        var outputfile = path.resolve(element, './assets/index.js');
                                        fs.writeFile(tempfile, tempfileData, function (err) {
                                            if (!!err) {
                                                console.log(err);
                                            } else {
                                                console.log('写入' + tempfile);
                                                _self.build(tempfile, outputfile);
                                            }
                                        })
                                    });

                                } catch (error) {
                                    console.log(error);
                                }
                            }).catch(function (err) {
                                console.log(err);
                            })
                        }
                    }
                });
            });
        });
    }
    async build(input, output) {
        console.log(input);
        console.log(output);
        //return;
        console.log('../**/*.{html,sgr}');
        const bundle = await rollup.rollup({
            input: input,
            plugins: [
                postimage(),
                json(),
                postcss(),
                posthtml({
                    include: '../**/*.{html,sgr}'
                })
            ]
        });
        var outputOptions = {
            file: output,
            format: 'cjs'
        };
        const {
            code,
            map
        } = await bundle.generate(outputOptions);
        // or write the bundle to disk
        await bundle.write(outputOptions);
    }
}
var build = new Build();
build.getAssets();
// async function build(input) {
//     const bundle = await rollup.rollup({
//         input: input,
//         plugins: [
//             posthtml({
//                 include:'../assets/**/*.{html,sgr}'
//             })
//         ]
//     });
//     //console.log(bundle);
//     var outputOptions = {
//         file: '../assets/bundle_api.js',
//         format: 'cjs'
//     };

//     bundle.generate(outputOptions);

//     // or write the bundle to disk
//     await bundle.write(outputOptions);
// }

// build(path.resolve(__dirname,'../assets/assets.js'));