//import-------------------------> Para manejar archivos
const fs = require("fs");
const { parse } = require("path");

//var>---------------------------$ Globales del file.js
var on = () => {},
	send = () => {};
var encrypt = null;

/**
 * %--------------------------------[ parseDir(string):Promise ]
 * !---No Exportado
 * ?---Estandariza las rutas y no permite acceso hacia atras
 * ?---Si utiliza la ruta %UF% crea el directorio para archivos de usuario si no existe
 * @param {string} dir(undefined) Ruta a estandarizar
 * return Promise->then(string)
 **/
const parseDir = (dir) => {
	if (typeof dir != "string") dir = "";

	dir = dir.replace(/\.\//g, "").replace(/\.\.\//g, "");
	if (dir[0] == "/" || dir[0] == "\\") dir = dir.substring(1);
	dir = `./${dir}`;
	dir = dir.replace(/\/\//g, "/").replace(/\\\\/g, "\\");
	return dir;
};

const existsFile = (dir) => {
	return new Promise((resolve, reject) => {
		dir = parseDir(dir);
		fs.stat(dir, (error, stats) => {
			if (error) {
				reject(error);
				if (error.code === "ENOENT") {
					console.log("El archivo no existe.");
				} else {
					console.error("Error al verificar el archivo:", error);
				}
			} else resolve(stats);
		});
	});
};

/**
 * %--------------------------------[ list(string):Promise ]
 * !---Exportado
 * ?---Devuelve la lista de archivos y carpetas de un directorio
 * @param {string} dir(undefined)
 * return Promise->then(object:{ 0:{ root:string-<ruta, type[0=Desconocido|1=Archivo|2=Directorio]:int-<tipoArchivo } })
 **/
function list(dir) {
	return new Promise((resolve, reject) => {
		existsDir(dir)
			.then(() => {
				const root = (dir = parseDir(dir));
				fs.readdir(root, (error, archivos) => {
					if (error) {
						reject(error);
						return;
					}
					let promesasLectura = [];
					let items = {};
					archivos.forEach((item) => {
						let rutaArchivo = `${root}/${item}`;
						rutaArchivo = rutaArchivo.replace(/\/\//g, "/");
						promesasLectura.push(
							new Promise((resolve, reject) => {
								fs.stat(rutaArchivo, (err, stats) => {
									if (err) {
										reject(err);
										return;
									}

									if (stats.isFile()) {
										items[Object.keys(items).length] = {
											root: rutaArchivo,
											type: 1,
										};
										resolve("");
									} else if (stats.isDirectory()) {
										items[Object.keys(items).length] = {
											root: rutaArchivo,
											type: 2,
										};
										resolve("");
									} else {
										items[Object.keys(items).length] = {
											root: rutaArchivo,
											type: 0,
										};
										resolve("");
									}
								});
							})
						);
					});
					Promise.all(promesasLectura)
						.then(() => {
							resolve(items);
						})
						.catch((error) => {
							reject(error);
						});
				});
			})
			.catch((e) => {
				console.log(e);
			});
	});
}

/**
 * %--------------------------------[ write(string, string):Promise ]
 * !---Exportado
 * ?---Escribe texto plano en un archivo
 * @param {string} dir(undefined) Ruta del archivo a guardar
 * @param {string} data(undefined) Texto plano a guardar
 * return Promise->then(flag:string-<Success)
 **/
function write(dir, name, data) {
	return new Promise((resolve, reject) => {
		createDir(dir)
			.then(() => {
				const root = parseDir(`${dir}/${name}`);
				fs.writeFile(root, data, (error) => {
					if (error) reject(error);
					else resolve("Archivo Escrito Correctamente!");
				});
			})
			.catch((e) => {
				console.log(e);
			});
	});
}

/**
 * %--------------------------------[ read(string):Promise ]
 * !---Exportado
 * ?---Lee texto plano de un archivo
 * @param {string} dir(undefined) Ruta del archivo a leer
 * return Promise->then(data:string-<Texto Plano leido)
 **/
function read(file) {
	return new Promise((resolve, reject) => {
		existsFile(file)
			.then(() => {
				fs.readFile(file, "utf8", (error, data) => {
					if (error) reject(error);
					else resolve(data);
				});
			})
			.catch((e) => {
				reject(e);
			});
	});
}

/**
 * %--------------------------------[ del(string):Promise ]
 * !---Exportado
 * ?---Elimina un archivo
 * @param {string} dir(undefined) Ruta del archivo a eliminar
 * return Promise->then(flag:string-<Success)
 **/
function del(file) {
	return new Promise((resolve, reject) => {
		file = parseDir(file);
		existsFile(file)
			.then(() => {
				itemType(file)
					.then((type) => {
						if (type == 1) {
							fs.unlink(file, (error) => {
								if (error) reject(error);
								else
									resolve(
										"Se borro correctamente el archivo"
									);
							});
						} else
							reject(
								`No es posible borrar, no es un archivo [${file}]`
							);
					})
					.catch((e) => {
						reject(e);
					});
			})
			.catch((e) => {
				reject(e);
			});
	});
}

/**
 * %--------------------------------[ itemType(string):Promise ]
 * !---No exportado
 * ?---Obtiene si es un archivo o una carpeta
 * @param {string} dir(undefined) Ruta del archivo a examinar
 * return Promise->then(tipo:int-<[0=Desconocido|1=Archivo|2=Carpeta])
 **/
function itemType(root) {
	return new Promise((resolve, reject) => {
		fs.stat(root, (err, stats) => {
			if (err) {
				reject(err);
				return;
			}

			if (stats.isFile()) resolve(1);
			else if (stats.isDirectory()) resolve(2);
			else resolve(0);
		});
	});
}

/**
 * %--------------------------------[ userfilesystem(void):Promise ]
 * !---No exportado
 * ?---Verifica si existe la carpeta de archivos de usuario, si no, la crea.
 * return Promise->then(flag:string-<Success)
 **/
const createDir = (dir) => {
	dir = parseDir(dir);
	return new Promise((resolve, reject) => {
		if (typeof dir != "string" || dir == "") {
			reject(new Error("No hay directorio para crear."));
			return;
		}
		fs.access(`${dir}`, (error) => {
			if (error) {
				fs.mkdir(`${dir}`, { recursive: true }, (err) => {
					if (err) reject(err);
					else resolve("Creado!");
				});
			} else resolve("Creado!");
		});
	});
};

const existsDir = (dir) => {
	dir = parseDir(dir);
	return new Promise((resolve, reject) => {
		if (typeof dir != "string" || dir == "") {
			reject(new Error("No existe el directorio."));
			return;
		}
		fs.access(`${dir}`, (error) => {
			if (error) reject("No existe");
			else resolve("Existe!");
		});
	});
};

const callFromGUI = ({
	o = () => {
		return;
	},
	s = () => {
		return;
	},
}) => {
	on = o;
	send = s;
	encrypt = global.encrypt;
	on("access-exists", (e, data) => {
		existsFile(parseDir("./dtx/access.ahb"))
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
			send("access-create", false);
			return;
		}

		encrypt
			.genCifer(pass)
			.then((cifer) => {
				write("./dtx", "./access.ahb", encrypt.CiferSMS(pass, cifer))
					.then(() => {
						send("access-create", true);
					})
					.catch((e) => {
						send("access-create", false);
					});
			})
			.catch((e) => {
				console.log(e);
				send("access-create", false);
			});
	});

	on("access-enter", (e, pass) => {
		if (typeof pass != "string" || pass == "") {
			send("access-enter", false);
			return;
		}
		encrypt
			.genCifer(pass)
			.then((cifer) => {
				read("./dtx/access.ahb")
					.then((data) => {
						const sms = global.encrypt.DeciferSMS(data, cifer);
						if (sms == pass) {
							const encr = global.encrypt.ASCII2sha256(sms);
							const d = new Date();
							// [token_access.t, token_access.s] =
							// 	global.native.createToken(
							// 		{
							// 			hasher: encr,
							// 			time: `${d.getFullYear()}-${`${
							// 				d.getMonth() + 1
							// 			}`.padStart(
							// 				2,
							// 				"0"
							// 			)}-${`${d.getDay()}`.padStart(
							// 				2,
							// 				"0"
							// 			)} ${`${d.getHours()}`.padStart(
							// 				2,
							// 				"0"
							// 			)}:${`${d.getMinutes()}`.padStart(
							// 				2,
							// 				"0"
							// 			)}:${`${d.getSeconds()}`.padStart(2, "0")}`,
							// 		},
							// 		86400
							// 	);
							send("access-enter", "sdfsdf");
						} else send("access-enter", false);
					})
					.catch(() => {
						send("access-enter", false);
					});
			})
			.catch((e) => {
				send("access-enter", false);
			});
	});
};

//export------------------------> Funciones disponible hacia el exterior
module.exports = {
	list, //?---Lista contenido directorio
	write, //?---Escribe un archivo texto plano
	read, //?---Lee archivo texto plano
	del, //?---Elimina un archivo o directorio
	callFromGUI,
};
