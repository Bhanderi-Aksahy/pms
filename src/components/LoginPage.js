import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 


  const handleLogin = () => {
    if (username === 'axay' && password === 'ak@123') {
      onLogin(true);
      navigate('/home'); 
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="LoginPage">
      <h2>Login Page</h2>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
