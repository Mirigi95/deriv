import React, { useState } from 'react';

const Tick = () => {
  const [apiToken, setApiToken] = useState('');
  const [symbol, setSymbol] = useState('');
  const [tick, setTick] = useState(null);

  const handleGetTick = () => {
    const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
    ws.onopen = () => {
      ws.send(JSON.stringify({ authorize: apiToken }));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.authorize) {
        ws.send(JSON.stringify({ ticks: symbol }));
      } else if (data.tick) {
        setTick(data.tick);
        ws.close();
      }
    };
  };

  return (
    <div>
      <h2>Tick</h2>
      <input
        type="text"
        placeholder="API Token"
        value={apiToken}
        onChange={(e) => setApiToken(e.target.value)}
      />
      <input
        type="text"
        placeholder="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={handleGetTick}>Get Tick</button>
      {tick && <pre>{JSON.stringify(tick, null, 2)}</pre>}
    </div>
  );
};

export default Tick;
