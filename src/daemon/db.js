/**
 * !-----------------------------------------------------------------
 * !                          Servidor MySQL
 * !-----------------------------------------------------------------*/
//import-------------------------> Drivers para conexión
const db = require("mysql2"),
	sqlite3 = require("sqlite3").verbose(),
	path = require("path");

//var>---------------------------$ db execution Globals
var connection = null,
	builded = false,
	status = "disconnect"; //?---Conexión activa

//var>---------------------------$ funciones globales
var onerror = () => {
		return;
	}, //?---Si ocurre un error sqlite3
	onend = () => {
		return;
	}, //?---Cuando finaliza la conexión sqlite3
	on = () => {
		return;
	}, //?---Recibe de la GUI
	send = () => {
		return;
	}; //?---Envia al GUI

//var>---------------------------$ Datos de conexión
var dataCnx = {
	IP: "localhost",
	port: "3306",
	user: "root",
	password: "",
	database: "perlopzajobs",
	driver: "mysql", //mysql | mariadb | sqlite
};

const build = ({
	fnc_on = () => {
		return;
	},
	fnc_send = () => {
		return;
	},
}) => {
	on = fnc_on;
	send = fnc_send;

	builded = true;
};

const dataConnection = ({
	IP = "localhost",
	port = "3306",
	user = "root",
	password = "",
	database = "perlopzajobs",
	driver = "mysql",
}) => {
	if (!builded) return false;
	const expReg =
		/^((25[0-5]{1}|2[0-4][0-9]|1[0-9]{2}|[0-9]?[0-9])\.){3}(25[0-5]{1}|2[0-4][0-9]|1[0-9]{2}|[0-9]?[0-9])$/;
	//$--------------->Si no recibe valores correctos los recetea
	if (typeof IP != "string" || (!expReg.test(IP) && IP != "localhost"))
		IP = "localhost";
	if ((typeof port != "string" && typeof port != "number") || port == "")
		port = "3306";
	if (typeof user != "string" || user == "") user = "root";
	if (typeof password != "string") password = "";
	if (typeof database != "string" || database == "")
		database = "ALHUBOServer";
	if (
		typeof driver != "string" ||
		(driver != "mysql" && driver != "mariadb" && driver != "sqlite")
	)
		driver = "mysql";
	dataCnx = {
		IP,
		port,
		user,
		password,
		database,
		driver,
	};
	return true;
};

/**
 * %--------------------------------[ start(destructured-object):void ]
 * ?---Crea la conexión a la base de datos dependiendo del driver
 * @param {string} IP("localhost") ip del servidor en caso de que driver sea [mysql | mariadb]
 * @param {string} port("3306") puerto del servidor en caso de que driver sea [mysql | mariadb]
 * @param {string} user("root") usuario de acceso al servidor en caso de que driver sea [mysql | mariadb]
 * @param {string} password("") contraseña del usuario en caso de que driver sea [mysql | mariadb]
 * @param {string} database("ALHUBOServer") nombre de la base de datos
 * @param {string} driver("mysql") driver para conexión [mysql | mariadb | sqlite]
 * @param {function} fnc_success(():void) función callback si se realizó la conexión
 * @param {function} fnc_processError(():void) función callback si ocurrio un error en la conexión
 * @param {function} fnc_error(():void) función callback si ocurrio un error terminante
 * @param {function} fnc_close(():void) función callback cuando se termina la conexión
 * set Global:[connection]&[status]&[dvrx]
 * return void
 **/

