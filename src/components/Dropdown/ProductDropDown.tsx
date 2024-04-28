import React, { useEffect, useState } from 'react';
import ProductService from '../../services/ProductService';

interface Product {
  idProduct: number;
  descProduct: string;
  idTeam: {
    idTeam: number;
    nameTeam: string;
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
  selectedProductId,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

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
    setLoading(true);
    try {
      if (selectedTeamId) {
        const productsData = await ProductService.getProductsByTeam(selectedTeamId.toString());
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = parseInt(event.target.value, 10);
    const selectedProduct = products.find(product => product.idProduct === selectedProductId);
    if (selectedProduct) {
      onSelectProduct(selectedProduct.idProduct);
      setSelectedValue(selectedProduct.idProduct);
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
      disabled={loading || products.length === 0}
    >
      {loading ? (
        <option value="">Carregando...</option>
      ) : (
        <>
          <option value="">Selecione o produto</option>
          {products.map((product) => (
            <option key={product.idProduct} value={product.idProduct}>
              {product.descProduct}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default ProductDropDown;
