// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import Trade from './Trade';



function App({ onLogout }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const sessionExpiration = localStorage.getItem('sessionExpiration');
    if (sessionExpiration && new Date().getTime() < sessionExpiration) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('sessionExpiration');
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        localStorage.removeItem('sessionExpiration');
        setIsLoggedIn(false);
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  

  return (
    <div className="App">
      <header className="App-header">
        

        <div>
      <h1>Welcome to the App</h1>
      <button onClick={() => onLogout(false)}>Logout</button>
      <Trade />
    </div>
      </header>
    </div>
  );
}

export default App;
