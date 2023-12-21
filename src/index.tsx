import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Header from './components/Header'; 
import Navbar from './components/Navbar';

ReactDOM.render(
  <React.StrictMode>
    <Navbar /> 
    <Header /> 
    <App /> 
  </React.StrictMode>,
  document.getElementById('root')
);
