var pathname = window.location.pathname.replace("/", "").replace(".html", "");
console.log(pathname);
switch (pathname) {
	case "bgm":
		require("./bgm");
		break;
	case "animate":
		require("./animate");
		break;
	case "player":
		require("./player");
		break;
	case "popup":
		require("./popup");
		break;
	case "visualizer":
		require("./visualizer");
		break;
	case "swiper":
		require("./swiper");
		break;
	case "horizons":
		require("./horizons");
		break;
}
