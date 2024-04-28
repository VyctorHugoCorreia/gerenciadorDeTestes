import React, { useState, useEffect } from 'react';
import LoginService from '../services/LoginService';
import { setAuthToken, setAcessProfile, setUsername } from '../authentication/token';
import { setAuthentication } from '../authentication/authentication';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import '../styles/login.css'
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';

interface LoginFormProps { }

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
          Entrar
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
