// index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Header from './components/Header'; // Importando o componente Header
import Navbar from './components/Navbar'; // Importando o componente Navbar

ReactDOM.render(
  <React.StrictMode>
    <Navbar /> {/* Renderizando o componente Navbar */}
    <Header /> {/* Renderizando o componente Header */}
    <App /> {/* Renderizando o componente App */}
  </React.StrictMode>,
  document.getElementById('root')
);