function start({
	fnc_success = () => {
		console.log("Se realizó la conexión a la base de datos con exito.");
		return;
	},
	fnc_processError = (error) => {
		console.log(`Error al conectar a la base de datos: ${error}`);
		return;
	},
	fnc_error = (error) => {
		console.log(`Error en la conexión a la base de datos: ${error}`);
		return;
	},
	fnc_close = () => {
		console.log(`Conexión con la base de datos terminada.`);
		return;
	},
}) {
	if (!builded) {
		console.log("Aún no se ha contruido el deamon");
		return;
	}
	if (connection !== null) {
		console.log("Ya esta inicada la conexion");
		return;
	}
	if (dataCnx.driver == "sqlite") {
		//$--------------->Dependiendo del driver hace la conexión
		//$--------------->Resuleve la ruta a la base de datos y conecta (si no existe la crea)
		const dbPath = path.resolve("./dtx", `${dataCnx.database}.sqlite`);
		connection = new sqlite3.Database(
			dbPath,
			sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
			(err) => {
				if (err) {
					//$--------------->Ocurrio un error en la conexión
					connection = null;
					status = "error";
					fnc_processError(err);
				} else {
					status = "connect";
					fnc_success();
				}
			}
		);

		onerror = fnc_error; //$--------------->Guarda el callback error
		onend = fnc_close; //$--------------->Guarda el callback close
	} else {
		//$--------------->Crea conexión al servidor
		connection = db.createConnection({
			host: dataCnx.IP,
			port: dataCnx.port,
			user: dataCnx.user,
			password: dataCnx.password,
			database: dataCnx.database,
		});

		//$--------------->Intenta conectar al servidor
		connection.connect(function (error) {
			if (error) {
				connection = null;
				status = "error";
				fnc_processError(error);
			} else {
				status = "connect";
				fnc_success();
			}
		});

		//$--------------->Listener de error
		connection.on("error", function (error) {
			status = "error";
			fnc_error(error);
			return;
		});

		//$--------------->Listener de desconexión
		connection.on("end", function () {
			status = "disconnect";
			connection = null;
			fnc_close();
			return;
		});
	}
}

/**
 * %--------------------------------[ close(destructured-object):void ]
 * ?---Termina la conexión a la base de datos dependiendo del driver
 * @param {function} fnc_processError(():void) función callback si ocurrio un error al terminar la conexión
 * @param {function} fnc_error(():void) función callback si ocurrio un error
 * set Global:[status]
 * return void
 **/
function close({
	fnc_processError = (error) => {
		console.log(
			`No fue posible cerrar la conexión a la base de datos: ${error}.`
		);
		return;
	},
	fnc_error = (error) => {
		console.log(
			`No fue posible cerrar la conexión a la base de datos: ${error}.`
		);
		return;
	},
}) {
	if (!builded) {
		console.log("Aún no se ha contruido el deamon");
		return;
	}
	if (connection === null) {
		console.log("No hay conexión activa");
		return;
	}
	//$---------------> Elige el Driver e intenta terminar conexión
	if (dataCnx.driver == "sqlite") {
		try {
			connection.close((err) => {
				if (err) {
					status = "error";
					fnc_processError(err);
				} else {
					status = "disconnect";
					onend();
				}
				connection = null;
			});
		} catch (e) {
			status = "error";
			connection = null;
			fnc_error(e);
		}
	} else {
		try {
			connection.end(function (err) {
				if (err) {
					status = "error";
					fnc_processError(err);
					return;
				}
				status = "disconnect";
				connection = null;
			});
		} catch (e) {
			status = "error";
			connection = null;
			fnc_error(e);
		}
	}
}

/**
 * %--------------------------------[ query(string):Promise ]
 * ?---Ejecuta una query en la base de datos
 * @param {string} qwerty(undefined) query sql a ejecutar
 * return Promise->then(results:object)
 **/
