//import-------------------------> Necesario Execution Node
//var>---------------------------$ Node Execution Globals
const file = require("./resources/file"),
	db = require("./daemon/db"),
	encrypt = require("./resources/encrypt"),
	access = require("./resources/access"),
	window = require("./resources/window");

window
	.build({})
	.then(() => {
		access.build({
			fnc_on: window.on,
			fnc_send: window.send,
			req_file: file,
			req_encrypt: encrypt,
			req_log: window.log,
		});
		file.build({
			fnc_on: window.on,
			fnc_send: window.send,
			req_log: window.log,
		});
		db.build({ fnc_on: window.on, fnc_send: window.send });

		access.callFromGUI();
		file.callFromGUI();
		db.callFromGUI();

		window.load();
	})
	.catch((e) => {
		console.log(e);
	});
