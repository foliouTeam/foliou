// import Files from '../lib/files';
import { runSh } from "./lib/util";
const chalk = require("chalk");
function main() {
    runSh("npm run build", function(event, data) {
        if (event == "close") {
            console.log(chalk.bgRed("[BUILD]: 退出"));
        } else {
            console.log(chalk.bgRed("[BUILD]:")+data);
        }
    });
    runSh("cd ./demos && gulp", function(event, data) {
        if (event == "close") {
            console.log(chalk.bgCyan("[DEMOS]: 退出"));
        } else {
            console.log(chalk.bgCyan("[DEMOS]:")+data);
        }
    });
}
main();