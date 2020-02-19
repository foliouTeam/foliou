var Utli = require("./gulpfile.js/libs/util");
const path = require("path");
var isentry = Utli.isEntrySync(path.resolve(__dirname,"./src/libs/require.js"));
console.log(isentry);