import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoggedIn } from '../../contexts/loggedInContext';
import './index.scss';

const SignupPage = ({ handleSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acknowledge, setAcknowledge] = useState(false);
  const [accountCreated, setAccountCreated] = useState('');
  const { loggedIn, setLoggedIn } = useLoggedIn();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      confirmPassword,
      acknowledge,
    };
  
    try {
      const response = await fetch('http://localhost:8000/api/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create account');
      }
    
      const data = await response.json();

      setAccountCreated('success')
      setLoggedIn({loggedInStatus: true, userData: data.userData});
      localStorage.setItem('loggedIn', JSON.stringify({ loggedInStatus: true, userData: data.userData }));
    } catch (error) {
      console.error('Error creating account:', error);
      setAccountCreated('failed')
    }
  };
  

  return (
    <>
        <div className='signup-page-wrapper'>
            {accountCreated === 'success' ? (
                <>
                    <img src={process.env.PUBLIC_URL + `/images/happy-face.svg`}>
                    </img>
                    <div style={{marginTop: "2%"}}>
                        <p>account created successfully!</p>
                    </div>
                </>
            ) : accountCreated === 'failed' ? (
                <>
                    <img src={process.env.PUBLIC_URL + `/images/sad-face.svg`}>
                    </img>
                    <div style={{marginTop: "2%"}}>
                        <p>failed to create account. please try again.</p>
                    </div>
                </>
            ) : (
                <>
                    <div className='heading-box-signup'>
                        {/* <div className='line' style={{marginTop: "0%"}}/> */}
                        <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>sign up</h1>
                        <div className='line'/>
                    </div>
                    <form onSubmit={handleSubmit} className='signup-container'>
                        <input
                        type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='signup-input'
                        />
                        <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='signup-input'
                        />
                        <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='signup-input'
                        />
                        <input
                        type="password"
                        placeholder="confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='signup-input'
                        />
                        <label>
                        <input
                            type="checkbox"
                            checked={acknowledge}
                            onChange={(e) => setAcknowledge(e.target.checked)}
                        />
                        by signing up you recognize that this is a tool to monitor stock momentum, and is not providing actual financial advice.
                        </label>
                        <button type="submit" className='signup-button'>sign up</button>
                        <div className="login-subtext">
                        <p style={{textAlign: "center"}}>already have an account? <Link to='/chatter/login'>log in</Link></p>
                        </div>
                    </form>
                </>
            )}
        </div>
    </>
  );
};

export default SignupPage;
