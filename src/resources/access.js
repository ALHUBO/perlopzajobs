/**
 * !--------------------------------------------------------------------------------------------
 * !					Control de acceso
 * var					Complemento para ALHUBOSoft
 * import				Sirve para controlar si se tiene acceso al servidor y a su configuración
 * $					Autor: ALHUBO [Alejandro Huerta Bolaños]
 * %					V1.0 [ ２０２４年4月5日 - ]
 * ?					https://github.com/ALHUBO/ALHUBOSoft
 * !--------------------------------------------------------------------------------------------
 * **/

//var>------------------------------------------------------------------$ Globales del access.js

var builded = false, //?---Se contruyo el rekiem
	encrypt = null, //?---Rekiem externo
	file = null, //?---Rekiem externo
	win = null; //?---Funciones utiles de window

//?----------------------------------------------------------------------------------Constructor

const build = ({ req_file = null, req_encrypt = null, req_win = null }) => {
	file = req_file;
	encrypt = req_encrypt;
	win = req_win;
	builded = true;
};

const isBuild = () => {
	if (!builded) console.log("No se ha construido el daemon [access.js].");
	return builded;
};

//$--------------------------------------------------------------------------Funciones expuestas
const exists = () => {
	file.existsFile(file.parseDir("./dtx/access.ahb"))
		.then(() => {
			win.send("access-exists", true);
		})
		.catch((e) => {
			win.send("access-exists", false);
		});
};

const create = (pass) => {
	if (typeof pass != "string" || pass == "" || !win.regExp.pass.test(pass)) {
		win.log.error({
			icon: "key",
			title: "Access",
			content: "An attempt was made to create an invalid password.",
		});
		win.send("access-create", {
			error: 1,
			sms: "Password does not meet requirements.",
		});
		return;
	}

	encrypt
		.genCifer(pass)
		.then((cifer) => {
			file.write("./dtx", "access.ahb", encrypt.CiferSMS(pass, cifer))
				.then(() => {
					win.send("access-create", {
						error: 0,
						sms: "The password was created correctly.",
					});
				})
				.catch((e) => {
					win.log.error({
						icon: "key",
						title: "Access",
						content:
							"An error occurred while trying to save the password.",
						advanced: e,
					});
					win.send("access-create", {
						error: 2,
						sms: "An error occurred while trying to save the password.",
					});
				});
		})
		.catch((e) => {
			win.log.error({
				icon: "key",
				title: "Access",
				content:
					"An error occurred while trying to encrypt the password.",
				advanced: e,
			});
			win.send("access-create", {
				error: 3,
				sms: "An error occurred while trying to encrypt the password.",
			});
		});
};

const enter = (pass) => {
	if (typeof pass != "string" || pass == "") {
		win.log.error({
			icon: "key",
			title: "Access",
			content: "An attempt was made to log in with an invalid password.",
		});
		win.send("access-enter", {
			error: 1,
			sms: "A password was not entered in the acceptable format.",
		});
		return;
	}
	encrypt
		.genCifer(pass)
		.then((cifer) => {
			file.read("./dtx/access.ahb")
				.then((data) => {
					const sms = encrypt.DeciferSMS(data, cifer);
					if (sms == pass) {
						win.log.success({
							icon: "key",
							title: "Access",
							content: "Logged into the system.",
						});
						win.send("access-enter", {
							error: 0,
							sms: "was entered correctly.",
							data: "asdasdasd",
						});
					} else {
						win.log.error({
							icon: "key",
							title: "Access",
							content: "A failed login attempt occurred.",
						});
						win.send("access-enter", {
							error: 2,
							sms: "The password is not correct.",
						});
					}
				})
				.catch((e) => {
					win.log.error({
						icon: "key",
						title: "Access",
						content:
							"An error occurred while trying to read the password.",
						advanced: e,
					});
					win.send("access-enter", {
						error: 3,
						sms: "An error occurred while trying to read the password.",
					});
				});
		})
		.catch((e) => {
			win.log.error({
				icon: "key",
				title: "Access",
				content:
					"An error occurred while trying to decrypt the password.",
				advanced: e,
			});
			win.send("access-enter", {
				error: 4,
				sms: "An error occurred while trying to decrypt the password.",
			});
		});
};

//export------------------------------------------------> Funciones disponible hacia el exterior
const callFromGUI = () => {
	if (!isBuild()) return;

	win.on("access-exists", (e, data) => exists());

	win.on("access-create", (e, data) => create(data));

	win.on("access-enter", (e, data) => enter(data));
};

module.exports = {
	build,
	callFromGUI,
};
