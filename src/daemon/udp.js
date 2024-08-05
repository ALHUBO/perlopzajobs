/**
 * !--------------------------------------------------------------------------------------------
 * !					Servidor UDP
 * var					Complemento para ALHUBOSoft
 * import				Sirve para que el servidor pueda recibir peticiones de conexión
 * import				de clientes potenciales.
 * $					Autor: ALHUBO [Alejandro Huerta Bolaños]
 * %					V1.0 [ ２０２４年4月5日 - ]
 * ?					https://github.com/ALHUBO/ALHUBOSoft
 * !--------------------------------------------------------------------------------------------
 * **/

//import-----------------------------------------------------------------------------> Necesario
const dgram = require("dgram");

//var>--------------------------------------------------------------------$ Globales del udp.js
var builded = false, //?---Se contruyo el daemon?
	server = null, //?---Object server
	win = null; //?---Utilities window.js

//?----------------------------------------------------------------------------------Constructor
const build = ({ req_win = null }) => {
	win = req_win;
	builded = true;
};
const isBuild = () => {
	if (!builded) console.log("No se ha construido el daemon [udp.js].");
	return builded;
};

const isRun = (_val, _txt) => {
	wind.send("udp-active", server !== null);
	if (server !== null) {
		if (_val)
			win.log.warning({
				icon: "hearing",
				title: "UDP server",
				content: _txt,
			});
		return true;
	}
	if (!_val)
		win.log.warning({
			icon: "hearing",
			title: "UDP server",
			content: _txt,
		});
	return false;
};

//!___________________________________________________________________________Funciones internas

//%---------------------------------[Inicia el daemon]
const start = ({
	fnc_receives = (message, rinfo) => {
		console.log(`Recibio un mensaje UDP: ${message}`);
		return;
	},
	fnc_listen = () => {
		console.log("Servidor UDP escuchando.");
		return;
	},
	fnc_error = (error) => {
		console.log(`Ocurrio un error con el servidor UDP: ${error}`);
		return;
	},
	fnc_close = () => {
		console.log("El servidor UDP se ha cerrado.");
		return;
	},
}) => {
	if (!isBuild()) return;
	if (isRun(true, "El servidor ya se está ejecutando.")) return;

	server = dgram.createSocket("udp4");

	server.on("message", function (message, rinfo) {
		fnc_receives(message, rinfo);
		responseToClient(message);
	});

	server.on("listening", function () {
		fnc_listen();
	});

	server.on("error", function (error) {
		fnc_error(error);
		server = null;
		return;
	});

	server.on("close", function () {
		fnc_close();
		server = null;
		return;
	});
	let port = win.config.get("udp").data.port.E;
	server.bind(port);
};

//%------------------------[Termina ejecucion del servidor]
const close = ({
	fnc_error = (error) => {
		console.log(`No fue posible detener el servidor UDP: ${error}`);
	},
}) => {
	if (!isBuild()) return;
	if (!isRun(false, "El servidor no se está ejecutando.")) return;

	try {
		server.close();
	} catch (e) {
		server = null;
		fnc_error(e);
	}
};

//%--------------------------------[Envia respuesta al cliente]
const responseToClient = (request) => {
	if (!isBuild()) return;
	if (!isRun(false, "El servidor no se está ejecutando.")) return;

	try {
		let sms = JSON.parse(atob(request));
		if (!sms.want) {
			win.log.error({
				icon: "hearing",
				title: "UDP server",
				content:
					"No se recibio correctamente el mensaje del cliente potencial.",
				advanced: e,
			});
			return;
		}
	} catch (e) {
		win.log.error({
			icon: "hearing",
			title: "UDP server",
			content:
				"No se recibio correctamente el mensaje del cliente potencial.",
			advanced: e,
		});
		return;
	}
	const serverUDP = dgram.createSocket("udp4");

	const serverInfo = {
		ip: win.config.get("ip"),
		port: win.config.get("udp").data.port.E,
	};
	const message = JSON.stringify(serverInfo);

	serverUDP.bind(() => {
		serverUDP.setBroadcast(true);

		serverUDP.send(
			message,
			0,
			message.length,
			win.config.get("udp").data.port.S,
			"255.255.255.255",
			(err) => {
				if (err)
					win.log.error({
						icon: "hearing",
						title: "UDP server",
						content:
							"Ocurrio un error al intentar enviar el mensaje.",
						advanced: err,
					});
				else
					win.log.info({
						icon: "hearing",
						title: "UDP server",
						content: "Mensaje de anuncio enviado con éxito.",
						advanced: `IP: ${serverInfo.ip} Puerto: ${serverInfo.port}`,
					});
				serverUDP.close();
			}
		);
	});
};

//$--------------------------------------------------------------------------Funciones expuestas
const get = () => {
	win.send("udp-get", win.config.get("udp"));
};

const active = (action) => {
	if (action)
		start({
			fnc_receives: (message, rinfo) => {
				win.log.info({
					icon: "hearing",
					title: "UDP server",
					content:
						"Se recibió un mensaje de un cliente potencial. Iniciando respuesta...",
					advanced: `${message}`,
				});
			},
			fnc_listen: () => {
				win.log.success({
					icon: "hearing",
					title: "UDP server",
					content: "El servidor esta escuchando.",
					advanced: `${ip}:${port.E}`,
				});
				win.send("udp-active", true);
			},
			fnc_error: (e) => {
				win.log.error({
					icon: "hearing",
					title: "UDP server",
					content: "Ocurrio un error en el servidor.",
					advanced: e,
				});
				win.send("udp-active", false);
			},
			fnc_close: () => {
				win.log.warning({
					icon: "hearing",
					title: "UDP server",
					content: "El servidor se a detenido.",
					advanced: e,
				});
				win.send("udp-active", false);
			},
		});
	else
		close({
			fnc_error: (e) => {
				win.log.error({
					icon: "hearing",
					title: "UDP server",
					content: "Ocurrio un error al intentar cerrar el servicio.",
					advanced: e,
				});
				win.send("udp-active", false);
			},
		});
};

const save = ({ portE = 56789, portS = 56790, autoInit = false }) => {
	if (!isBuild()) return;
	if (
		isRun(
			true,
			"No es posible modificar el servidor UDP mientras se esta ejecutando."
		)
	)
		return;

	let objRT = {
		stablished: false,
		auto: typeof autoInit != "boolean" ? false : autoInit,
		data: {
			port: {
				E:
					isNaN(parseInt(portE)) ||
					parseInt(portE) < 0 ||
					parseInt(portE) > 65535 ||
					parseInt(portE) == parseInt(portS)
						? 56789
						: parseInt(portE),
				S:
					isNaN(parseInt(portS)) ||
					parseInt(portS) < 0 ||
					parseInt(portS) > 65535 ||
					parseInt(portE) == parseInt(portS)
						? 56790
						: parseInt(portS),
			},
		},
	};
	win.config.set("udp", { ...objRT });
	win.send("udp-save", { ...objRT });
};

//export------------------------------------------------> Funciones disponible hacia el exterior

const callFromGUI = () => {
	if (!isBuild()) return;

	win.on("udp-get", (e, data) => get());

	win.on("udp-active", (e, data) => active(data));

	win.on("udp-save", (e, data) => save(data));
};
module.exports = {
	build,
	callFromGUI,
};
