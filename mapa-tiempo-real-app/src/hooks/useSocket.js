import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (serverPath) => {
	const [online, setOnline] = useState(false);

	const socket = useMemo(
		() =>
			io.connect(serverPath, {
				transport: ['websocket'],
			}),
		[serverPath]
	);

	useEffect(() => {
		socket.on('connect', () => {
			setOnline(true);
		});
		socket.on('disconnect', () => {
			setOnline(false);
		});
	}, [socket]);

	return { socket, online };
};
