//import-------------------------> Necesario Execution Node
//var>---------------------------$ Node Execution Globals
global.db = require("./daemon/db");
global.path = require("node:path");
global.file = require("./resources/file");
global.encrypt = require("./resources/encrypt");

const window = require("./resources/window");

window
	.build({})
	.then(() => {
		global.db.callFromGUI({ o: window.on, s: window.send });
		global.file.callFromGUI({ o: window.on, s: window.send });
	})
	.catch((e) => {
		console.log(e);
	});
