import React, { useState } from 'react';
import LoginService from '../services/LoginService'; 
import { setAuthToken } from '../authentication/token'; 
import { setAuthentication } from '../authentication/authentication'; 
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import '../styles/login.css'
import { Button, TextField } from '@mui/material';



interface LoginFormProps {
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthentication(false);
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
    <div className='cardboard-style'>
      <h2 className="title-container">Login</h2> 
      <form onSubmit={handleLogin} className="form-container">
        <div className="form-group">
          <TextField
            label="Preencha seu login"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            label="Preencha sua senha"
            variant="outlined"
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Login
          </Button>
      </form>
    </div>
  );
  
  
  
  };  

export default LoginForm;
