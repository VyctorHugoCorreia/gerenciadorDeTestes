import React, { useEffect, useState } from 'react';
import AddProductButton from './Products/AddProductButton';
import SearchBar from './SearchBar';
import ProductTable, { Product } from './Products/ProductTable'; // Certifique-se de importar o componente correto e a interface Product
import ProductService from '../services/ProductService'; // Importe o serviço de produto correto

const ProductRegisteredTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const productsData = await ProductService.getAllProducts(); // Use o método correto para obter produtos
      setProducts(productsData);
    } catch (error) {
      console.error(error);
      // Lide com o erro de acordo com a necessidade da sua aplicação
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = async (searchValue: string) => {
    try {
      const filteredProducts = await ProductService.searchProducts(searchValue); // Utilize o método correto de busca de produtos
      setProducts(filteredProducts);
    } catch (error) {
      console.error(error);
      // Lide com o erro de acordo com a necessidade da sua aplicação
    }
  };

  // Adicione valores padrão para as propriedades necessárias, mesmo que não sejam usadas diretamente neste componente
  const defaultProductTableProps = {
    open: false,
    onClose: () => {},
    onEdit: (product: Product) => {}, // Se precisar manipular a edição, pode implementar essa função aqui
  };

  return (
    <div>
      <AddProductButton fetchProducts={fetchProducts} />
      <SearchBar 
        placeholder="Buscar produto" 
        onSearch={handleSearch}
      />
      {/* Passando as propriedades padrão para o ProductTable */}
      <ProductTable 
        {...defaultProductTableProps}
        products={products} 
        fetchProducts={fetchProducts} 
      />
    </div>
  );
};

export default ProductRegisteredTab;
