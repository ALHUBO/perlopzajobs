//var>---------------------------$ Globales del file.js
var on = () => {},
	send = () => {};
var builded = false,
	encrypt = null,
	file = null,
	log = null;

const build = ({
	fnc_on = () => {
		return;
	},
	fnc_send = () => {
		return;
	},
	req_file = null,
	req_encrypt = null,
	req_log = null,
}) => {
	on = fnc_on;
	send = fnc_send;
	file = req_file;
	encrypt = req_encrypt;
	log = req_log;
	builded = true;
};

const callFromGUI = () => {
	if (!builded) {
		console.log("No se ha construido el daemon");
		return;
	}
	on("access-exists", (e, data) => {
		file.existsFile(file.parseDir("./dtx/access.ahb"))
			.then(() => {
				send("access-exists", true);
			})
			.catch((e) => {
				send("access-exists", false);
			});
	});

	on("access-create", (e, pass) => {
		const rgEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/;
		if (typeof pass != "string" || pass == "" || !rgEx.test(pass)) {
			log.error({
				icon: "key",
				title: "Access",
				content: "An attempt was made to create an invalid password.",
			});
			send("access-create", {
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
						send("access-create", {
							error: 0,
							sms: "The password was created correctly.",
						});
					})
					.catch((e) => {
						log.error({
							icon: "key",
							title: "Access",
							content:
								"An error occurred while trying to save the password.",
							advanced: e,
						});
						send("access-create", {
							error: 2,
							sms: "An error occurred while trying to save the password.",
						});
					});
			})
			.catch((e) => {
				log.error({
					icon: "key",
					title: "Access",
					content:
						"An error occurred while trying to encrypt the password.",
					advanced: e,
				});
				send("access-create", {
					error: 3,
					sms: "An error occurred while trying to encrypt the password.",
				});
			});
	});

	on("access-enter", (e, pass) => {
		if (typeof pass != "string" || pass == "") {
			log.error({
				icon: "key",
				title: "Access",
				content:
					"An attempt was made to log in with an invalid password.",
			});
			send("access-enter", {
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
							send("access-enter", {
								error: 0,
								sms: "was entered correctly.",
								data: "asdasdasd",
							});
						} else
							send("access-enter", {
								error: 2,
								sms: "The password is not correct.",
							});
					})
					.catch((e) => {
						log.error({
							icon: "key",
							title: "Access",
							content:
								"An error occurred while trying to read the password.",
							advanced: e,
						});
						send("access-enter", {
							error: 3,
							sms: "An error occurred while trying to read the password.",
						});
					});
			})
			.catch((e) => {
				log.error({
					icon: "key",
					title: "Access",
					content:
						"An error occurred while trying to decrypt the password.",
					advanced: e,
				});
				send("access-enter", {
					error: 4,
					sms: "An error occurred while trying to decrypt the password.",
				});
			});
	});
};

//export------------------------> Funciones disponible hacia el exterior
module.exports = {
	build,
	callFromGUI,
};
