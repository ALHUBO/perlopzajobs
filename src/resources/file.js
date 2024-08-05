/**
 * !--------------------------------------------------------------------------------------------
 * !					Manejo Archivos
 * var					Complemento para ALHUBOSoft
 * import				Son utilidades para hacer mas facil el manejo de archivos.
 * $					Autor: ALHUBO [Alejandro Huerta Bolaños]
 * %					V1.0 [ ２０２４年4月5日 - ]
 * ?					https://github.com/ALHUBO/ALHUBOSoft
 * !--------------------------------------------------------------------------------------------
 * **/

//import-----------------------------------------------------------------------------> Necesario
const fs = require("fs");

//var>--------------------------------------------------------------------$ Globales del file.js
var builded = false,
	win = null;

//?----------------------------------------------------------------------------------Constructor
const build = ({ req_win = null }) => {
	win = req_win;
	builded = true;
};
const isBuild = () => {
	if (!builded) console.log("No se ha construido el daemon [access.js].");
	return builded;
};

//!___________________________________________________________________________Funciones internas
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

	dir = dir
		.replace(/\.\//g, "")
		.replace(/\.\.\//g, "")
		.replace(/\.\\/g, "")
		.replace(/\.\.\\/g, "");
	if (dir[0] == "/" || dir[0] == "\\") dir = dir.substring(1);
	dir = `./${dir}`;
	dir = dir.replace(/\/\//g, "/").replace(/\\\\/g, "\\");
	return dir;
};

const existsFile = (dir) => {
	return new Promise((resolve, reject) => {
		if (!isBuild()) {
			reject(new Error("No se ha contruido el rekiem [file.js]."));
			return;
		}
		dir = parseDir(dir);
		fs.stat(dir, (error, stats) => {
			if (error) {
				reject(error);
				if (error.code === "ENOENT")
					win.log.warning({
						icon: "draft",
						title: "File",
						content: "The file does not exists",
						advanced: dir,
					});
				else
					win.log.error({
						icon: "draft",
						title: "File",
						content: "Error searching for file",
						advanced: error,
					});
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
const list = (dir) => {
	return new Promise((resolve, reject) => {
		if (!isBuild()) {
			reject(new Error("No se ha contruido el rekiem [file.js]."));
			return;
		}
		existsDir(dir)
			.then(() => {
				const root = (dir = parseDir(dir));
				fs.readdir(root, (error, archivos) => {
					if (error) {
						win.log.error({
							icon: "folder_open",
							title: "Directory",
							content: "Error reading directory contents",
							advanced: error,
						});
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
							win.log.error({
								icon: "perm_media",
								title: "Directory",
								content: "Error reading content type",
								advanced: error,
							});
							reject(error);
						});
				});
			})
			.catch((e) => {
				win.log.error({
					icon: "folder_open",
					title: "Directory",
					content: "Error reading directory contents",
					advanced: e,
				});
			});
	});
};

/**
 * %--------------------------------[ write(string, string):Promise ]
 * !---Exportado
 * ?---Escribe texto plano en un archivo
 * @param {string} dir(undefined) Ruta del archivo a guardar
 * @param {string} data(undefined) Texto plano a guardar
 * return Promise->then(flag:string-<Success)
 **/
const write = (dir, name, data) => {
	if (!isBuild()) {
		reject(new Error("No se ha contruido el rekiem [file.js]."));
		return;
	}
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
				win.log.error({
					icon: "description",
					title: "File",
					content: "Error writing file content",
					advanced: e,
				});
				reject(e);
			});
	});
};

/**
 * %--------------------------------[ read(string):Promise ]
 * !---Exportado
 * ?---Lee texto plano de un archivo
 * @param {string} dir(undefined) Ruta del archivo a leer
 * return Promise->then(data:string-<Texto Plano leido)
 **/
const read = (file) => {
	return new Promise((resolve, reject) => {
		if (!isBuild()) {
			reject(new Error("No se ha contruido el rekiem [file.js]."));
			return;
		}
		existsFile(file)
			.then(() => {
				fs.readFile(file, "utf8", (error, data) => {
					if (error) reject(error);
					else resolve(data);
				});
			})
			.catch((e) => {
				reject(e);
				win.log.error({
					icon: "description",
					title: "File",
					content: "Error reading file content",
					advanced: e,
				});
			});
	});
};

/**
 * %--------------------------------[ del(string):Promise ]
 * !---Exportado
 * ?---Elimina un archivo
 * @param {string} dir(undefined) Ruta del archivo a eliminar
 * return Promise->then(flag:string-<Success)
 **/
const del = (file) => {
	return new Promise((resolve, reject) => {
		if (!isBuild()) {
			reject(new Error("No se ha contruido el rekiem [file.js]."));
			return;
		}
		file = parseDir(file);
		existsFile(file)
			.then(() => {
				itemType(file)
					.then((type) => {
						if (type == 1) {
							fs.unlink(file, (error) => {
								if (error) {
									reject(error);
									win.log.error({
										icon: "scan_delete",
										title: "File",
										content: "Error deleting file",
										advanced: error,
									});
								} else
									resolve(
										"Se borro correctamente el archivo"
									);
							});
						} else
							win.log.error({
								icon: "scan_delete",
								title: "File",
								content:
									"It was not possible to delete because it is not a file",
								advanced: file,
							});
					})
					.catch((e) => {
						reject(e);
						win.log.error({
							icon: "scan_delete",
							title: "File",
							content: "Error deleting file",
							advanced: e,
						});
					});
			})
			.catch((e) => {
				reject(e);
				win.log.error({
					icon: "scan_delete",
					title: "File",
					content: "Error deleting file",
					advanced: e,
				});
			});
	});
};

/**
 * %--------------------------------[ itemType(string):Promise ]
 * !---No exportado
 * ?---Obtiene si es un archivo o una carpeta
 * @param {string} dir(undefined) Ruta del archivo a examinar
 * return Promise->then(tipo:int-<[0=Desconocido|1=Archivo|2=Carpeta])
 **/
const itemType = (root) => {
	return new Promise((resolve, reject) => {
		if (!isBuild()) {
			reject(new Error("No se ha contruido el rekiem [file.js]."));
			return;
		}
		fs.stat(root, (err, stats) => {
			if (err) {
				reject(err);
				win.log.error({
					icon: "description",
					title: "Content",
					content:
						"It was not possible to determine the type of content",
					advanced: err,
				});
				return;
			}

			if (stats.isFile()) resolve(1);
			else if (stats.isDirectory()) resolve(2);
			else resolve(0);
		});
	});
};

/**
 * %--------------------------------[ userfilesystem(void):Promise ]
 * !---No exportado
 * ?---Verifica si existe la carpeta de archivos de usuario, si no, la crea.
 * return Promise->then(flag:string-<Success)
 **/
const createDir = (dir) => {
	dir = parseDir(dir);
	return new Promise((resolve, reject) => {
		if (!isBuild()) {
			reject(new Error("No directory name specified."));
			return;
		}
		if (typeof dir != "string" || dir == "") {
			reject(new Error("No directory name specified."));
			win.log.error({
				icon: "folder",
				title: "Directory",
				content: "No directory name specified.",
				advanced: err,
			});
			return;
		}
		fs.access(`${dir}`, (error) => {
			if (error) {
				fs.mkdir(`${dir}`, { recursive: true }, (err) => {
					if (err) {
						reject(err);
						win.log.error({
							icon: "folder",
							title: "Directory",
							content: "The directory could not be created.",
							advanced: err,
						});
					} else resolve("Creado!");
				});
			} else resolve("Creado!");
		});
	});
};

const existsDir = (dir) => {
	dir = parseDir(dir);
	return new Promise((resolve, reject) => {
		if (!isBuild()) {
			reject(new Error("No directory name specified."));
			return;
		}
		if (typeof dir != "string" || dir == "") {
			reject(new Error("No directory name specified."));
			win.log.error({
				icon: "folder",
				title: "Directory",
				content: "No directory name specified.",
				advanced: err,
			});
			return;
		}
		fs.access(`${dir}`, (error) => {
			if (error) reject("No existe");
			else resolve("Existe!");
		});
	});
};

//$--------------------------------------------------------------------------Funciones expuestas
const utilities = {
	parseDir,
	existsFile,
	list,
	write,
	read,
	del,
	createDir,
	existsDir,
};

//export------------------------------------------------> Funciones disponible hacia el exterior
const callFromGUI = () => {
	if (!isBuild()) return;
};

module.exports = {
	build,
	callFromGUI,
	utilities,
};
