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
var win = null;

//!___________________________________________________________________________Funciones Back-End
const _parseRoot = (dir) => {
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

const _existsDir = (dir) => {
	return new Promise((resolve, reject) => {
		if (typeof dir != "string" || dir == "") {
			reject({
				error: new Error(
					"_existsDir requires the directory path to be specified in [string] format."
				),
				message: "No directory name specified.",
			});
			return;
		}
		fs.access(_parseRoot(dir), (error) => {
			if (error) resolve(false);
			else resolve(true);
		});
	});
};

const _existsFile = (dir) => {
	return new Promise((resolve, reject) => {
		if (typeof dir != "string" || dir == "") {
			reject({
				error: new Error(
					"_existsFile requires the file path to be specified in [string] format."
				),
				message: "No file path specified.",
			});
			return;
		}
		fs.stat(_parseRoot(dir), (error, stats) => {
			if (error) {
				if (error.code === "ENOENT") resolve(false);
				else
					reject({
						error: error,
						message: "Error searching for file.",
					});
			} else resolve(true);
		});
	});
};

const _listDir = (dir) => {
	return new Promise((resolve, reject) => {
		if (typeof dir != "string" || dir == "") {
			reject({
				error: new Error(
					"_listDir requires the directory path to be specified in [string] format."
				),
				message: "No directory name specified.",
			});
			return;
		}
		_existsDir(dir)
			.then((ex) => {
				if (ex) {
					fs.readdir(_parseRoot(dir), (error, archivos) => {
						if (error) {
							reject({
								error: error,
								message: "Error reading directory contents.",
							});
							return;
						}
						let promesasLectura = [];
						let items = {};
						archivos.forEach((item) => {
							let rutaArchivo = `${root}/${item}`;
							rutaArchivo = rutaArchivo.replace(/\/\//g, "/");
							promesasLectura.push(
								new Promise((resolve, reject) => {
									fs.stat(
										_parseRoot(rutaArchivo),
										(err, stats) => {
											if (err) {
												reject(err);
												return;
											}

											if (stats.isFile()) {
												items[
													Object.keys(items).length
												] = {
													root: rutaArchivo,
													type: 1,
												};
												resolve("");
											} else if (stats.isDirectory()) {
												items[
													Object.keys(items).length
												] = {
													root: rutaArchivo,
													type: 2,
												};
												resolve("");
											} else {
												items[
													Object.keys(items).length
												] = {
													root: rutaArchivo,
													type: 0,
												};
												resolve("");
											}
										}
									);
								})
							);
						});
						Promise.all(promesasLectura)
							.then(() => {
								resolve(items);
							})
							.catch((error) => {
								reject({
									error: error,
									message:
										"Error reading directory contents.",
								});
							});
					});
				} else
					reject({
						error: new Error(
							`The directory [${dir}] does not exist.`
						),
						message: "Error reading directory contents.",
					});
			})
			.catch((e) => {
				reject({
					error: e,
					message: "Error reading directory contents.",
				});
			});
	});
};

const _createDir = (dir) => {
	return new Promise((resolve, reject) => {
		if (typeof dir != "string" || dir == "") {
			reject({
				error: new Error(
					"_createDir requires the directory path to be specified in [string] format."
				),
				message: "No directory name specified.",
			});
			return;
		}
		fs.access(_parseRoot(dir), (error) => {
			if (error) {
				fs.mkdir(`${dir}`, { recursive: true }, (err) => {
					if (err)
						reject({
							error: err,
							message: "The directory could not be created.",
						});
					else resolve(true);
				});
			} else resolve(true);
		});
	});
};

const _writeFile = (dir, name, data) => {
	return new Promise((resolve, reject) => {
		if (
			typeof dir != "string" ||
			dir == "" ||
			typeof name != "string" ||
			name == ""
		) {
			reject({
				error: new Error(
					"_writeFile requires the file path to be specified in [string] format."
				),
				message: "No file path specified.",
			});
			return;
		}
		_createDir(dir)
			.then(() => {
				fs.writeFile(_parseRoot(`${dir}/${name}`), data, (error) => {
					if (error)
						reject({
							error: error,
							message: "Error writing file content.",
						});
					else resolve(true);
				});
			})
			.catch((e) => {
				reject({
					error: e,
					message: "Error writing file content.",
				});
			});
	});
};

const _readFile = (file) => {
	return new Promise((resolve, reject) => {
		if (typeof file != "string" || file == "") {
			reject({
				error: new Error(
					"_readFile requires the file path to be specified in [string] format."
				),
				message: "No file path specified.",
			});
			return;
		}
		_existsFile(file)
			.then((ex) => {
				if (ex)
					fs.readFile(_parseRoot(file), "utf8", (error, data) => {
						if (error)
							reject({
								error: error,
								message: "Error reading file content.",
							});
						else resolve(data);
					});
				else
					reject({
						error: new Error(`The file [${file}] does not exist.`),
						message: "Error reading file content.",
					});
			})
			.catch((e) => {
				reject({
					error: e,
					message: "Error reading file content.",
				});
			});
	});
};

const _itemType = (root) => {
	return new Promise((resolve, reject) => {
		fs.stat(_parseRoot(root), (err, stats) => {
			if (err) {
				reject(err);
				return;
			}

			if (stats.isFile()) resolve(1);
			else if (stats.isDirectory()) resolve(2);
			else resolve(0);
		});
	});
};

const _deleteFile = (file) => {
	return new Promise((resolve, reject) => {
		if (typeof file != "string" || file == "") {
			reject({
				error: new Error(
					"_readFile requires the file path to be specified in [string] format."
				),
				message: "No file path specified.",
			});
			return;
		}
		_existsFile(file)
			.then((ex) => {
				if (ex) {
					_itemType(file)
						.then((type) => {
							if (type == 1) {
								fs.unlink(_parseRoot(file), (error) => {
									if (error)
										reject({
											error: error,
											message: "Error deleting file.",
										});
									else resolve(true);
								});
							} else
								reject({
									error: new Error(
										`It was not possible to delete because [${file}] is not a file.`
									),
									message: "Error deleting file.",
								});
						})
						.catch((e) => {
							reject({
								error: e,
								message: "Error deleting file.",
							});
						});
				} else
					reject({
						error: new Error(`The file [${file}] does not exist`),
						message: "Error deleting file.",
					});
			})
			.catch((e) => {
				reject({
					error: e,
					message: "Error deleting file.",
				});
			});
	});
};

//$--------------------------------------------------------------------------Funciones Front-End
const existsDir = (dir) => {
	_existsDir(dir)
		.then((ex) => {
			if (ex)
				win.log.success({
					icon: "folder_open",
					title: "Folder",
					content: `The folder exists.`,
					advanced: _parseRoot(dir),
				});
			else
				win.log.warning({
					icon: "folder_open",
					title: "Folder",
					content: `The folder not exists.`,
					advanced: _parseRoot(dir),
				});
			win.send("folder-exists", ex);
		})
		.catch((e) => {
			win.log.error({
				icon: "folder_open",
				title: "Folder",
				content: e.message,
				advanced: e.error,
			});
			win.send("folder-exists", false);
		});
};

const existsFile = (dir) => {
	_existsFile(dir)
		.then((ex) => {
			if (ex)
				win.log.success({
					icon: "draft",
					title: "File",
					content: `The file exists.`,
					advanced: _parseRoot(dir),
				});
			else
				win.log.warning({
					icon: "draft",
					title: "File",
					content: `The file not exists.`,
					advanced: _parseRoot(dir),
				});
			win.send("file-exists", ex);
		})
		.catch((e) => {
			win.log.error({
				icon: "draft",
				title: "File",
				content: e.message,
				advanced: e.error,
			});
			win.send("file-exists", false);
		});
};

const listDir = (dir) => {
	_listDir(dir)
		.then((items) => {
			win.log.success({
				icon: "folder_open",
				title: "Folder",
				content: `The contents have been successfully listed.`,
				advanced: _parseRoot(dir),
			});
			win.send("folder-list", items);
		})
		.catch((e) => {
			win.log.error({
				icon: "folder_open",
				title: "Folder",
				content: e.message,
				advanced: e.error,
			});
			win.send("folder-list", null);
		});
};

const createDir = (dir) => {
	_createDir(dir)
		.then(() => {
			win.log.success({
				icon: "folder_open",
				title: "Folder",
				content: `The directory was created successfully.`,
				advanced: _parseRoot(dir),
			});
			win.send("folder-create", true);
		})
		.catch((e) => {
			win.log.error({
				icon: "folder_open",
				title: "Folder",
				content: e.message,
				advanced: e.error,
			});
			win.send("folder-create", false);
		});
};

const writeFile = (dir, name, data) => {
	_writeFile(dir, name, data)
		.then(() => {
			win.log.success({
				icon: "edit_document",
				title: "File write",
				content: `The file is written correctly.`,
				advanced: _parseRoot(dir),
			});
			win.send("file-write", true);
		})
		.catch((e) => {
			win.log.error({
				icon: "edit_document",
				title: "File write",
				content: e.message,
				advanced: e.error,
			});
			win.send("file-write", false);
		});
};

const readFile = (file) => {
	_readFile(file)
		.then((data) => {
			win.log.success({
				icon: "description",
				title: "File read",
				content: `The contents of the file were read correctly.`,
				advanced: _parseRoot(file),
			});
			win.send("file-read", data);
		})
		.catch((e) => {
			win.log.error({
				icon: "description",
				title: "File read",
				content: e.message,
				advanced: e.error,
			});
			win.send("file-read", null);
		});
};

const deleteFile = (file) => {
	_deleteFile(file)
		.then(() => {
			win.log.success({
				icon: "scan_delete",
				title: "File delete",
				content: `The file was deleted successfully.`,
				advanced: _parseRoot(file),
			});
			win.send("file-delete", data);
		})
		.catch((e) => {
			win.log.error({
				icon: "scan_delete",
				title: "File delete",
				content: e.message,
				advanced: e.error,
			});
			win.send("file-delete", null);
		});
};

//export--------------------------------------------------------------------------> Desde la GUI
const listeners = () => {
	win = global.window.utilities;

	win.on("folder-exists", (e, data) => existsDir(data));
	win.on("folder-list", (e, data) => listDir(data));
	win.on("folder-create", (e, data) => createDir(data));

	win.on("file-exists", (e, data) => existsFile(data));
	win.on("file-write", (e, data) =>
		writeFile(data.dir, data.name, data.data)
	);
	win.on("file-read", (e, data) => readFile(data));
	win.on("file-delete", (e, data) => deleteFile(data));
};

//export-------------------------------------------------------------------->Funciones expuestas
const utilities = {
	root: { parse: _parseRoot },
	dir: {
		exists: _existsDir,
		list: _listDir,
		create: _createDir,
	},
	exists: _existsFile,
	write: _writeFile,
	read: _readFile,
	type: _itemType,
	delete: _deleteFile,
};
module.exports = {
	listeners,
	utilities,
};
