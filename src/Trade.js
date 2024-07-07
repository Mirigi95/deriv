import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import useDerivWebSocket from './Websocket';

const apiToken = 'DqDY0LPWpXwcDke';
const symbol = 'R_100';

function Trade() {
  const { tick, error, ws } = useDerivWebSocket(apiToken, symbol);
  const [lastTick, setLastTick] = useState(null);
  const [activeContract, setActiveContract] = useState(null);

  const placeOrder = useCallback(async (contractType) => {
    if (!ws) return;

    const options = {
      amount: 1,
      basis: 'stake',
      contract_type: contractType,
      currency: 'USD',
      duration: 1,
      duration_unit: 'm',
      symbol: symbol,
    };

    try {
      const contract = { contract_type: contractType, ...options };
      const buyRequest = {
        buy: 1,
        price: 1,
        parameters: contract,
      };

      ws.send(JSON.stringify(buyRequest));

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('WebSocket response:', response); // Add logging for the response

        if (response.error) {
          console.error('Error in WebSocket response:', response.error);
          return;
        }

        if (response.msg_type === 'buy') {
          console.log('Contract purchased:', response);
          if (response.buy && response.buy.contract_id) {
            setActiveContract(response.buy.contract_id);
          } else {
            console.error('Buy response does not contain contract_id:', response);
          }
        } else if (response.msg_type === 'proposal_open_contract') {
          console.log('Contract update:', response);
        }
      };
    } catch (error) {
      console.error('Error placing order:', error);
    }
  }, [ws]);

  const sellContract = useCallback(async (contractId) => {
    if (!ws || !contractId) return;

    const sellRequest = {
      sell: contractId,
      price: 0,
    };

    try {
      ws.send(JSON.stringify(sellRequest));

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Sell WebSocket response:', response); // Add logging for the response

        if (response.error) {
          console.error('Error in WebSocket response:', response.error);
          return;
        }

        if (response.msg_type === 'sell') {
          console.log('Contract sold:', response);
          setActiveContract(null);
        }
      };
    } catch (error) {
      console.error('Error selling contract:', error);
    }
  }, [ws]);

  useEffect(() => {
    if (tick && lastTick) {
      const priceChange = tick.quote - lastTick.quote;

      if (priceChange > 0) {
        console.log('Price increased, considering buy...');
        placeOrder('CALL');
      } else if (priceChange < 0) {
        console.log('Price decreased, considering sell...');
        placeOrder('PUT');
      }
    }
    setLastTick(tick);
  }, [tick, lastTick, placeOrder]);

  useEffect(() => {
    if (activeContract) {
      const timer = setTimeout(() => {
        sellContract(activeContract);
      }, 120000); // 1 minute

      return () => clearTimeout(timer);
    }
  }, [activeContract, sellContract]);

  return (
    <div className="Trade">
      <header className="Trade-header">
        <h1>Deriv Trading Bot</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {tick && (
          <div>
            <p>Symbol: {tick.symbol}</p>
            <p>Quote: {tick.quote}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default Trade;