function query(qwerty) {
	return new Promise((resolve, reject) => {
		resolve(qwerty);
		return;
		if (typeof qwerty != "string" || qwerty == "") {
			reject(
				new Error(
					"You need to specify a valid query to perform the action."
				)
			);
			return;
		}
		//$---------------> Elige el driver
		if (dvrx == "sqlite") {
			//$---------------> Verifica si es select u otra acción
			const verbose = qwerty.split(" ")[0].toLowerCase();
			if (verbose == "select") {
				//$---------------> Realiza consulta select
				connection.all(qwerty, function (err, results) {
					if (err) reject(new Error(`${err.message}`));
					else {
						resolve(results);
						console.log(results);
					}
				});
			} else {
				//$---------------> realiza otra acción
				connection.run(qwerty, function (err) {
					if (err) reject(new Error(`${err.message}`));
					else resolve({ id: this.lastID });
					console.log(this);
				});
			}
		} else {
			//$---------------> Es MySQL o MariaDB
			connection.query(qwerty, (error, results, fields) => {
				console.log(fields);
				console.log(results);
				console.log(error);
				if (error) {
					reject(`${error.sql} ${error.sqlMessage}`);
					return;
				}
				resolve(results);
			});
		}
	});
}

function checkoutWhere(where) {
	let rt = {
		valid: false,
		data: "",
	};
	if (where.replace(/\s+/gi, " ") == "WHERE ")
		return {
			valid: true,
			data: "",
		};
	let LogicaRegExp =
		/(\s)([\w]+)(\s*)(\=|\!\=|\<\>|\>|\>\=|\<|\<\=|like)(\s*)(\'[^\']*\'|\"[^\"]*\"|NULL|[\d]+|[\d]*\.[\d]+)(\s?)/gi;
	let LogicaCompuestaRegExp =
		/(\s)([\w]+)(\s*)(BETWEEN)(\s*)(\'[^\']*\'|\"[^\"]*\"|[\d]+|[\d]*\.[\d]+)(\s*)(AND)(\s*)(\'[^\']*\'|\"[^\"]*\"|[\d]+|[\d]*\.[\d]+)(\s?)/gi;

	let LogicaNullRegExp = /(\s)([\w]+)(\s*)(IS)(\s*)(NULL)(\s?)/gi;

	let LogicaNotNullRegExp =
		/(\s)([\w]+)(\s*)(IS)(\s*)(NOT)(\s*)(NULL)(\s?)/gi;

	let ANDRegExp =
		/(\s)(Logica|Compuesta|NULL|NOLL|DNA)(\s*)(AND)(\s*)(Logica|Compuesta|NULL|NOLL|DNA)(\s?)/gi;
	let ORRegExp =
		/(\s)(Logica|Compuesta|NULL|NOLL|DNA|RO)(\s*)(OR)(\s*)(Logica|Compuesta|NULL|NOLL|DNA|RO)(\s?)/gi;

	let finalRegExp =
		/(\s?)(WHERE)(\s*)(Logica|Compuesta|NULL|NOLL|DNA|RO)(\s?)/gi;

	let checkout = where;

	while (checkout.match(LogicaRegExp))
		checkout = checkout.replace(LogicaRegExp, "$1Logica$7");

	while (checkout.match(LogicaCompuestaRegExp))
		checkout = checkout.replace(LogicaCompuestaRegExp, "$1Compuesta$11");

	while (checkout.match(LogicaNullRegExp))
		checkout = checkout.replace(LogicaNullRegExp, "$1NULL$7");

	while (checkout.match(LogicaNotNullRegExp))
		checkout = checkout.replace(LogicaNotNullRegExp, "$1NOLL$9");

	while (checkout.match(ANDRegExp))
		checkout = checkout.replace(ANDRegExp, "$1DNA$7");

	while (checkout.match(ORRegExp))
		checkout = checkout.replace(ORRegExp, "$1RO$7");

	checkout = checkout.replace(/\s+/g, " ").replace(finalRegExp, "QUERY");
	rt.valid = checkout == "QUERY";

	checkout = where;
	while (checkout.match(LogicaRegExp))
		checkout = checkout.replace(LogicaRegExp, " `$2` $4 $6$7");

	while (checkout.match(LogicaCompuestaRegExp))
		checkout = checkout.replace(
			LogicaCompuestaRegExp,
			" `$2` BETWEEN $6 AND $10$11"
		);

	while (checkout.match(LogicaNullRegExp))
		checkout = checkout.replace(LogicaNullRegExp, " `$2` IS NULL$7");

	while (checkout.match(LogicaNotNullRegExp))
		checkout = checkout.replace(LogicaNotNullRegExp, " `$2` IS NOT NULL$9");

	rt.data = checkout;
	return rt;
}

/**
 * %--------------------------------[ select(destructured-object):Promise ]
 * ?---Crea la conexión a la base de datos dependiendo del driver
 * @param {string} table("") tabla a cual hacer la consulta
 * @param {array|string} columns([]) columnas a retornar o todas (*)
 * @param {string} where("") where para la consulta
 * @param {object} orderby({value:"",asc: false}) objeto para el ordenamiento de los resultados
 * @param {string} orderby.value("") Ordenamiento por ...
 * @param {boolean} orderby.asc(false) ordena de forma ascendente
 * @param {number} limit(0) Limite de resultados
 * @param {number} offset(0) query sql a ejecutar
 * return query->Promise->then(results:object)
 **/

function select({
	table = "",
	columns = [],
	where = "",
	orderby = {
		value: "",
		asc: false,
	},
	limit = 0,
	offset = 0,
}) {
	return new Promise((resolve, reject) => {
		if (
			(typeof columns == "object" && columns.length <= 0) ||
			(typeof columns == "string" && columns != "*") ||
			table == ""
		) {
			reject(new Error("Se requiere almenos [ table ] y [ columns ]"));
			return;
		}

		let first = true;
		let lecolumns =
			typeof columns == "string" && columns == "*" ? columns : "";
		if (typeof columns == "object")
			for (let i in columns)
				if (typeof columns[i] == "string") {
					if (first) first = false;
					else lecolumns += `,`;
					lecolumns += `\`${AntiInyectionSQL(columns[i])}\``;
				}

		if (lecolumns == "") {
			reject(new Error("No se especifico ninguna columna valida."));
			return;
		}

		let wh = checkoutWhere(`WHERE ${where}`);

		if (!wh.valid) {
			reject(new Error("El where no es valido."));
			return;
		}
		orderby =
			typeof orderby == "object" &&
			typeof orderby.value == "string" &&
			orderby.value != ""
				? `ORDER BY \`${orderby.value}\` ${
						typeof orderby.asc == "boolean" && orderby.asc
							? "ASC"
							: "DESC"
				  } `
				: "";

		limit = typeof limit == "number" && limit > 0 ? `LIMIT ${limit}` : "";
		offset =
			typeof offset === "number" && offset > 0 ? `OFFSET ${offset}` : "";
		const qwerty =
			`SELECT ${lecolumns} FROM \`${table}\` ${wh.data} ${orderby} ${limit} ${offset};`
				.replace(/[\s]+/g, " ")
				.replace(/\s\;/g, ";");
		query(qwerty)
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

function insert({ table = "", data = {} }) {
	return new Promise((resolve, reject) => {
		if (Object.keys(data).length <= 0 && table == "") {
			reject(new Error("Se requiere almenos [ table ] y [ data ]"));
			return;
		}
		let first = false;
		let columns = "";
		let values = "";
		for (let i in data) {
			if (first) {
				columns += `, \`${i}\``;
				if (typeof data[i] == "string")
					values += `, "${AntiInyectionSQL(data[i])}"`;
				else if (typeof data[i] == "number") values += `, ${data[i]}`;
				else if (data[i] === null) values += `, NULL`;
			} else {
				first = true;
				columns = `\`${i}\``;
				if (typeof data[i] == "string")
					values += `"${AntiInyectionSQL(data[i])}"`;
				else if (typeof data[i] == "number") values += `${data[i]}`;
				else if (data[i] === null) values += `NULL`;
			}
		}
		const qwerty = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
		query(qwerty)
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

function update({
	table = "",
	data = {},
	where = "",
	fnc_success = (r) => {
		console.log(r);
		return;
	},
	fnc_error = (e) => {
		console.error("Error al realizar el update:", e);
		return;
	},
}) {
	return new Promise((resolve, reject) => {
		if (
			Object.keys(data).length <= 0 ||
			typeof table != "string" ||
			table == ""
		) {
			reject(new Error("Ingresa datos validos"));
			return;
		}
		let first = false;
		let ledata = "";
		for (let i in data) {
			if (first) {
				ledata = `${ledata}, ${i}="${AntiInyectionSQL(data[i])}"`;
			} else {
				first = true;
				ledata = `${i}="${AntiInyectionSQL(data[i])}"`;
			}
		}
		where = where != "" ? `WHERE ${where}` : "";
		const qwerty = `UPDATE ${table} SET ${ledata} ${where}`;
		query(qwerty)
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

function del({ table = "", where = "" }) {
	return new Promise((resolve, reject) => {
		if (typeof table != "string" || table == "") {
			reject(new Error("Ingresa datos validos"));
			return;
		}
		where = where != "" ? `WHERE ${where}` : "";
		const qwerty = `DELETE FROM ${table} ${where}`;
		query(qwerty)
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

function dump({ data = "" }) {
	return new Promise((resolve, reject) => {
		if (typeof data != "string" || data == "") {
			reject(new Error("No se recibio data para el volcado"));
			return;
		}
		query(data)
			.then((datax) => {
				resolve(datax);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

function AntiInyectionSQL(stm) {
	try {
		stm = stm.replace(/\;/g, "&#59;");
		stm = stm.replace(/\"/g, "&#34;");
		stm = stm.replace(/\'/g, "&#39;");
		stm = stm.replace(/\./g, "&#46;");
		stm = stm.replace(/\,/g, "&#44;");
		stm = stm.replace(/\-\-/g, "&#45;&#45;");
		stm = stm.replace(/\:/g, "&#58;");
		stm = stm.replace(/\(/g, "&#40;");
		stm = stm.replace(/\)/g, "&#41;");
		stm = stm.replace(/\[/g, "&#91;");
		stm = stm.replace(/\]/g, "&#93;");
		stm = stm.replace(/\=/g, "&#61;");
		stm = stm.replace(/\`/g, "&#96;");
		stm = stm.replace(/\%/g, "&#37;");
	} catch (e) {
		stm = "";
	}
	return stm;
}

const callFromGUI = () => {
	if (!builded) {
		console.log("No se ha construido el daemon");
		return;
	}
	on("db-save", (e, data) => {
		dataConnection({
			IP: data.ip,
			port: data.port,
			user: data.user,
			password: data.pass,
			database: data.db,
			driver: data.driver,
		});
		send("db-save", dataCnx);
	});

	on("db-connect", (e, data) => {
		start({
			fnc_success: () => {
				send("db-conection", true);
			},
			fnc_close: () => {
				send("db-conection", false);
			},
			fnc_error: (e) => {
				send("db-onconection-error", e);
			},
			fnc_processError: (e) => {
				send("db-conection-error", e);
			},
		});
	});
	on("db-disconnect", (e, data) => {
		close({
			fnc_error: (e) => {
				send("db-close-error", e);
			},
			fnc_processError: (e) => {
				send("db-close-error", e);
			},
		});
	});
};

function getStatus() {
	return status;
}

function getDriver() {
	return dvrx;
}

module.exports = {
	build,
	callFromGUI,
};

// select({
// 	table: "user",
// 	columns: ["id", "name", "mail", "pass"],
// 	where: `id='1' and fecha BETWEEN 13 AND 18 OR register IS NULL OR noregister IS NOT NULL AND carper like "%a%"`,
// 	orderby: {
// 		value: "id",
// 		asc: true,
// 	},
// 	limit: 12,
// 	offset: 10,
// })
// 	.then((data) => {
// 		console.log(data);
// 	})
// 	.catch((e) => {
// 		console.log(e);
// 	});
