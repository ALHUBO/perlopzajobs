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
global.window = require("./resources/window");
global.config = require("./resources/config");
global.file = require("./resources/file");
global.encrypt = require("./resources/encrypt");
global.access = require("./resources/access");
global.udp = require("./daemon/udp");
global.db = require("./daemon/db");

global.window
	.build({})
	.then(() => {
		global.config.listeners();
		global.file.listeners();
		global.access.listeners();

		// access.callFromGUI();
		// udp.callFromGUI();
		// db.callFromGUI();

		global.window.load();
	})
	.catch((e) => {
		console.log("No fue posible construir el programa.");
		console.log(e);
	});
