
const os = require('os');
const sleep = async (time) => {
	await new Promise((resolve) => {
		setTimeout(resolve, time * 1000)
	})
}

/**
 * 获取当前机器的ip地址
 */
function getIpAddress() {
	const ifaces = os.networkInterfaces();
	for (var dev in ifaces) {
		const iface = ifaces[dev];
		for (let i = 0; i < iface.length; i++) {
			let { family, address, internal } = iface[i];
			if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
				return address
			}
		}
	}
}
module.exports = {
	sleep,
	getIpAddress
} 