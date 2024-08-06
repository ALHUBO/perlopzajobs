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
var backConfig = {
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
	access: {
		exists: null,
		can: false,
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

const _save = (shifer) => {
	let pass =
		shifer === null ? encrypt.ASCII2sha256(native.timestamp()) : shifer;
	encrypt
		.genCifer(pass)
		.then((cifer) => {
			file.write(
				"./dtx",
				"conf.ahb",
				encrypt.CiferSMS(btoa(JSON.stringify(backConfig)), cifer)
			)
				.then(() => {
					resolve(shifer);
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
};

const _load = (shifer) => {
	return new Promise((resolve, reject) => {
		_exists()
			.then((ex) => {
				if (ex) {
					if (typeof shifer != "string" || shifer == "") {
						resolve({ ...backConfig });
						return;
					}
					encrypt
						.genCifer(shifer)
						.then((cifer) => {
							file.read("./dtx/access.ahb")
								.then((data) => {
									backConfig = JSON.parse(
										atob(encrypt.DeciferSMS(data, cifer))
									);
									resolve({ ...backConfig });
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
				} else resolve({ ...backConfig });
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

//$--------------------------------------------------------------------------Funciones Front-End
const save = () => {
	_save()
		.then((shifer) => {
			win.log.success({
				icon: "settings",
				title: "Configuration",
				content: "Saving configuration.",
			});
			win.send("config-save", {
				error: false,
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
			access
				.exists()
				.then((r) => {
					daconfig.access.exists = r;
					win.log.success({
						icon: "settings",
						title: "Configuration",
						content: "Configuration loaded.",
					});
					win.send("config-load", {
						error: false,
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

//export--------------------------------------------------------------------------> Desde la GUI
const listeners = () => {
	encrypt = global.encrypt;
	file = global.file.utilities;
	win = global.window.utilities;
	access = global.access.utilities;

	win.on("config-save", (e, data) => save(data));
	win.on("config-load", (e, data) => load(data));
};

//export-------------------------------------------------------------------->Funciones expuestas
const utilities = {
	save: _save,
	exists: _exists,
};

module.exports = {
	listeners,
	utilities,
};
