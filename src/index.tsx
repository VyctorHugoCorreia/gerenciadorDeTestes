import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Header from './components/Header';
import Navbar from './components/Navbar';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F2F2F2' }}>
        <Navbar />
        <Header />
        <App />
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
