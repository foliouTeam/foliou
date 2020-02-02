var fs = require("fs-extra");
fs.watch("./", {
    
}, function (eventType, filename) {
    console.log(eventType, filename);
})