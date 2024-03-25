import React, { useState, useEffect } from 'react';
import { setAuthToken, setAcessProfile, setUsername } from '../authentication/token';
import { setAuthentication } from '../authentication/authentication';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import '../styles/ChangePassword.css'
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ChangePasswordService from '../services/ChangePasswordService';
import Toast from '../components/Toast';

interface ChangePasswordProps { }

const ChangePasswordForm: React.FC<ChangePasswordProps> = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    setIsButtonDisabled(!(login && password && oldPassword && confirmPassword));
  }, [login, password, oldPassword, confirmPassword]);


  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ChangePasswordService.EditPassword(login,password,oldPassword);
      setShowToast(true)
      setError('')
    } catch (err: any) {
      if (Array.isArray(err) && err.length > 0) {
        setError(err[0]);
      } else {
        setError('Não foi possível realizar troca de senha, tente novamente mais tarde.');
      }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleToggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  useEffect(() => {
    if (password != '' && confirmPassword != '' && password != confirmPassword){
      setErrorConfirmPassword("O valor está diferente do preenchido em 'Nova senha'")
      setIsButtonDisabled(true); 
    }
     
    else {
      setErrorConfirmPassword("")
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (password !== '' && oldPassword !== '' && oldPassword === password) {
      setErrorPassword("Não é possível cadastrar a senha atual como a nova senha para o usuário.");
      setIsButtonDisabled(true); 
    } else {
      setErrorPassword("");
    }
  }, [password, confirmPassword]); 
  
  

  return (
    <div className='cardboard-style-change-password'>
      <h2 className="title-container">Alterar senha</h2>
      <form onSubmit={handleChangePassword} className="form-container">
        <div className="form-group">
          <TextField
            label="Login"
            placeholder="Preencha seu login"
            variant="outlined"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            label="Senha atual"
            placeholder="Preencha sua senha atual"
            variant="outlined"
            type={showOldPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleOldPasswordVisibility}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="form-group">
          <TextField
            error={errorPassword !== ''}
            helperText={errorPassword}
            label='Nova senha'
            placeholder="Preencha sua nova senha"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="form-group">
          <TextField
            error={errorConfirmPassword !== ''}
            helperText={errorConfirmPassword}
            label='Confirmar nova senha'
            placeholder="Confirme sua nova senha"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className='form-group'>
          <span>
            <Link to="/login">Retornar para login</Link>
          </span>

        </div>
        {error && <p className='error-message'>{error}</p>}
        <Button
          className='button-login'
          variant="contained"
          color="primary"
          type="submit"
          disabled={isButtonDisabled}
        >
          Alterar senha
        </Button>
        
      </form>
      {showToast && (
          <Toast
            message="Operação realizada com sucesso!"
            showToast={showToast}
            setShowToast={setShowToast}
          />
      )}
    </div>
  );
};

export default ChangePasswordForm;
