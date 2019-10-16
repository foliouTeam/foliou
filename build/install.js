var Util = require("./lib/util");
var runSh = Util.runSh;
const chalk = require("chalk");
function main() {
    runSh("yarn install", function (event, data) {
        if (event == "close") {
            console.log(chalk.bgRed("[BUILD]: 退出"));
        } else {
            console.log(chalk.bgRed("[BUILD]:") + data);
        }
    });
    runSh("yarn install", "./demos", function (event, data) {
        if (event == "close") {
            console.log(chalk.bgCyan("[DEMOS]: 退出"));
        } else {
            console.log(chalk.bgCyan("[DEMOS]:") + data);
        }
    });
}
main();
