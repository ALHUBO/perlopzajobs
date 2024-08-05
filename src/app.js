/**
 * !--------------------------------------------------------------------------------------------
 * !					Applicación
 * var					ALHUBOSoft
 * import				Inicialización del programa.
 * $					Autor: ALHUBO [Alejandro Huerta Bolaños]
 * %					V1.0 [ ２０２４年4月5日 - ]
 * ?					https://github.com/ALHUBO/ALHUBOSoft
 * !--------------------------------------------------------------------------------------------
 * **/

//import-------------------------> Necesario Execution Node
//var>---------------------------$ Node Execution Globals
const window = require("./resources/window"),
	file = require("./resources/file"),
	encrypt = require("./resources/encrypt"),
	access = require("./resources/access"),
	udp = require("./daemon/udp"),
	db = require("./daemon/db");

window
	.build({})
	.then(() => {
		file.build({
			req_win: window.utilities,
		});
		access.build({
			req_file: file.utilities,
			req_encrypt: encrypt,
			req_win: window.utilities,
		});
		udp.build({
			req_win: window.utilities,
		});
		db.build({
			req_win: window.utilities,
		});

		file.callFromGUI();
		access.callFromGUI();
		udp.callFromGUI();
		db.callFromGUI();

		window.load();
	})
	.catch((e) => {
		console.log(e);
	});
