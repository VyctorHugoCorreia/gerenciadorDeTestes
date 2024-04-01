import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { getAuthentication, setAuthentication } from '../authentication/authentication';
import { getUsername } from '../authentication/token';

import logo from '../images/logo-pagbank.svg';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(getAuthentication());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setIsLoggedIn(getAuthentication());
    setAnchorEl(null)
  }, [getAuthentication()]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAuthentication(false);
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <AppBar position="static" className='navbar'>
      <Toolbar>
        <a style={{ marginRight: 'auto' }} href="/cenarios-de-teste">
          <img src={logo} alt="Logo do PagBank" style={{ marginRight: 'auto' }} />
        </a>

        {isLoggedIn ? (
          <div className="user-info">
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu do usuário"
              onClick={handleMenu}
            >
              <AccountCircle />
              <Typography variant="body2" >{getUsername()}</Typography>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </div>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
