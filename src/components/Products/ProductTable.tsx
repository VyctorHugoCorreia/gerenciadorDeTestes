import React, { useState } from 'react';
import ProductService from '../../services/ProductService';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import ProductModal from './ProductModal';
import Toast from '../Toast';
import TablePagination from '@mui/material/TablePagination';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';

export interface Product {
  idProduct: number;
  descProduct: string;
  idTeam: {
    idTeam: number;
    nameTeam: string;
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
    idProduct: number;
    descProduct: string;
    idTeam: {
      idTeam: number;
      nameTeam: string;
    };
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, productId: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [productId]: event.currentTarget,
    });
  };

  const handleClose = (productId: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [productId]: null,
    });
  };

  const handleEditProduct = (product: Product) => {
    const { idProduct, descProduct, idTeam } = product;

    const formattedProduct = {
      idProduct: idProduct,
      descProduct: descProduct,
      idTeam: {
        idTeam: idTeam.idTeam,
        nameTeam: idTeam.nameTeam,
      },
    };

    setSelectedProduct(formattedProduct);
    setIsEditModalOpen(true);
  };

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      {products.length === 0 ? (
        <h3 className="no-records-message">Nenhum produto foi encontrado</h3>
      ) : (
        <>
          <table className="table-container">
            <thead>
              <tr>
                <th>Time</th>
                <th>Produto</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                <tr key={product.idProduct}>
                  <td>{product.idTeam.nameTeam}</td>
                  <td>{product.descProduct}</td>
                  <td className="action-buttons">
                    <div>
                      <IconButton
                        aria-label="Opções"
                        aria-controls={`menu-options-${product.idProduct}`}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, product.idProduct)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`menu-options-${product.idProduct}`}
                        anchorEl={anchorElMap[product.idProduct]}
                        open={Boolean(anchorElMap[product.idProduct])}
                        onClose={() => handleClose(product.idProduct)}
                      >
                        <MenuItem onClick={() => handleEditProduct(product)}>Editar</MenuItem>
                        <MenuItem onClick={() => handleDeleteProduct(product.idProduct)}>Excluir</MenuItem>
                      </Menu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Itens por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </>
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
