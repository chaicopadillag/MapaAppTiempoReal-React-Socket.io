import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Subject } from 'rxjs';
import mapboxgl from 'mapbox-gl';

//eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhaWNvcGFkaWxsYWciLCJhIjoiY2tseTU1N3pqMDBvNDJubzlsZm1jOWplcCJ9.luBsL5lsc18_ItnotezsHg';

const useMapBox = (puntoInicial) => {
	const [coors, setCoors] = useState(puntoInicial);
	const mapaDiv = useRef();
	const mapa = useRef();
	const marcadores = useRef({});

	const useRefMapa = useCallback((divMapa) => {
		mapaDiv.current = divMapa;
	}, []);

	const movimientoMarcador = useRef(new Subject());
	const nuevoMarcador = useRef(new Subject());

	const agregarMarcador = useCallback((evento, id) => {
		const { lng, lat } = evento.lngLat || evento;
		const marcador = new mapboxgl.Marker();
		marcador.id = id || uuid.v4();
		marcador.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);
		marcadores.current[marcador.id] = marcador;

		if (!id) {
			nuevoMarcador.current.next({
				id: marcador.id,
				lng,
				lat,
			});
		}
		// event movimiento de marcador
		marcador.on('drag', ({ target }) => {
			const { id } = target;
			const { lng, lat } = target.getLngLat();
			movimientoMarcador.current.next({
				id,
				lng,
				lat,
			});
		});
	}, []);

	const actualizarPosicionMarcador = useCallback(({ id, lng, lat }) => {
		marcadores.current[id].setLngLat([lng, lat]);
	}, []);

	useEffect(() => {
		mapa.current = new mapboxgl.Map({
			container: mapaDiv.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [puntoInicial.lng, puntoInicial.lat],
			zoom: puntoInicial.zoom,
		});
	}, [puntoInicial]);

	useEffect(() => {
		mapa.current?.on('move', () => {
			const { lng, lat } = mapa.current.getCenter();
			setCoors({
				lng: lng.toFixed(4),
				lat: lat.toFixed(4),
				zoom: mapa.current.getZoom().toFixed(2),
			});
		});
	}, []);

	// TODO: agregar marcado
	useEffect(() => {
		mapa.current?.on('click', agregarMarcador);
	}, [agregarMarcador]);

	return {
		agregarMarcador,
		coors,
		useRefMapa,
		nuevoMarcador$: nuevoMarcador.current,
		movimientoMarcador$: movimientoMarcador.current,
		actualizarPosicionMarcador,
	};
};

export default useMapBox;
