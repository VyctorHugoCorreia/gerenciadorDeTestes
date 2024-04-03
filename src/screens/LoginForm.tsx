import React, { useState, useEffect } from 'react';
import LoginService from '../services/LoginService';
import { setAuthToken, setAcessProfile, setUsername } from '../authentication/token';
import { setAuthentication } from '../authentication/authentication';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import '../styles/login.css'
import { Button, TextField } from '@mui/material';

interface LoginFormProps { }

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    setIsButtonDisabled(!(login && password));
  }, [login, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthentication(false);
    try {
      const response = await LoginService.postLogin(login, password);
      const { token } = response;
      setAuthToken(token);
      setAuthentication(true);
      setAcessProfile(response.accessProfile)
      setUsername(response.name)
      navigate('/');
    } catch (err: any) {
      if (Array.isArray(err) && err.length > 0) {
        setError(err[0]);
      } else {
        setError('Não foi possível realizar login, tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className='cardboard-style-login'>
      <h2 className="title-container">Login</h2>
      <form onSubmit={handleLogin} className="form-container-login">
        <div className="form-group-login">
          <TextField
            label="Preencha seu login"
            variant="outlined"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className="form-group-login">
          <TextField
            label="Preencha sua senha"
            variant="outlined"
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className='error-message'>{error}</p>}
        <Button
          className='button-login'
          variant="contained"
          color="primary"
          type="submit"
          disabled={isButtonDisabled}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
