const net = require('net');
// 检测端口是否被占用
module.exports = async function portIsOccupied (port) {
 // 创建服务并监听该端口
 return new Promise(function (resolve, reject) {
	var server = net.createServer().listen(port)
	server.on('listening', function () { // 执行这块代码说明端口未被占用
		server.close()
		resolve(true)
	})
	server.on('error', function (err) {
		if (err.code === 'EADDRINUSE') { // 端口已经被使用
			resolve(false)
		}
		reject()
	})
 })
 
}