//import-------------------------> Para manejar archivos
const fs = require("fs");

//var>---------------------------$ Globales del file.js
const userFiles = "ufsys"; //?---Nombre de directorio para archivos de usuario

/**
 * %--------------------------------[ parseDir(string):Promise ]
 * !---No Exportado
 * ?---Estandariza las rutas y no permite acceso hacia atras
 * ?---Si utiliza la ruta %UF% crea el directorio para archivos de usuario si no existe
 * @param {string} dir(undefined) Ruta a estandarizar
 * return Promise->then(string)
 **/
function parseDir(dir) {
	return new Promise((resolve, reject) => {
		if (typeof dir != "string") dir = "";

		const isufe = dir.indexOf("%UF%") != -1;
		dir = dir.replace(/\%UF\%/g, userFiles);
		dir = dir.replace(/\.\//g, "").replace(/\.\.\//g, "");
		if (dir[0] == "/" || dir[0] == "\\") dir = dir.substring(1);
		dir = `./${dir}`;
		dir = dir.replace(/\/\//g, "/").replace(/\\\\/g, "\\");
		if (isufe)
			userfilesystem()
				.then(() => {
					resolve(dir);
				})
				.catch((e) => {
					reject(e);
				});
		else resolve(dir);
	});
}

/**
 * %--------------------------------[ list(string):Promise ]
 * !---Exportado
 * ?---Devuelve la lista de archivos y carpetas de un directorio
 * @param {string} dir(undefined)
 * return Promise->then(object:{ 0:{ root:string-<ruta, type[0=Desconocido|1=Archivo|2=Directorio]:int-<tipoArchivo } })
 **/
function list(dir) {
	return new Promise((resolve, reject) => {
		parseDir(dir)
			.then((root) => {
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
				reject(e);
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
function write(dir, data) {
	return new Promise((resolve, reject) => {
		parseDir(dir)
			.then((root) => {
				fs.writeFile(root, data, (error) => {
					if (error) reject(error);
					else resolve("Archivo Escrito Correctamente!");
				});
			})
			.catch((e) => {
				reject(e);
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
function read(dir) {
	return new Promise((resolve, reject) => {
		parseDir(dir)
			.then((root) => {
				fs.readFile(root, "utf8", (error, data) => {
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
function del(dir) {
	return new Promise((resolve, reject) => {
		parseDir(dir)
			.then((root) => {
				itemType(root)
					.then((type) => {
						if (type == 1) {
							fs.unlink(root, (error) => {
								if (error) reject(error);
								else
									resolve(
										"Se borro correctamente el archivo"
									);
							});
						} else
							reject(
								`No es posible borrar, no es un archivo [${root}]`
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
function userfilesystem() {
	return new Promise((resolve, reject) => {
		// Comprobar si el directorio existe
		fs.access(`./${userFiles}`, (error) => {
			if (error) {
				fs.mkdir(`./${userFiles}`, (err) => {
					if (err) reject(err);
					else resolve("Creado!");
				});
			} else resolve("Creado!");
		});
	});
}

//export------------------------> Funciones disponible hacia el exterior
module.exports = {
	list, //?---Lista contenido directorio
	write, //?---Escribe un archivo texto plano
	read, //?---Lee archivo texto plano
	del, //?---Elimina un archivo o directorio
};
