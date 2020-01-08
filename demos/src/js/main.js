var pathname = window.location.pathname.replace("/", "").replace(".html", "");
switch (pathname) {
	case "bgm":
		require("./bgm");
	case "animate":
		require("./animate");
	case "player":
		require("./player");
	case "popup":
		require("./popup");
	case "visualizer":
		require("./visualizer");
	case "swiper":
		require("./swiper");
}
// var gLogin = require("../../../packages/foliou/login");
// var login = new gLogin({ type: "popup" });
