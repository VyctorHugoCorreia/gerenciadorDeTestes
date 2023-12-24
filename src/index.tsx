import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Header from './components/Header'; 
import Navbar from './components/Navbar';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div style={{ height: '100vh', background: '#F2F2F2' }}> {/* Div que ocupará 100% da altura da tela */}
        <Navbar />
        <Header />
        <App />
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

