// Header.tsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/GlobalStyles.css'


const Header: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Gestão de cenários de testes';
  let subtitle = 'Adicione ou busque por cenários já cadastrados.';

  if (path === '/criar-caso-de-teste') {
    title = 'Adicionar novo cenário de teste';
    subtitle = 'Preencha os campos abaixo com as informações do cenário que você quer cadastrar.';
  }

  return (
    <div className='margin'>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
};

export default Header;
