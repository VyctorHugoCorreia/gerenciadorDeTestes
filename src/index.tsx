import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Header from './components/Header';
import Navbar from './components/Navbar';

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <div style={{ margin: '0', padding: '0', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F2F2F2' }}>
        <Navbar />
        <Header />
        <App />
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

document.body.style.margin = '0';
document.body.style.padding = '0';