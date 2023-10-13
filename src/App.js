import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import JobDetail from './components/JobDetail';
import './styles/App.css';

  
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    if (storedLoggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (loggedIn) => {
    setIsLoggedIn(loggedIn);
    localStorage.setItem('isLoggedIn', loggedIn.toString());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && (
          <button className="LogoutButton" onClick={handleLogout}>
            Logout
          </button>
        )}

        {isLoggedIn ? (
          <Routes>
            <Route path="/home" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/job/:id" element={<JobDetail />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
