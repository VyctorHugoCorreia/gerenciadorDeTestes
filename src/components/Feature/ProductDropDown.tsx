// ProductDropDown.tsx
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
}

const ProductDropDown: React.FC<ProductDropDownProps> = ({
  onSelectProduct,
  selectedTeamId,
  disabled = false,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | number | null>(null); // Alteração do tipo para string | number | null

  useEffect(() => {
    fetchProducts();
  }, [selectedTeamId]);

  useEffect(() => {
    setSelectedValue(null); // Alteração para null quando a lista de produtos é atualizada
  }, [products]);

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
      console.log("Product selected:", selectedProduct.idTproduto); // Adicione um log para verificar o ID selecionado
      setSelectedValue(selectedProduct.idTproduto);
    } else {
      onSelectProduct(null);
      setSelectedValue(""); // Definir a string vazia quando nenhum produto é selecionado
    }
  };
  

  return (
    <select
      value={selectedValue || ''} // Verificação se é null para evitar erros
      onChange={handleProductChange}
      className="select-dropdown"
      disabled={disabled}
    >
      <option value="">Selecione o produto</option>
      {products.map((product) => (
        <option key={product.idTproduto} value={product.idTproduto}>
          {product.descProduto}
        </option>
      ))}
    </select>
    
  );
};

export default ProductDropDown;
