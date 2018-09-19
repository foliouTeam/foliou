var rollup = require('rollup');
var json = require('rollup-plugin-json');
var postcss = require('rollup-plugin-postcss');
var postimage = require('@timdp/rollup-plugin-image');
var posthtml = require('rollup-plugin-posthtml-template');
var fs = require('fs');
var path = require('path');
var Files = require('files');
class Build {
    constructor() {
        this.packageDir = "packages"
    }
    async getAssets(){
        
    }
    async build() {
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
            file: 'dist/' + input,
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

async function build(input) {
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
        file: 'dist/' + input,
        format: 'cjs'
    };
    console.log(bundle.imports); // an array of external dependencies
    console.log(bundle.exports); // an array of names exported by the entry point
    console.log(bundle.modules); // an array of module objects
    const {
        code,
        map
    } = await bundle.generate(outputOptions);

    // or write the bundle to disk
    await bundle.write(outputOptions);
}

build('./packages/foliou/css3animate/assets/index.js');