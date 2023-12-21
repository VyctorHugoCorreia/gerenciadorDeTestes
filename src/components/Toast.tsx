import React, { useState, useEffect } from 'react';
import '../styles/Toast.css';

interface ToastProps {
  message: string;
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toast: React.FC<ToastProps> = ({ message, showToast, setShowToast }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (showToast) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
        setShowToast(false);
      }, 3000); // Tempo em milissegundos para o toast desaparecer (3 segundos neste exemplo)
    }
  }, [showToast]);

  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
