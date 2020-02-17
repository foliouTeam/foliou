// import Files from '../lib/files';
import { runSh } from "./lib/util";
const chalk = require("chalk");
function main() {
    runSh("npm run build", function (event, data) {
        if (event == "close") {
            console.log(chalk.bgGreen("[BUILD]: 退出"));
        } else {
            console.log(chalk.bgGreen("[BUILD]:") + data);
        }
    });
    runSh("npm run dev", './demos', function (event, data) {
        if (event == "close") {
            console.log(chalk.bgCyan("[DEMOS]: 退出"));
        } else {
            console.log(chalk.bgCyan("[DEMOS]:") + data);
        }
    });
}
main();