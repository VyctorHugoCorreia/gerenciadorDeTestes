import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/GlobalStyles.css'


const Header: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Gestão de cenários de testes';
  let subtitle = 'Adicione ou busque por cenários já cadastrados.';

  switch (true) {
    case path === '/criar-caso-de-teste':
      title = 'Adicionar novo cenário de teste';
      subtitle = 'Preencha os campos abaixo com as informações do cenário que você quer cadastrar.';
      break;
  
    case location.pathname.startsWith('/edit-test-case'):
      title = 'Editar cenário de teste';
      subtitle = 'Edite as informações do seu cenário de teste como desejar.';
      break;
  
    case location.pathname.startsWith('/details-test-case'):
      title = 'Detalhes cenário de teste';
      subtitle = 'Visualize todas as informações referentes ao seu cenário de teste.';
      break;
  
    case location.pathname.startsWith('/dashboard'):
      title = 'Dashboard cenários de teste';
      subtitle = 'Visualize detalhes de quantidade de testes.';
      break;
  
    default:
      break;
  }


  return (
    <div className='margin'>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
};

export default Header;
