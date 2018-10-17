import Files from '../lib/files';

function main(){
    Files.getFiles('../packages').then(function(files){
        console.log(files);
    });
} 
main();