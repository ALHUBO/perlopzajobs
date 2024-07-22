// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

// const env = global.env;

var reset = null;

contextBridge.exposeInMainWorld("app", {
	on: (flag, callback) => {
		ipcRenderer.removeAllListeners(flag);
		ipcRenderer.on(flag, (event, data) => callback(data));
	},
	send: (flag, data) => ipcRenderer.send(flag, data),
	toMiddleware: (data) => {
		if (reset !== null) clearTimeout(reset);
		reset = setTimeout(() => {
			document.querySelector("#fromMiddleware").innerHTML = "No content";
		}, 2000);
		document.querySelector("#fromMiddleware").innerHTML =
			"Modified from Middleware";
	},
});
