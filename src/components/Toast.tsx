import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

interface ToastProps {
  message: string;
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toast: React.FC<ToastProps> = ({ message, showToast, setShowToast }) => {

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  }, [showToast]);

  return (
    <>
      {showToast && (
        <Stack sx={{ width: '30%', position: 'fixed', top: 20, right: 20 }} spacing={2}>
          <Alert severity="success">{message}</Alert>
        </Stack>
      )}
    </>

  );
};

export default Toast;