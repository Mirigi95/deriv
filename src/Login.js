// src/Login.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import './Login.css'; // Import CSS file for styling



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6DfUp43ChnaHnAaTUnu_iuREBvk_1k2k",
  authDomain: "twitter-post-8cd34.firebaseapp.com",
  databaseURL: "https://twitter-post-8cd34-default-rtdb.firebaseio.com",
  projectId: "twitter-post-8cd34",
  storageBucket: "twitter-post-8cd34.appspot.com",
  messagingSenderId: "90149246118",
  appId: "1:90149246118:web:449c450c579bfd76fc9067",
  measurementId: "G-QE99RSL9RV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async () => {
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onLogin(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTwitterLogin = async () => {
    const auth = getAuth(app);
    const provider = new TwitterAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onLogin(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <header className='App-header'>
    <div className="login-container">
      <h2>Login</h2>
      <div className="input-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-container">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="button-container">
        <button className="login-button" onClick={handleEmailLogin}>Login with Email</button>
        <button className="login-button" onClick={handleGoogleLogin}>Login with Google</button>
        <button className="login-button" onClick={handleTwitterLogin}>Login with Twitter</button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
    </header>
  );
};

export default Login;
