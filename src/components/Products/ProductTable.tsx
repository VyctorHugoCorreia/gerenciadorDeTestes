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
    const { idTproduto, descProduto, idTime } = product;

    const formattedProduct = {
      id: idTproduto,
      name: descProduto,
      idTime: {
        idTime: idTime.idTime,
        nomeTime: idTime.nomeTime,
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
                <tr key={product.idTproduto}>
                  <td>{product.idTime.nomeTime}</td>
                  <td>{product.descProduto}</td>
                  <td className="action-buttons">
                    <div>
                      <IconButton
                        aria-label="Opções"
                        aria-controls={`menu-options-${product.idTproduto}`}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, product.idTproduto)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`menu-options-${product.idTproduto}`}
                        anchorEl={anchorElMap[product.idTproduto]}
                        open={Boolean(anchorElMap[product.idTproduto])}
                        onClose={() => handleClose(product.idTproduto)}
                      >
                        <MenuItem onClick={() => handleEditProduct(product)}>Editar</MenuItem>
                        <MenuItem onClick={() => handleDeleteProduct(product.idTproduto)}>Excluir</MenuItem>
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
