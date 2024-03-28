import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductService from '../../services/ProductService';
import '../../styles/AddModal.css';
import TextField from '@mui/material/TextField';
import Toast from '../Toast';


export interface Product {
  idProduct: number;
  descProduct: string;
  idTeam: {
    idTeam: number;
    nameTeam: string;
  };
}

export interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  fetchProducts: () => void;
  selectedProduct?: {
    idProduct: number;
    descProduct: string;
    idTeam: { idTeam: number; nameTeam: string };
  } | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  fetchProducts,
  selectedProduct,
}) => {
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [productName, setProductName] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<{
    idTeam: number;
    nameTeam: string;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
      setIsButtonDisabled(productName === '' || selectedTeam === null)
  });

  useEffect(() => {
    if (open && selectedProduct) {
      setError('');
      setProductName(selectedProduct.descProduct || '');
      setSelectedTeam(selectedProduct.idTeam ? {
        idTeam: selectedProduct.idTeam.idTeam,
        nameTeam: selectedProduct.idTeam.nameTeam,
      } : null);
    } else {
      setError('');
      setProductName('');
      setSelectedTeam(null);
    }
  }, [open, selectedProduct]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
    setError('');
  };

  const handleSelectTeam = (team: { idTeam: number; nameTeam: string } | string) => {
    if (!selectedProduct) {
      if (typeof team === 'string') {
        setSelectedTeam(null);
      } else {
        setError('');
        setSelectedTeam({ idTeam: team.idTeam, nameTeam: team.nameTeam });
      }
    }
  };

  const handleAddProduct = async () => {
    try {
      if (selectedTeam) {
        await ProductService.addProduct(selectedTeam.idTeam, productName);
        setProductName('');
        setSelectedTeam(null);
        onClose();
        fetchProducts();
        setShowToast(true)
      } else {
        setError('Selecione um time');
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const handleEditProduct = async () => {
    try {
      if (selectedTeam && selectedProduct) {
        await ProductService.editProduct(selectedProduct.idProduct, productName);
        setProductName('');
        setSelectedTeam(null);
        onClose();
        fetchProducts();
        setShowToast(true)
      } else {
        setError('Selecione um time');
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const isEditing = !!selectedProduct;

  return (
    <>
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="team-modal-title"
      aria-describedby="team-modal-description"
    >
      <div className="team-modal">
        <h2 id="team-modal-title">
          {selectedProduct ? 'Editar produto' : 'Adicionar novo produto'}
        </h2>
        <TeamsDropDown
          onSelectTeam={handleSelectTeam}
          selectedTeam={selectedTeam?.idTeam || null}
          disabled={isEditing}
        />

        <TextField
          className="team-modal-input"
          id="product-descProduct"
          placeholder="Preencha o nome do produto"
          value={productName}
          onChange={handleInputChange}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button
          className="team-modal-button"
          variant="contained"
          color="primary"
          onClick={selectedProduct ? handleEditProduct : handleAddProduct}
          disabled={isButtonDisabled}
        >
          {selectedProduct ? 'Editar' : 'Cadastrar'}
        </Button>
      </div>
    </Modal>

    {showToast && (
        <div>
          <Toast
            message="Operação realizada com sucesso!"
            showToast={showToast}
            setShowToast={setShowToast}
          />
        </div>
          )}
    </>
  );
};

export default ProductModal;