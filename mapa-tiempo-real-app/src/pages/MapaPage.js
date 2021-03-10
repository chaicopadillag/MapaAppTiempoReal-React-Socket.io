import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import useMapBox from '../hooks/useMapBox';

const puntoInicial = {
	lng: -77.0058,
	lat: -12.0058,
	zoom: 14.7279,
};

const MapaPage = () => {
	const { socket } = useContext(SocketContext);
	const { coors, useRefMapa, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicionMarcador } = useMapBox(puntoInicial);

	useEffect(() => {
		socket.on('marcadores-activos', (marcadores) => {
			for (const id of Object.keys(marcadores)) {
				agregarMarcador(marcadores[id], id);
			}
		});
	}, [socket, agregarMarcador]);

	useEffect(() => {
		nuevoMarcador$.subscribe((marcador) => {
			socket.emit('crear-marcador', marcador);
		});
	}, [nuevoMarcador$, socket]);

	useEffect(() => {
		movimientoMarcador$.subscribe((marcador) => {
			socket.emit('actualizar-marcador', marcador);
		});
	}, [socket, movimientoMarcador$]);

	useEffect(() => {
		socket.on('actualizar-posicion', (marcador) => {
			actualizarPosicionMarcador(marcador);
		});
	}, [socket, actualizarPosicionMarcador]);

	useEffect(() => {
		socket.on('nuevo-marcador', (marcador) => {
			agregarMarcador(marcador, marcador.id);
		});
	}, [socket, agregarMarcador]);

	return (
		<>
			<div className="info">
				Lng: {coors.lng} | Lat: {coors.lat} | Zoom: {coors.zoom}
			</div>
			<div ref={useRefMapa} className="mapa-container" />
		</>
	);
};

export default MapaPage;
