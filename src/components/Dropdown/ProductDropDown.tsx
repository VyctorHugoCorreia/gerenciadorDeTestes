import React, { useEffect, useState } from 'react';
import ProductService from '../../services/ProductService';

interface Product {
  idTproduto: number;
  descProduto: string;
  idTime: {
    idTime: number;
    nomeTime: string;
  };
}

interface ProductDropDownProps {
  onSelectProduct: (productId: number | null) => void;
  selectedTeamId?: number | null;
  disabled?: boolean;
  isEditing: boolean;
  resetDropdown: boolean;
  selectedProductId: number | null; 
}

const ProductDropDown: React.FC<ProductDropDownProps> = ({
  onSelectProduct,
  selectedTeamId,
  disabled = false,
  isEditing,
  resetDropdown,
  selectedProductId 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | number | null>(null); 

  useEffect(() => {
    fetchProducts();
  }, [selectedTeamId]);

  useEffect(() => {
    setSelectedValue(null);
  }, [products]);

  useEffect(() => {
    if (resetDropdown) {
      setSelectedValue('');
      onSelectProduct(null);
      setProducts([]);
    }
  }, [resetDropdown]);

  const fetchProducts = async () => {
    try {
      if (selectedTeamId) {
        const productsData = await ProductService.getProductsByTeam(selectedTeamId.toString());
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = parseInt(event.target.value, 10);
    const selectedProduct = products.find(product => product.idTproduto === selectedProductId);
    if (selectedProduct) {
      onSelectProduct(selectedProduct.idTproduto);
      setSelectedValue(selectedProduct.idTproduto);
    } else {
      onSelectProduct(null);
      setSelectedValue("");
    }
  };
  
  return (
    <select
      value={selectedValue || (selectedProductId !== null ? selectedProductId : '')}
      onChange={handleProductChange}
      className="select-dropdown"
      disabled={disabled}
    >
      {!isEditing && <option value="">Selecione o produto</option>}
      {products.map((product) => (
        <option key={product.idTproduto} value={product.idTproduto}>
          {product.descProduto}
        </option>
      ))}
    </select>
  );
};

export default ProductDropDown;