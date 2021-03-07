const Marcadores = require('./marcadores');

class Sockets {
	constructor(io) {
		this.io = io;
		this.marcadores = new Marcadores();
		this.socketEvents();
	}

	socketEvents() {
		// On connection
		this.io.on('connection', (socket) => {
			console.log('cliente conectado');

			// TODO: marcadores activos
			socket.emit('marcadores-activos', this.marcadores.activos);
			// FIXME: marcador nuevo

			socket.on('crear-marcador', (marcador) => {
				this.marcadores.agregarMarcador(marcador);
				socket.broadcast.emit('nuevo-marcador', marcador);
			});

			// TODO: actualizar Marcador

			socket.on('actualizar-marcador', (marcador) => {
				this.marcadores.actualizarMarcador(marcador);
				socket.broadcast.emit('actualizar-posicion', marcador);
			});
		});
	}
}

module.exports = Sockets;
