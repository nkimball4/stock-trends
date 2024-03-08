import React, { useState } from 'react';
import './index.scss'

const LoginPage = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate username and password
    handleLogin(username, password);
  };

  return (
    <div className='login-page-wrapper'>
        <form onSubmit={handleSubmit} className='login-container'>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='login-input'
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='login-input'
        />
        <button type="submit" className='login-button'>login</button>
        </form>
    </div>
  );
};

export default LoginPage;