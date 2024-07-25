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

module.exports = {
	padS,
	timestamp,
};
