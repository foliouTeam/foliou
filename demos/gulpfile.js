var myPack = require('../packages/fpack');
const gulp = require('gulp');
// gulp.task('default', function(){
//     return gulp.src('./src/*.*')
// });
myPack({
    gulp:gulp,
    rootDir:'',
});