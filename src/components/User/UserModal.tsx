import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import AcessProfileDropDown from '../Dropdown/AcessProfileDropDown';
import '../../styles/AddModal.css';
import UserService from '../../services/UserService';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import Toast from '../Toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';


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
  const [oldPassword, setOldPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [editPassword, setEditPassword] = useState<boolean>(false);
  const [selectedAcessProfile, setSelectedAccessProfile] = useState<{
    id: string;
    nome: string;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const isEditing = !!selectedUser;

  useEffect(() => {
    let isDisabled;

    if (isEditing) {
      if (editPassword) {
        isDisabled = username === '' || login === '' || password === '' || oldPassword === '' || confirmPassword === '' || selectedAcessProfile === null;
      } else {
        isDisabled = username === '' || login === '' || selectedAcessProfile === null;
      }
    } else {
      isDisabled = username === '' || login === '' || password === '' || confirmPassword === '' || selectedAcessProfile === null;
    }

    setIsButtonDisabled(isDisabled);
  }, [isEditing, editPassword, username, login, password, oldPassword, confirmPassword, selectedAcessProfile]);


  useEffect(() => {
    if (password != '' && confirmPassword != '' && password != confirmPassword)
      setErrorConfirmPassword("O valor está diferente do preenchido em 'Senha do usuário'")
    else {
      setErrorConfirmPassword("")

    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (selectedUser && open)
      clearFieldsPassword();

  }, [selectedUser, open]);

  useEffect(() => {
    if (password != '' && oldPassword != '' && oldPassword == password)
      setErrorPassword("Não é possível cadastrar a senha atual como a nova senha para o usuário.")
    else {
      setErrorPassword("")

    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (open && selectedUser) {
      setError('');
      setUsername(selectedUser.nome || '');
      setLogin(selectedUser.login || '');

      setSelectedAccessProfile(selectedUser.perfilDeAcesso.id ? {
        id: selectedUser.perfilDeAcesso.id,
        nome: selectedUser.perfilDeAcesso.nome,
      } : null);
    } else {
      setError('');
      setUsername('');
      setLogin('');
      setSelectedAccessProfile(null);
    }
  }, [open, selectedUser]);

  const handleInputChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setError('');
  };

  const clearFieldsPassword = () => {
    setPassword('');
    setConfirmPassword('');
    setOldPassword('');
    setEditPassword(false);
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

  const handleInputChangeOldPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
    setError('');
  };


  const handleSelectAccessProfile = (accessProfile: { id: string; nome: string } | string) => {
    if (!selectedUser) {
      setSelectedAccessProfile(typeof accessProfile === 'string' ? null : { id: accessProfile.id, nome: accessProfile.nome });
      setError('');
    } else {
      setSelectedAccessProfile(typeof accessProfile === 'string' ? selectedAcessProfile : { id: accessProfile.id, nome: accessProfile.nome });
      setError('');
    }
  };

  const handleToggleEditPassword = () => {
    setEditPassword(!editPassword);
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

  const handleAddUser = async () => {
    try {
      await UserService.addUser(username, login, password, selectedAcessProfile?.nome ?? '');
      setUsername('');
      setUsername('');
      setLogin('');
      setPassword('');
      setConfirmPassword('')
      setSelectedAccessProfile(null);
      onClose();
      clearFieldsPassword();
      fetchUser();
      setShowToast(true)
    } catch (err) {
      setError(`${err}`);
    }
  };

  const handleEditUser = async () => {
    try {
      if (selectedAcessProfile && selectedUser) {
        await UserService.EditUser(selectedUser.id, username, login, password, oldPassword, selectedAcessProfile?.nome ?? '');
        setUsername('');
        setUsername('');
        setLogin('');
        if (editPassword) {
          setOldPassword('');
          setPassword('');
          setConfirmPassword('')
        }
        setSelectedAccessProfile(null);
        onClose();
        clearFieldsPassword();
        fetchUser();
        setShowToast(true)
      }
    } catch (err) {
      setError(`${err}`);
    }
  };


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
            onSelectAcessProfile={handleSelectAccessProfile}
            selectedAcessProfile={selectedAcessProfile?.id || null}
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

          {isEditing && <Button onClick={handleToggleEditPassword}>Editar Senha</Button>}

          {isEditing && editPassword && (
            <>
              <TextField
                className="team-modal-input"
                id="old-password"
                label="Senha atual do usuário"
                placeholder="Preencha a senha atual do usuário"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={handleInputChangeOldPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle old password visibility"
                        onClick={handleToggleOldPasswordVisibility}
                        edge="end"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                error={errorPassword !== ''}
                helperText={errorPassword}
                className="team-modal-input"
                id="password"
                label="Nova senha do usuário"
                placeholder="Preencha a nova senha do usuário"
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
                error={errorConfirmPassword !== ''}
                className="team-modal-input"
                id="confirm-password"
                label="Confirmar nova senha do usuário"
                placeholder="Confirme a nova senha do usuário"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleInputChangeConfirmPassword}
                helperText={errorConfirmPassword}
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
            </>
          )}

          {!isEditing && (
            <>
              <TextField
                error={errorPassword !== ''}
                helperText={errorPassword}
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
                error={errorConfirmPassword !== ''}
                className="team-modal-input"
                id="confirm-password"
                label="Confirmar senha do usuário"
                placeholder="Confirme a senha do usuário"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleInputChangeConfirmPassword}
                helperText={errorConfirmPassword}
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
            </>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button
            className="team-modal-button"
            variant="contained"
            color="primary"
            id="cadastrar"
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