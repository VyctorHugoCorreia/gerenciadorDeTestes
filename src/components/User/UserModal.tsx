import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import AcessProfileDropDown from '../Dropdown/AcessProfileDropDown';
import '../../styles/AddModal.css';
import UserService from '../../services/UserService';

import { Button, IconButton, InputAdornment, TextField } from '@mui/material';

import Toast from '../Toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { log } from 'console';


export interface User {
  id: string;
  nome: string;
  login: string;
  senha: string;
  perfilDeAcesso: string;

}

export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  fetchUser: () => void;
  selectedUser?: {
    id: string;
    nome: string;
    login: string;
    perfilDeAcesso: { id: string; nome: string };
  } | null;
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  fetchUser,
  selectedUser,
}) => {
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [username, setUsername] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false); // Novo estado para controlar a exibição da senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Novo estado para controlar a exibição da senha
  const [errorPassword, setErrorPassword] = useState<string>('');

  const [selectedAcessProfile, setSelectedAcessProfile] = useState<{
    id: string;
    nome: string;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setIsButtonDisabled(username === '' || login === '' || password === '' || confirmPassword === '' || selectedAcessProfile === null)
  });

  useEffect(() => {
    if (password != '' && confirmPassword != '' && password != confirmPassword)
      setErrorPassword("O valor está diferente do preenchido em 'Senha do usuário'")
    else {
      setErrorPassword("")

    }
  }, [password, confirmPassword]);


  useEffect(() => {
    if (open && selectedUser) {
      setError('');
      setUsername(selectedUser.nome || '');
      setLogin(selectedUser.login || '');

      setSelectedAcessProfile(selectedUser.id ? {
        id: selectedUser.id,
        nome: selectedUser.nome,
      } : null);
    } else {
      setError('');
      setUsername('');
      setLogin('');
    }
  }, [open, selectedUser]);

  const handleInputChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setError('');
  };

  const handleInputChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
    setError('');
  };

  const handleInputChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError('');
  };

  const handleInputChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setError('');
  };



  const handleSelectAcessProfile = (acessProfile: { id: string; nome: string } | string) => {
    if (!selectedUser) {
      if (typeof acessProfile === 'string') {
        setSelectedAcessProfile(null);
      } else {
        setError('');
        setSelectedAcessProfile({ id: acessProfile.id, nome: acessProfile.nome });
      }
    }
  };



  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const handleAddUser = async () => {
    try {
       await UserService.addUser(username,login,password,selectedAcessProfile?.nome ?? '');
        setUsername('');
        setUsername('');
        setLogin('');
        setPassword('');
        setConfirmPassword('')
        setSelectedAcessProfile(null);
        onClose();
        fetchUser();
        setShowToast(true)
    } catch (err) {
      setError(`${err}`);
    }
  };

  const handleEditUser = async () => {
    try {
      if (selectedAcessProfile && selectedUser) {
        // await ProductService.editProduct(selectedProduct.id, productName);
        setUsername('');
        setUsername('');
        setLogin('');
        setPassword('');
        setConfirmPassword('')
        setSelectedAcessProfile(null);
        onClose();
        fetchUser();
        setShowToast(true)
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const isEditing = !!selectedUser;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="team-modal-title"
        aria-describedby="team-modal-description"
      >
        <div className="team-modal">
          <h2 id="team-modal-title">
            {selectedUser ? 'Editar usuário' : 'Adicionar novo usuário'}
          </h2>
          <AcessProfileDropDown
            onSelectAcessProfile={handleSelectAcessProfile}
            selectedAcessProfile={selectedAcessProfile?.id || null}
            disabled={isEditing}
          />

          <TextField
            className="team-modal-input"
            id="username"
            label="Nome do usuário"
            placeholder="Preencha o nome do usuário"
            value={username}
            onChange={handleInputChangeUsername}
          />
          <TextField
            className="team-modal-input"
            id="login"
            label="Login do usuário"
            placeholder="Preencha o login do usuário"
            value={login}
            onChange={handleInputChangeLogin}
          />
          <TextField
            className="team-modal-input"
            id="password"
            label="Senha do usuário"
            placeholder="Preencha a senha do usuário"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleInputChangePassword}
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
          <TextField
            error={errorPassword != ''}
            className="team-modal-input"
            id="confirm-password"
            label="Confirmar senha do usuário"
            placeholder="Confirme a senha do usuário"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={handleInputChangeConfirmPassword}
            helperText={errorPassword}
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button
            className="team-modal-button"
            variant="contained"
            color="primary"
            id='cadastrar'
            onClick={selectedUser ? handleEditUser : handleAddUser}
            disabled={isButtonDisabled}
          >
            {selectedUser ? 'Editar' : 'Cadastrar'}
          </Button>
        </div>
      </Modal>

      {showToast && (
        <div>
          <Toast
            message="Operação realizada com sucesso!"
            showToast={showToast}
            setShowToast={setShowToast}
          />
        </div>
      )}
    </>
  );
};

export default UserModal;