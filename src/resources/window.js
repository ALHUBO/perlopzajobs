/**
 * !--------------------------------------------------------------------------------------------
 * !					Back-End
 * var					Base para ALHUBOSoft
 * import				Todo lo necesario para crear una ventana del programa.
 * $					Autor: ALHUBO [Alejandro Huerta Bolaños]
 * %					V1.0 [ ２０２４年4月5日 - ]
 * ?					https://github.com/ALHUBO/ALHUBOSoft
 * !--------------------------------------------------------------------------------------------
 * **/

//import----------------------------------------------------------------> Necesario Electron App
const {
	app,
	BrowserWindow,
	ipcMain,
	nativeTheme,
	net,
	protocol,
	screen,
} = require("electron");
const os = require("os");
const { pathToFileURL } = require("url");

if (require("electron-squirrel-startup")) app.quit();

const path = require("path");

//var>-------------------------------------------------------------------------$ Globales Window
var winapp = null; //?---Objeto de la Window

var wind = {
	dimention: {
		w: 0,
		h: 0,
	},
	environment: "development", //?---Tipo de aplicacion [ development | production ]
	devtools: true, //?---Show dev tools?
	UIMode: "system", //?---Tipo de renderizado [ dark | light | system ]
}; //?---Propiedades de la Window

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

var access = null;

//%------------------------------------------------------------------------------------Utilities
const config = {
	get: (which) => {
		if (which === "db") return backConfig.db;
		if (which === "udp") return backConfig.udp;
		if (which === "ws") return backConfig.ws;
		if (which === "ip") return backConfig.ip;
		return null;
	},

	set: (prop, data) => {
		backConfig[prop] = data;
	},
};

/**
 * %--------------------------------[ send(void):void ]
 * !---Exportado
 * ?---Recibe un evento de GUI y ejecuta una funcion que recibe (event,data)
 * @param {string} channel(undefined) Canal de comunicación
 * @param {any} data(undefined) Informacion que se enviará a GUI
 * return void
 **/
const send = (channel, data) => {
	winapp.webContents.send(channel, data);
};
/**
 * %--------------------------------[ on(void):void ]
 * !---Exportado
 * ?---Recibe un evento de GUI y ejecuta una funcion que recibe (event,data)
 * @param {string} channel(undefined) Canal de comunicación
 * @param {function} fnc(undefined) Funcion a ejecutar fnc(event:string,data:any-<Información recibida de la GUI)
 * return void
 **/
const on = (channel, fnc) => {
	ipcMain.on(channel, fnc);
};

/**
 * %--------------------------------[ build(destructured-object):Promise ]
 * !---Exportado
 * ?---Registra protocolos, crea ventana y asigna eventos.
 * @param {string} environment("development") Tipo de environment [ development | production ]
 * return Promise->then(flag:object-void-<Success)
 **/
