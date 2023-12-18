import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TeamsDropDown from './TeamsDropDown';
import ProductService from '../../services/ProductService';
import '../../styles/Teams/TeamModal.css';
import TextField from '@mui/material/TextField';

export interface Product {
  id: number;
  name: string;
  idTime: {
    idTime: number;
    nomeTime: string;
  };
}

export interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  fetchProducts: () => void;
  selectedProduct?: {
    id: number;
    name: string;
    idTime: { idTime: number; nomeTime: string };
  } | null; // Adicione a possibilidade de null também
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
    idTime: number;
    nomeTime: string;
  } | null>(null);

  useEffect(() => {
    if (open && selectedProduct) {
      setError('');
      setIsButtonDisabled(!selectedProduct.name);
      setProductName(selectedProduct.name || '');
      // Atualizando o selectedTeam com os valores de selectedProduct.idTime, se existirem
      setSelectedTeam(selectedProduct.idTime ? {
        idTime: selectedProduct.idTime.idTime,
        nomeTime: selectedProduct.idTime.nomeTime,
      } : null);
    } else {
      setError('');
      setIsButtonDisabled(true);
      setProductName('');
      setSelectedTeam(null);
    }
  }, [open, selectedProduct]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
    setError('');
    setIsButtonDisabled(event.target.value === '');
  };

  const handleSelectTeam = (team: { idTime: number; nomeTime: string } | string) => {
    if (!selectedProduct) {
      // Se não houver um selectedProduct (ou seja, estamos adicionando um novo produto)
      if (typeof team === 'string') {
        setError('Erro ao selecionar o time');
        setIsButtonDisabled(true);
        setSelectedTeam(null);
      } else {
        setError('');
        setIsButtonDisabled(false);
        setSelectedTeam({ idTime: team.idTime, nomeTime: team.nomeTime });
      }
    }
  };

  const handleAddProduct = async () => {
    try {
      if (selectedTeam) {
        await ProductService.addProduct(selectedTeam.idTime, productName);
        setProductName('');
        setSelectedTeam(null);
        onClose();
        fetchProducts();
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
        await ProductService.editProduct(selectedProduct.id, productName);
        setProductName('');
        setSelectedTeam(null);
        onClose();
        fetchProducts();
      } else {
        setError('Selecione um time');
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const isEditing = !!selectedProduct;

  return (
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
          selectedTeam={selectedTeam?.idTime || null}
          disabled={isEditing} // Desabilita o campo durante a edição
        />

        <TextField
          className="team-modal-input"
          id="product-name"
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
  );
};

export default ProductModal;