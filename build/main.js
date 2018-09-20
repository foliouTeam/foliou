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
        this.assetsType = ['css','scss','html','json','gif','png','jpg','jpeg','svg']
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
                                var tempfileData = '';
                                console.log(filelist);
                                var extname;
                                var relname;
                                for(var fileIndex in filelist){
                                    extname = path.extname(filelist[fileIndex]).replace('.','');
                                    
                                    relname = path.relative(element + '/assets/',filelist[fileIndex]);
                                    if(relname!='rullup_temp.js'&& _self.assetsType.indexOf(extname)>-1){
                                        //tempfileData+='Assets["'+relname+'"]= require("./'+path.relative(element + '/assets/',filelist[fileIndex]) +'");\nconsole.log(Assets["'+relname+'"])\n'                                     
                                        tempfileData+='import '+relname.replace('.','_')+' from "./'+relname+'";\nconsole.log('+relname.replace('.','_')+');\n';
                                    }
                                }
                                tempfileData+='';
                                console.log(tempfileData);
                                try {
                                    fs.writeFile(element + '/assets/rullup_temp.js', tempfileData, function (err) {
                                        if (!!err) {
                                            console.log(err);
                                        }
                                        else {
                                            console.log('写入' + element + '/assets/rullup_temp.js');
                                            _self.build(element + '/assets/rullup_temp.js',element + '/assets/index.js');
                                        }
                                    })
                                } catch (error) {
                                    console.log(error);
                                }
                            }).catch(function(err){
                                console.log(err);
                            })
                        }
                    }
                });
            });
        });
    }
    async build(input,output) {
        const bundle = await rollup.rollup({
            input: input,
            plugins: [
                postimage(),
                json(),
                postcss(),
                posthtml()
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
//             postimage(),
//             json(),
//             postcss(),
//             posthtml()
//         ]
//     });
//     var outputOptions = {
//         file: 'dist/' + input,
//         format: 'cjs'
//     };
//     console.log(bundle.imports); // an array of external dependencies
//     console.log(bundle.exports); // an array of names exported by the entry point
//     console.log(bundle.modules); // an array of module objects
//     const {
//         code,
//         map
//     } = await bundle.generate(outputOptions);

//     // or write the bundle to disk
//     await bundle.write(outputOptions);
// }

// build('./packages/foliou/css3animate/assets/index.js');