const build = ({ environment = "development", req_access }) => {
	access = req_access;

	return new Promise((resolve, reject) => {
		try {
			wind.environment = environment; //?--- Establece el environment

			//%------------------------------< Registra protocolo de comunicación app://
			if (wind.environment == "production")
				//?---Solo para producción
				protocol.registerSchemesAsPrivileged([
					{
						//$-------------------> Se puede cambiar por cualquier cosa no reservada
						scheme: "app", //?---protocolo comunicacion http:// app:// etc.
						privileges: {
							standard: true,
							secure: true,
							supportFetchAPI: true,
						},
					},
				]);

			//%------------------------------< Inicializa la ventana
			app.whenReady().then(() => {
				//?---Cuando el OS cargue completamente la app

				if (wind.environment == "production")
					protocol.handle("app", (req) => {
						//?---Responde solicitudes locales app://
						//$-------------------> app://[host][pathname]
						let { host, pathname } = new URL(req.url);

						//$-------------------> Peticiones a app://alhubo
						if (host === "alhubo") {
							//$---------------->Petición a la raiz app://alhubo
							if (pathname === "/") pathname = "index.html";

							//$---------------->Resolución de Rutas
							const pathToServe = path.join(
								__dirname,
								"GUI",
								pathname
							);
							const relativePath = path.relative(
								__dirname,
								pathToServe
							);

							//$---------------->No intenta acceder a algo sensible
							const isSafe =
								relativePath &&
								!relativePath.startsWith("..") &&
								!path.isAbsolute(relativePath);
							if (!isSafe)
								//$------------------->Retorna error de recurso
								return new Response(
									"you cannot access this resource",
									{
										status: 403,
										headers: {
											"content-type": "text/html",
										},
									}
								);
							//$------------------->Retorna el contenido del archivo
							return net.fetch(
								pathToFileURL(pathToServe).toString()
							);
						}
						//$-----------------------> Peticiones a app://alhubo.api
						else if (host === "alhubo.api") {
							return net.fetch(
								"https://api.alhubo.com/" + pathname,
								{
									method: req.method,
									headers: req.headers,
									body: req.body,
								}
							);
						}
					});

				//%------------------------------< Carga la GUI
				createWindow();

				//%------------------------------< Eventos importantes
				listeners();

				//?---On OS X it's common to re-create a window in the app when the
				//?---dock icon is clicked and there are no other windows open.
				app.on("activate", () => {
					if (BrowserWindow.getAllWindows().length === 0) {
						createWindow();
						listeners();
					}
				});
				resolve({});
			});

			//%------------------------------< Para distinto a MacOS
			//?---Si se cierran todas las ventanas termina el proceso
			app.on("window-all-closed", () => {
				if (process.platform !== "darwin") app.quit();
			});
		} catch (e) {
			reject(e);
		}
	});
};

//!---------------------------[ Contructor de Window ]---------------------------
/**
 * %--------------------------------[ createWindow(void):void ]
 * !---No exportado
 * ?---Crea el objeto de la Window y carga su pagina inicial
 * return void
 **/
const createWindow = () => {
	//$-------------------> Crea el objeto Window
	winapp = new BrowserWindow({
		width: 800, //?---Ancho inicial
		height: 600, //?---Alto inicial
		frame: false, //?---Sin bordes
		webPreferences: {
			preload: path.join(__dirname, "middleware.js"), //?---Codigo entre el Back-End y el Front-End
		},
	});
};

const log = {
	default: ({
		icon = "",
		title = "",
		content = "",
		advanced = "",
		action = "",
	}) => {
		winapp.webContents.send("console-log", {
			type: "default",
			icon,
			title,
			content,
			advanced,
			action,
		});
	},
	success: ({
		icon = "",
		title = "",
		content = "",
		advanced = "",
		action = "",
	}) => {
		winapp.webContents.send("console-log", {
			type: "success",
			icon,
			title,
			content,
			advanced,
			action,
		});
	},
	info: ({
		icon = "",
		title = "",
		content = "",
		advanced = "",
		action = "",
	}) => {
		winapp.webContents.send("console-log", {
			type: "info",
			icon,
			title,
			content,
			advanced,
			action,
		});
	},
	warning: ({
		icon = "",
		title = "",
		content = "",
		advanced = "",
		action = "",
	}) => {
		winapp.webContents.send("console-log", {
			type: "warning",
			icon,
			title,
			content,
			advanced,
			action,
		});
	},
	error: ({
		icon = "",
		title = "",
		content = "",
		advanced = "",
		action = "",
	}) => {
		winapp.webContents.send("console-log", {
			type: "error",
			icon,
			title,
			content,
			advanced,
			action,
		});
	},
};

const _nicGet = () => {
	const networkInterfaces = os.networkInterfaces();
	const int = {};
	for (const [name, interfaces] of Object.entries(networkInterfaces)) {
		for (const iface of interfaces) {
			if ("IPv4" !== iface.family || iface.internal !== false) {
				// ignorar IPv6 y interfaces internas (localhost)
				continue;
			}
			int[name] = iface.address;
		}
	}
	send("nic-get", int);
};
const _screenSize = () => {
	const primaryDisplay = screen.getPrimaryDisplay();
	const { width, height } = primaryDisplay.workAreaSize;
	wind.dimention.h = height;
	wind.dimention.w = width;
	return { width, height };
};

