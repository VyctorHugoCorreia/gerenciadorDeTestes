import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

import logo from '../images/logo-pagbank.svg';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  // Simulando o estado de login
  const isLoggedIn = true; // Você pode alterar isso de acordo com a lógica real de login

  // Estado do menu do usuário
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className='navbar'>
      <Toolbar>
        <img src={logo} alt="Logo do PagBank" style={{ marginRight: 'auto' }} />
        {isLoggedIn && (
          <>
            <div className="user-info">
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu do usuário"
                onClick={handleMenu}
              >
                <AccountCircle />
                <Typography variant="body2" >Vyctor Hugo Chrispim Correia</Typography>
              </IconButton>
            </div>
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
              <MenuItem onClick={handleClose}>Sair</MenuItem>
            </Menu>

          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
