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
}