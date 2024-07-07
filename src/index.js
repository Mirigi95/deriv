import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import './Login.css';
import Login from './Login';
import reportWebVitals from './reportWebVitals';
import Tick from './Componets/Portfolio';

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <React.StrictMode>
      {isLoggedIn ? (
        <App onLogout={setIsLoggedIn} />
      ) : (
        <><Login onLogin={setIsLoggedIn} /><Tick /></>
      )}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
