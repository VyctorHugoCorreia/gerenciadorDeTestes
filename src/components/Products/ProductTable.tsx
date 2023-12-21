import React, { useEffect, useState } from 'react';
import ProductService from '../../services/ProductService';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import ProductModal from './ProductModal';
import Toast from '../Toast';

export interface Product {
  idTproduto: number;
  descProduto: string;
  idTime: {
    idTime: number;
    nomeTime: string;
  };
}

interface ProductTableProps {
  products: Product[];
  fetchProducts: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, fetchProducts }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
    idTime: {
      idTime: number;
      nomeTime: string;
    };
  } | null>(null);
  const [showToast, setShowToast] = useState(false);


  const handleDeleteProduct = async (productId: number) => {
    try {
      await ProductService.deleteProduct(productId);
      fetchProducts();
      setShowToast(true);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(`${err}`);
      setErrorPopupOpen(true);
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    const { idTproduto, descProduto, idTime } = product;

    const formattedProduct = {
      id: idTproduto,
      name: descProduto,
      idTime: {
        idTime: idTime.idTime,
        nomeTime: idTime.nomeTime
      }
    };

    setSelectedProduct(formattedProduct);
    setIsEditModalOpen(true);
  };

  return (

    <div>
      {products.length === 0 ? (
        <h3 className="no-records-message">Nenhum produto foi encontrado</h3>
      ) : (
        <table className="table-container">
          <thead>
            <tr>
              <th>Time</th>
              <th>Produto</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.idTproduto}>
                <td>{product.idTime.nomeTime}</td>
                <td>{product.descProduto}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEditProduct(product)}>Editar</button>
                  <button onClick={() => handleDeleteProduct(product.idTproduto)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ErrorPopup
        open={errorPopupOpen}
        onClose={handleCloseErrorPopup}
        errorMessage={error}
      />

      <ProductModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        fetchProducts={fetchProducts}
        selectedProduct={selectedProduct}
      />


      <Toast
        message="Operação realizada com sucesso!"
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </div>
  );
};

export default ProductTable;