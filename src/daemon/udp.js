/*-----------------------------------------------------------------
|                       Servidor UDP discover server
-----------------------------------------------------------------*/
const dgram = require("dgram");

var builded = false, //?---Se contruyo el daemon?
	port = { E: 56789, S: 56790 }, //?---Puertos para Escuchar y Speaker
	auto = false, //?---Se inica automaticamente?
	server = null; //?---Obj del servidor

var log = null; //?---Funciones de window para enviar sms logs

var on = () => {
		//?---Recibe del dom
		return;
	},
	send = () => {
		//?---Envia al dom
		return;
	};

//%---------------------[Dependencias del daemon]-----------------------
const build = ({
	fnc_on = () => {
		return;
	},
	fnc_send = () => {
		return;
	},
	req_log = null,
}) => {
	on = fnc_on;
	send = fnc_send;
	log = req_log;
	builded = true;
};

//%----------------------[Guarda la nueva configuración]-------------------------------
const save = ({ portE = 56789, portS = 56790, autoInit = false }) => {
	if (
		isNaN(parseInt(portE)) ||
		parseInt(portE) < 0 ||
		parseInt(portE) > 65535
	)
		portE = 56789;
	if (
		isNaN(parseInt(portS)) ||
		parseInt(portS) < 0 ||
		parseInt(portS) > 65535
	)
		portS = 56790;
	if (parseInt(portE) == parseInt(portS)) {
		portE = 56789;
		portS = 56790;
	}
	if (typeof autoInit != "boolean") autoInit = false;

	port.E = parseInt(portE);
	port.S = parseInt(portS);
	auto = autoInit;
	return {
		portE: port.E,
		portS: port.S,
		auto,
	};
};

//%---------------------------[Devuelve la configuración del daemon]----------------------------------
const getConf = () => {
	return {
		stablished: false,
		auto: auto,
		portE: port.E,
		portS: port.S,
	};
};

//%---------------------------------[Inicia el daemon]----------------------------------------------
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
	if (!builded) {
		console.log("Aún no se ha construido el daemon.");
		return;
	}

	if (server !== null) {
		log.warning({
			icon: "hearing",
			title: "UDP server",
			content: "El servidor ya se está ejecutando.",
			advanced: e,
		});
		send("udp-active", true);
		return;
	}
	server = dgram.createSocket("udp4");

	server.on("message", function (message, rinfo) {
		fnc_receives(message, rinfo);
		ShowMe(message);
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

	server.bind(port.E);
};

//%---------------------------[Termina ejecucion del servidor]---------------------------------
const close = ({
	fnc_error = (error) => {
		console.log(`No fue posible detener el servidor UDP: ${error}`);
	},
}) => {
	if (!builded) {
		console.log("Aún no se ha construido el daemon.");
		return;
	}

	if (server === null) {
		log.warning({
			icon: "hearing",
			title: "UDP server",
			content: "El servidor no se está ejecutando.",
			advanced: e,
		});
		send("udp-active", false);
		return;
	}
	try {
		server.close();
	} catch (e) {
		server = null;
		fnc_error(e);
	}
};

//%--------------------------------[Envia respuesta al cliente]--------------------------------------------
const ShowMe = (message) => {
	if (!builded) {
		console.log("Aún no se ha construido el daemon.");
		return;
	}

	if (server === null) {
		log.warning({
			icon: "hearing",
			title: "UDP server",
			content: "El servidor no se está ejecutando.",
			advanced: e,
		});
		send("udp-active", true);
		return;
	}
	try {
		let sms = JSON.parse(atob(message));
		if (!sms.want) {
			log.error({
				icon: "hearing",
				title: "UDP server",
				content:
					"No se recibio correctamente el mensaje del cliente potencial.",
				advanced: e,
			});
			return;
		}
	} catch (e) {
		log.error({
			icon: "hearing",
			title: "UDP server",
			content:
				"No se recibio correctamente el mensaje del cliente potencial.",
			advanced: e,
		});
		return;
	}
	const serverUDP = dgram.createSocket("udp4");

	// Crear un mensaje para anunciar la sala
	const serverInfo = {
		ip: "",
		port: "",
	};
	const message = JSON.stringify(serverInfo);

	serverUDP.bind(() => {
		serverUDP.setBroadcast(true);

		// Enviar el mensaje de anuncio como un broadcast
		serverUDP.send(
			message,
			0,
			message.length,
			port.S,
			"255.255.255.255",
			(err) => {
				if (err)
					log.error({
						icon: "hearing",
						title: "UDP server",
						content:
							"Ocurrio un error al intentar enviar el mensaje.",
						advanced: err,
					});
				else
					log.info({
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

const callFromGUI = () => {
	if (!builded) {
		console.log("No se ha construido el daemon");
		return;
	}
	on("udp-get", (e, data) => {
		send("udp-get", getConf());
	});
	on("udp-active", (e, data) => {
		if (data)
			start({
				fnc_receives: (message, rinfo) => {
					log.info({
						icon: "hearing",
						title: "UDP server",
						content:
							"Se recibió un mensaje de un cliente potencial. Iniciando respuesta...",
						advanced: `${message}`,
					});
				},
				fnc_listen: () => {
					log.success({
						icon: "hearing",
						title: "UDP server",
						content: "El servidor esta escuchando.",
						advanced: `${ip}:${port.E}`,
					});
					send("udp-active", true);
				},
				fnc_error: (e) => {
					log.error({
						icon: "hearing",
						title: "UDP server",
						content: "Ocurrio un error en el servidor.",
						advanced: e,
					});
					send("udp-active", false);
				},
				fnc_close: () => {
					log.warning({
						icon: "hearing",
						title: "UDP server",
						content: "El servidor se a detenido.",
						advanced: e,
					});
					send("udp-active", false);
				},
			});
		else
			close({
				fnc_error: (e) => {
					log.error({
						icon: "hearing",
						title: "UDP server",
						content:
							"Ocurrio un error al intentar cerrar el servicio.",
						advanced: e,
					});
					send("udp-active", false);
				},
			});
	});

	on("udp-save", (e, data) => {
		send("udp-save", save(data));
	});
};
module.exports = {
	build,
	callFromGUI,
};
