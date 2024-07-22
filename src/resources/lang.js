const fs = require("fs");
const path = require("node:path");
// Ruta del directorio que quieres listar
function loader() {
	var directorio = path.join(__dirname, "../lang");
	return new Promise(function (resolve, reject) {
		fs.readdir(directorio, function (error, archivos) {
			if (error) {
				reject(error);
				return;
			}
			var promesasLectura = [];
			var langs = {};
			archivos.forEach(function (archivo) {
				if (archivo.endsWith(".json")) {
					var rutaArchivo_1 = ""
						.concat(directorio, "/")
						.concat(archivo);
					promesasLectura.push(
						new Promise(function (resolve, reject) {
							fs.readFile(
								rutaArchivo_1,
								"utf8",
								function (error, datos) {
									if (error) {
										reject(error);
										return;
									}
									try {
										var objeto = JSON.parse(datos);
										langs[
											archivo.substring(
												0,
												archivo.length - 5
											)
										] = objeto;
										resolve("");
									} catch (error) {
										reject(error);
									}
								}
							);
						})
					);
				}
			});
			Promise.all(promesasLectura)
				.then(function () {
					var langItem = {};
					if (typeof langs["en"] != "undefined") {
						var i = 0;
						langItem["en"] = {};
						for (var e in langs["en"].data) {
							langItem["en"][e] = i++;
						}
						for (var e in langs) {
							if (e != "en") {
								langItem[e] = {};
								for (var k in langs[e].data) {
									var n = langItem["en"][k];
									if (typeof n != "undefined") {
										langItem[e][n] = langs[e].data[k];
									}
								}
							}
						}
					}
					if (typeof langItem["en"] != "undefined") resolve(langItem);
					else {
						var e = new Error("No Existe el idioma base [en.json]");
						reject(e);
					}
				})
				.catch(function (error) {
					reject(error);
				});
		});
	});
}
module.exports = {
	loader,
};
