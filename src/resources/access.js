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

var encrypt = null, //?---Rekiem externo
	file = null, //?---Rekiem externo
	win = null; //?---Funciones utiles de window

//!___________________________________________________________________________Funciones Back-End
const _exists = () => {
	return new Promise((resolve, reject) => {
		file.exists("./dtx/access.ahb")
			.then((ex) => {
				resolve(ex);
			})
			.catch((e) => {
				resolve(false);
			});
	});
};

const _create = (pass) => {
	return new Promise((resolve, reject) => {
		if (
			typeof pass != "string" ||
			pass == "" ||
			!win.regExp.pass.test(pass)
		) {
			reject({
				error: new Error(
					"The password does not meet the minimum requirements: at least one lowercase letter, one uppercase letter, one digit, one special character (!$%&?), one space (optional), and at least 12 characters."
				),
				message: "An attempt was made to create an invalid password.",
			});
			return;
		}

		encrypt
			.genCifer(pass)
			.then((cifer) => {
				file.write("./dtx", "access.ahb", encrypt.CiferSMS(pass, cifer))
					.then(() => {
						resolve(true);
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

const _enter = (pass) => {
	if (typeof pass != "string" || pass == "") {
		reject({
			error: new Error(
				"The password received by the access controller is not of type [string]"
			),
			message: "The password entered is not in a valid format.",
		});
		return;
	}
	encrypt
		.genCifer(pass)
		.then((cifer) => {
			file.read("./dtx/access.ahb")
				.then((data) => {
					const sms = encrypt.DeciferSMS(data, cifer);
					if (sms == pass) resolve(true);
					else
						reject({
							error: new Error(
								"The password does not match the one stored internally."
							),
							message: "A failed login attempt occurred.",
						});
				})
				.catch((e) => {
					reject({
						error: e,
						message:
							"An error occurred while trying to read the password.",
					});
				});
		})
		.catch((e) => {
			reject({
				error: e,
				message:
					"An error occurred while trying to decrypt the password.",
			});
		});
};

//$--------------------------------------------------------------------------Funciones Front-End

const exists = () => {
	_exists()
		.then((ex) => {
			if (ex)
				win.log.success({
					icon: "key",
					title: "Access",
					content: "An access key was found.",
				});
			else
				win.log.success({
					icon: "key",
					title: "Access",
					content: "There is no access password.",
				});

			win.send("access-exists", ex);
		})
		.catch((e) => {
			win.log.error({
				icon: "key",
				title: "Access",
				content:
					"An error occurred while trying to find the access key",
				advanced: e.error,
			});
			win.send("access-exists", false);
		});
};

const create = (pass) => {
	_create(pass)
		.then(() => {
			win.log.success({
				icon: "key",
				title: "Access",
				content: "The password was created correctly.",
			});
			win.send("access-create", true);
		})
		.catch((e) => {
			win.log.error({
				icon: "key",
				title: "Access",
				content: e.message,
				advanced: e.error,
			});
			win.send("access-create", false);
		});
};

const enter = (pass) => {
	_enter(pass)
		.then(() => {
			win.log.success({
				icon: "key",
				title: "Access",
				content: "Successful login",
			});
			win.send("access-enter", true);
		})
		.catch((e) => {
			win.log.error({
				icon: "key",
				title: "Access",
				content: e.message,
				advanced: e.error,
			});
			win.send("access-enter", false);
		});
};

//export--------------------------------------------------------------------------> Desde la GUI
const listeners = () => {
	encrypt = global.encrypt;
	file = global.file.utilities;
	win = global.window.utilities;

	win.on("access-exists", (e, data) => exists());

	win.on("access-create", (e, data) => create(data));

	win.on("access-enter", (e, data) => enter(data));
};

//export-------------------------------------------------------------------->Funciones expuestas
const utilities = {
	exists: _exists,
	create: _create,
	enter: _enter,
};

module.exports = {
	listeners,
	utilities,
};
