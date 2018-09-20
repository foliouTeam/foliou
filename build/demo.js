import Files from './files';

function main(){
    Files.getFiles('../packages').then(function(files){
        console.log(files);
    });
} 
main();