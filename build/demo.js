import Files from './files';

async function main(){
    await Files.getFiles('../packages');
} 
main();