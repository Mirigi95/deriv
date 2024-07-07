import { useEffect, useState } from 'react';

const useDerivWebSocket = (apiToken, symbol) => {
  const [tick, setTick] = useState(null);
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');

    socket.onopen = () => {
      socket.send(JSON.stringify({ authorize: apiToken }));
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.error) {
        setError(response.error.message);
      }

      if (response.msg_type === 'authorize') {
        socket.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
      }

      if (response.msg_type === 'tick') {
        setTick(response.tick);
      }
    };

    socket.onerror = (event) => {
      setError(event.message);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [apiToken, symbol]);

  return { tick, error, ws };
};

export default useDerivWebSocket;
