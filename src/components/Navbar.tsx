import React from 'react';
import '../styles/Navbar.css'
import logo from '../images/logo-pagbank.svg'; 

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
    <img src={logo} alt="Logo do PagBank"/>
      <ul className="navbar-list">
      
      </ul>
    </nav>
  );
};

export default Navbar;
