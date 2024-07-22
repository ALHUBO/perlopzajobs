//import-------------------------> Necesario Execution Node
//var>---------------------------$ Node Execution Globals
global.db = require("./daemon/db");
global.path = require("node:path");

const window = require("./resources/window");

window
	.build({})
	.then(() => {
		global.db.callFromGUI({ o: window.on, s: window.send });
	})
	.catch((e) => {
		console.log(e);
	});
