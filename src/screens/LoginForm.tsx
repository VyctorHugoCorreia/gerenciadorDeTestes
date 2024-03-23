import React, { useState } from 'react';
import LoginService from '../services/LoginService'; 
import { setAuthToken } from '../authentication/token'; 
import { setAuthentication } from '../authentication/authentication'; 
import { Routes, Route, Link, useNavigate } from 'react-router-dom';


interface LoginFormProps {
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await LoginService.postLogin(username, password);
        const { token } = response;
        setAuthToken(token);
        setAuthentication(true);
        navigate('/');
    } catch (err) {
     
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
