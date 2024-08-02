//import-------------------------> Necesario Execution Node
//var>---------------------------$ Node Execution Globals
const file = require("./resources/file"),
	db = require("./daemon/db"),
	encrypt = require("./resources/encrypt"),
	access = require("./resources/access"),
	window = require("./resources/window"),
	udp = require("./daemon/udp");

window
	.build({})
	.then(() => {
		access.build({
			req_file: file,
			req_encrypt: encrypt,
			req_win: window.utilities,
		});
		file.build({
			req_win: window.utilities,
		});
		db.build({
			req_win: window.utilities,
		});
		udp.build({
			req_win: window.utilities,
		});

		access.callFromGUI();
		file.callFromGUI();
		db.callFromGUI();
		udp.callFromGUI();

		window.load();
	})
	.catch((e) => {
		console.log(e);
	});
