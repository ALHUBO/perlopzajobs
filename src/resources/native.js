const padS = (num, length, filler) => {
	return num.toString().padStart(length, filler);
};

const timestamp = () => {
	let date = new Date();
	return (
		date.getFullYear() +
		"-" +
		padS(date.getMonth() + 1, 2, "0") +
		"-" +
		padS(date.getDate(), 2, "0") +
		" " +
		padS(date.getHours(), 2, "0") +
		":" +
		padS(date.getMinutes(), 2, "0") +
		":" +
		padS(date.getSeconds(), 2, "0")
	);
};

const hex2bin = (hex) => {
	// Asegúrate de que el hex esté en mayúsculas
	hex = hex.toUpperCase();

	// Convierte hex a un número entero
	const decimal = parseInt(hex, 16);

	// Convierte el número entero a binario y elimina el prefijo '0b'
	return decimal.toString(2).padStart(4, "0");
};

const hex2codexBin = (hex) => {
	let neocontent = "";
	let bina = "";
	for (let i in hex) {
		if (bina == "") bina = hex2bin(hex[i]);
		else {
			neocontent += String.fromCharCode(
				parseInt(`${bina}${hex2bin(hex[i])}`, 2)
			);
			bina = "";
		}
	}
	return neocontent;
};

const codexBin2hex = (codex) => {
	let neocontent = "";
	for (let i in codex) {
		let bins = codex[i].charCodeAt(0).toString(2).padStart(8, "0");
		bins = [bins.substring(0, 4), bins.substring(4)];

		neocontent += `${parseInt(bins[0], 2)
			.toString(16)
			.toUpperCase()}${parseInt(bins[1], 2).toString(16).toUpperCase()}`;
	}
	return neocontent;
};

const isPort = (port) => {
	return (
		!isNaN(parseInt(port)) && parseInt(port) >= 0 && parseInt(port) <= 65535
	);
};

const isIP = (IP) => {
	const expReg =
		/^((25[0-5]{1}|2[0-4][0-9]|1[0-9]{2}|[0-9]?[0-9])\.){3}(25[0-5]{1}|2[0-4][0-9]|1[0-9]{2}|[0-9]?[0-9])$/;
	return expReg.test(IP);
};

module.exports = {
	padS,
	timestamp,
	hex2codexBin,
	codexBin2hex,
	isPort,
	isIP,
};
