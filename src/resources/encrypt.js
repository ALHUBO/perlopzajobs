const crypto = require("crypto");

//!------------------------------------------------------------------------
//!                               RSA
//!------------------------------------------------------------------------

//TODO----------------------------[ Generador de Claves ]--------------------------
function RSAcreateKeys() {
	// Generar un par de claves RSA
	const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
		modulusLength: 2048,
		publicKeyEncoding: {
			type: "spki",
			format: "pem",
		},
		privateKeyEncoding: {
			type: "pkcs8",
			format: "pem",
		},
	});
	return [publicKey, privateKey];
}

//TODO-----------------------------[ Encriptar Mensaje ]---------------------------------
function RSAEncrypt(sms, publicKey) {
	return crypto.publicEncrypt(publicKey, Buffer.from(sms, "utf-8"));
}

//TODO-------------------------------------[ Desencriptar Mensaje ]---------------------
function RSADencrypt(sms, privateKey) {
	return crypto.privateDecrypt(privateKey, sms).toString("utf-8");
}

//!------------------------------------------------------------------------
//!                               Cypher
//!------------------------------------------------------------------------

//TODO-----------------------[ Genera un cifrador a partir de una contraseña ]---------------------------
function genCifer(password) {
	return new Promise((resolve, reject) => {
		let iteraciones = 1;

		const sal = Ascii2Pass16(password); //crypto.randomBytes(16);
		for (let i = 0; i < sal.length; i++) {
			iteraciones *= sal[i];
			while (iteraciones > 1000000) {
				iteraciones *= 0.1;
			}
			iteraciones = Math.floor(iteraciones);
		}

		const longitudClave = 32;
		const algoritmoHash = "sha256";
		crypto.pbkdf2(
			password,
			sal,
			iteraciones,
			longitudClave,
			algoritmoHash,
			(err, claveDerivada) => {
				if (err) {
					reject(err);
					return;
				}
				resolve({ deriv: claveDerivada, sal });
			}
		);
	});
}

//TODO-------------------------[ Convierte una contraseña ASCII a Un buffer de 16 bytes ]---------------------------------
function Ascii2Pass16(txt) {
	let num = [];
	let buff = [];
	while (buff.length < 16) {
		for (let i in txt) {
			num.push(parseInt(txt.charCodeAt(i)));
		}
		buff = Buffer.from(num, "hex");
	}
	let sums = 0;
	for (let i = 16; i < buff.length; i++) {
		sums += buff[i];
	}

	let buffFin = [];
	for (let i = 0; i < 16; i++) {
		let smus = sums;
		buffFin.push(buff[i]);
		while (smus > 0) {
			if (buffFin[i] + smus > 255) {
				smus -= 255 - buffFin[i];
				buffFin[i] = 0;
			} else {
				buffFin[i] += smus;
				smus = 0;
			}
		}
	}

	return Buffer.from(buffFin, "hex");
}

//TODO--------------------------------------[ Cifra un mensaje ]--------------------------------------------
function CiferSMS(sms, cifer) {
	const mcipher = crypto.createCipheriv(
		"aes-256-cbc",
		cifer.deriv,
		Buffer.from(cifer.sal, "hex")
	);
	let datosEncriptados = mcipher.update(sms, "utf-8", "hex");
	datosEncriptados += mcipher.final("hex");
	return datosEncriptados.toUpperCase();
}

//TODO------------------------------[Decifra un mensaje ]------------------------------------
function DeciferSMS(sms, cifer) {
	const decipher = crypto.createDecipheriv(
		"aes-256-cbc",
		cifer.deriv,
		Buffer.from(cifer.sal, "hex")
	);
	let datosDescifrados = "";
	try {
		datosDescifrados = decipher.update(sms, "hex", "utf-8");
		datosDescifrados += decipher.final("utf-8");
	} catch (e) {
		console.log(e);
	}
	return datosDescifrados;
}

//!------------------------------------------------------------------------
//!                               Cryptographer
//!------------------------------------------------------------------------
function ASCII2sha256(texto) {
	const hash = crypto.createHash("sha256");
	hash.update(texto);
	return hash.digest("hex").toUpperCase();
}

//!------------------------------------------------------------------------
//!                               Cypher
//!------------------------------------------------------------------------

//TODO-----------------------------[ Generador Key Publica ALHUBO-Softwares ]--------------------------------
function genKeyPublic() {
	const kpu = crypto.randomBytes(6);
	let str = "";
	for (let i = 0; i < kpu.length; i++) {
		str += kpu[i].toString(16).padStart(2, "0").toUpperCase();
		if (i < kpu.length - 1) str += "-";
	}
	return str;
}

//!------------------------------------------------------------------------
//!                               Exportar modulos
//!------------------------------------------------------------------------
module.exports = {
	RSAcreateKeys,
	RSAEncrypt,
	RSADencrypt,
	genCifer,
	CiferSMS,
	DeciferSMS,
	ASCII2sha256,
	genKeyPublic,
};

//!------------------------------------------------------------------------
//!                               Tester
//!------------------------------------------------------------------------
// console.log('Generadno RSA');
// const ky=RSAcreateKeys();
// console.log(ky);

// let sms='Hola ALHUBO!!!';
// console.log(`\nMensaje Original: ${sms}`);
// sms=RSAEncrypt(sms,ky[0]);
// console.log(`Mensaje Encrypt (RSA): ${sms}`);
// sms=RSADencrypt(sms,ky[1]);
// console.log(`Mensaje Desencrypt (RSA): ${sms}`);

// console.log('\nKeyPublic: ');
// console.log(genKeyPublic());

// console.log('\nGenerando Cyfer');
// genCifer('!SPRskLunK27').then((dt)=>{
// 	console.log(dt);
// 	sms=CiferSMS(ky[0],dt);
// 	console.log('SMS cyfer: ')
// 	console.log(sms);
// 	sms=DeciferSMS(sms,dt);
// 	console.log('SMS decyfer: ')
// 	console.log(sms);
// }).catch((e)=>{
// 	console.log(`Error en el cyfer: ${e}`);

// });
