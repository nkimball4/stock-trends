import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoggedIn } from '../../contexts/loggedInContext';
import './index.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailure, setLoginFailure] = useState(false);
  const { loggedIn, setLoggedIn } = useLoggedIn();
  const [redirectToWatchlist, setRedirectToWatchlist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn.loggedInStatus) {
      console.log("changing logged in status to " + loggedIn.loggedInStatus)
      navigate("/chatter/my-watchlist")
    }
  }, [loggedIn.loggedInStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password
    };

    try {
      const response = await fetch('http://localhost:8000/api/get-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();

      console.log(data);

      setLoggedIn({ loggedInStatus: true, userData: data.userData });
      localStorage.setItem('loggedIn', JSON.stringify({ loggedInStatus: true, userData: data.userData }));
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginFailure(true);
    }
  };

  console.log(loggedIn);

  return (
    <div className='login-page-wrapper'>
      <div className='heading-box-login'>
          <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>log in</h1>
          <div className='line'></div>
      </div>
      <form onSubmit={handleSubmit} className='login-container'>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='login-input'
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='login-input'
        />
        <button type="submit" className='login-button'>login</button>
        <div className="signup-subtext">
          <p>no account? <Link to='/chatter/signup'>sign up</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