/**
 * %--------------------------------[ GUI_Call_Window(void):void ]
 * !---No Exportado
 * ?---Asigna eventos que se originan en la GUI y se envian a Window
 * return void
 **/
const GUI_Call_Window = () => {
	//$-----------------------> GUI llama a cerrar la aplicación
	on("app-exit", (e, data) => {
		app.quit();
	});

	//$-----------------------> GUI obtiene ancho y alto de la window
	on("app-screen-size", (e, data) => {
		send("app-screen-size", _screenSize());
	});

	//$-----------------------> GUI llama para maximizar o restaurar window
	on("app-maximize", (e, data) => {
		if (data) winapp.maximize();
		else winapp.unmaximize();
	});

	//$-----------------------> GUI llama para minimazar window
	on("app-minimize", (e, data) => {
		winapp.minimize();
	});

	//$-----------------------> GUI llama para alternar entre full-screen y normal
	on("app-fullscreen", (e, data) => {
		winapp.setFullScreen(data);
	});

	//$-----------------------> GUI llama para obtener tipo tema actual
	on("nativetheme-get", (e, data) => {
		wind.UIMode = data;
		send("nativetheme-update", {
			type: wind.UIMode,
			dark: nativeTheme.shouldUseDarkColors,
		});
	});

	on("log-default", (e, data) => {
		log.default(data);
	});
	on("log-info", (e, data) => {
		log.info(data);
	});
	on("log-error", (e, data) => {
		log.error(data);
	});
	on("log-success", (e, data) => {
		log.success(data);
	});
	on("log-warning", (e, data) => {
		log.warning(data);
	});

	on("nic-get", (e, data) => _nicGet());

	on("app-config", (e, data) => {
		if (data) {
			//save
		} else {
			//get
			access.exists().then((r) => {
				backConfig.access.exists = r;
				send("app-config", { ...backConfig });
			});
		}
	});
};

/**
 * %--------------------------------[ Window_Call_GUI(void):void ]
 * !---No exportado
 * ?---Asigna eventos que se originan en la Window y se envian a GUI
 * return void
 **/
const Window_Call_GUI = () => {
	//$-----------------------> La window envia a la GUI que se maximizo
	winapp.on("maximize", () => {
		let wins = winapp.getBounds();
		wind.dimention.h = wins.height;
		wind.dimention.w = wins.width;
		send("app-screen-maximize", true);
	});

	//$-----------------------> La window envia a la GUI que salio de maximizar
	winapp.on("unmaximize", () => {
		send("app-screen-maximize", false);
	});

	//$-----------------------> La window envia a la GUI que se redimensiono
	winapp.on("resize", () => {
		let wins = winapp.getBounds();
		if (wind.dimention.h > wins.height || wind.dimention.w > wins.width)
			send("app-screen-maximize", false);
	});

	//$-----------------------> La window envia a la GUI que entro en full-screen
	winapp.on("enter-full-screen", () => {
		send("app-screen-full", true);
	});

	//$-----------------------> La window envia a la GUI que salio de full-screen
	winapp.on("leave-full-screen", () => {
		send("app-screen-full", false);
	});

	//$-----------------------> La window envia a la GUI que cambio tema
	nativeTheme.on("updated", () => {
		send("nativetheme-update", {
			type: wind.UIMode,
			dark: nativeTheme.shouldUseDarkColors,
		});
	});
};

const listeners = () => {
	GUI_Call_Window();
	Window_Call_GUI();
};

const load = () => {
	//$-------------------> Peticion inicial para cargar la GUI
	if (wind.environment == "development") {
		winapp.loadURL("http://localhost:3000"); //?---localhost next

		if (wind.devtools) winapp.webContents.openDevTools(); //?---abre las herramientas de desarrollador
	} else if (wind.environment == "production")
		winapp.loadURL("app://alhubo/"); //?---Archivo local a la app
};

const regExp = {
	pass: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{12,}$/,
};

const utilities = {
	on,
	send,
	log,
	config,
	regExp,
	screenSize: _screenSize,
};

//export------------------------> Funciones disponible hacia el exterior
module.exports = {
	build, //?---Contruye la Window de la aplicación
	load, //?---Carga la GUI
	utilities,
};
