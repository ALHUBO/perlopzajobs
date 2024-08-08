/**
 * !--------------------------------------------------------------------------------------------
 * !					Control de configuración
 * var					Complemento para ALHUBOSoft
 * import				Sirve para controlar la configuración interna
 * $					Autor: ALHUBO [Alejandro Huerta Bolaños]
 * %					V1.0 [ ２０２４年4月5日 - ]
 * ?					https://github.com/ALHUBO/ALHUBOSoft
 * !--------------------------------------------------------------------------------------------
 * **/

const native = require("./native");

//var>------------------------------------------------------------------$ Globales del config.js
var supaConfig = {
	gui: {
		title: "ALHUBOSoft",
		lang: {
			act: "noneLang",
			list: {},
		},
		theme: { mode: "system", dark: false },
		screen: {
			width: 100,
			height: 100,
			full: false,
			maximize: false,
		},
	},
	console: {
		open: false,
		noview: 0,
		content: {},
	},
	server: {
		ip: "",
		udp: {
			stablished: false,
			auto: false,
			data: {
				port: { E: 56789, S: 56790 },
			},
		},
		ws: { stablished: false, auto: false, data: { port: 3000 } },
		db: {
			stablished: false,
			auto: false,
			data: {
				ip: "localhost",
				port: 3306,
				user: "root",
				pass: "",
				db: "PerlopzaJobs",
				driver: "",
			},
		},
	},
};

var encrypt = null, //?---Rekiem externo
	file = null, //?---Rekiem externo
	win = null, //?---Funciones utiles de window
	access = null;

//!___________________________________________________________________________Funciones Back-End
const _exists = () => {
	return new Promise((resolve, reject) => {
		file.exists("./dtx/conf.ahb")
			.then((ex) => {
				resolve(ex);
			})
			.catch((e) => {
				resolve(false);
			});
	});
};

const _save = ({ config, shifer }) => {
	return new Promise((resolve, reject) => {
		supaConfig = { ...config };
		let pass =
			shifer === null ? encrypt.ASCII2sha256(native.timestamp()) : shifer;
		encrypt
			.genCifer(pass)
			.then((cifer) => {
				file.write(
					"./dtx",
					"conf.ahb",
					native.hex2codexBin(
						encrypt.CiferSMS(
							btoa(JSON.stringify(supaConfig)),
							cifer
						)
					)
				)
					.then(() => {
						resolve(pass);
					})
					.catch((e) => {
						reject({
							error: e,
							message:
								"An error occurred while trying to save the password.",
						});
					});
			})
			.catch((e) => {
				reject({
					error: e,
					message:
						"An error occurred while trying to encrypt the password.",
				});
			});
	});
};

const _load = (shifer) => {
	return new Promise((resolve, reject) => {
		_exists()
			.then((ex) => {
				if (ex) {
					if (typeof shifer != "string" || shifer == "") {
						resolve({ ...supaConfig });
						return;
					}
					encrypt
						.genCifer(shifer)
						.then((cifer) => {
							file.read("./dtx/conf.ahb")
								.then((data) => {
									supaConfig = JSON.parse(
										atob(
											encrypt.DeciferSMS(
												native.codexBin2hex(data),
												cifer
											)
										)
									);
									supaConfig.udp.stablished = false;
									supaConfig.ws.stablished = false;
									supaConfig.db.stablished = false;
									supaConfig.access.can = false;
									resolve({ ...supaConfig });
								})
								.catch((e) => {
									reject({
										error: e,
										message:
											"An error occurred while trying to read the configuration.",
									});
								});
						})
						.catch((e) => {
							reject({
								error: e,
								message:
									"An error occurred while trying to decrypt the configuration.",
							});
						});
				} else resolve({ ...supaConfig });
			})
			.catch((e) => {
				reject({
					error: e,
					message:
						"An error occurred while trying to verify the existence of the configuration.",
				});
			});
	});
};

const _get = (prop) => {
	if (
		typeof prop == "string" &&
		prop != "" &&
		typeof supaConfig[prop] != "undefined"
	)
		return { ...supaConfig[prop] };
	else return { ...supaConfig };
};

//$--------------------------------------------------------------------------Funciones Front-End
const save = (responde) => {
	_save(responde)
		.then((shifer) => {
			win.log.success({
				icon: "settings",
				title: "Configuration",
				content: "Saving configuration.",
			});
			win.send("config-save", {
				ok: true,
				sms: shifer,
			});
		})
		.catch((e) => {
			win.log.error({
				icon: "settings",
				title: "Configuration",
				content: e.message,
				advanced: e.error,
			});
			win.send("config-save", {
				error: true,
				sms: e.message,
			});
		});
};

const load = (shifer) => {
	_load(shifer)
		.then((daconfig) => {
			win.log.success({
				icon: "settings",
				title: "Configuration",
				content: "Configuration loaded.",
			});
			win.send("config-load", {
				ok: true,
				sms: { ...daconfig },
			});
		})
		.catch((e) => {
			win.log.error({
				icon: "settings",
				title: "Configuration",
				content: e.message,
				advanced: e.error,
			});
			win.send("config-load", {
				error: true,
				sms: e.message,
			});
		});
};

const ipSave = (responde) => {
	_save(responde)
		.then((shifer) => {
			win.log.success({
				icon: "router",
				title: "Server IP",
				content: "Configuration saved.",
			});
			win.send("config-ip-save", true);
		})
		.catch((e) => {
			win.log.error({
				icon: "router",
				title: "Server IP",
				content: e.message,
				advanced: e.error,
			});
			win.send("config-ip-save", false);
		});
};

const udpSave = (responde) => {
	_save(responde)
		.then((shifer) => {
			win.log.success({
				icon: "dns",
				title: "Server UDP",
				content: "Configuration saved.",
			});
			win.send("config-udp-save", true);
		})
		.catch((e) => {
			win.log.error({
				icon: "dns",
				title: "Server UDP",
				content: e.message,
				advanced: e.error,
			});
			win.send("config-udp-save", false);
		});
};

const _safeareaGet = () => {
	let size = win.screenSize();
	supaConfig.gui.screen.height = size.height;
	supaConfig.gui.screen.width = size.width;
	return supaConfig.gui.screen.height * 0.04;
};

//export--------------------------------------------------------------------------> Desde la GUI
const listeners = () => {
	encrypt = global.encrypt;
	file = global.file.utilities;
	win = global.window.utilities;
	access = global.access.utilities;

	win.on("config-load", (e, data) => load(data));
	win.on("config-save", (e, data) => save(data));
	win.on("config-get", (e, data) =>
		win.send("config-get", { prop: data, data: _get(data) })
	);

	win.on("conf-safearea-get", (e, data) =>
		win.send("conf-safearea-get", _safeareaGet())
	);

	win.on("conf-title-set", (e, data) => {
		supaConfig.gui.title = data;
		win.send("conf-title-get", data);
	});

	win.on("conf-title-get", (e, data) =>
		win.send("conf-title-get", supaConfig.gui.title)
	);
	win.on("config-ip-save", (e, data) => ipSave(data));
	win.on("config-udp-save", (e, data) => udpSave(data));
	win.on("config-get", () => {
		win.send("config-get", { ...supaConfig });
	});
};

//export-------------------------------------------------------------------->Funciones expuestas
const utilities = {
	load: _load,
	save: _save,
	exists: _exists,
	get: _get,
};

module.exports = {
	listeners,
	utilities,
};
