import React, { useEffect, useState } from 'react';
import AddProductButton from './AddProductButton';
import SearchBar from '../SearchBar';
import ProductTable, { Product } from './ProductTable';
import ProductService from '../../services/ProductService';

const ProductRegisteredTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const productsData = await ProductService.getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error(error);
      // Handle error according to your application's needs
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const allProducts = await ProductService.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error(error);
      // Handle error according to your application's needs
    }
  };

  const handleSearch = async (searchValue: string) => {
    try {
      const filteredProducts = await ProductService.searchProducts(searchValue);
      setProducts(filteredProducts);
    } catch (error) {
      console.error(error);
      // Handle error according to your application's needs
    }
  };

  const defaultProductTableProps = {
    open: false,
    onClose: () => {},
    onEdit: (product: Product) => {},
  };

  return (
    <div>
      <AddProductButton fetchProducts={fetchAllProducts} />
      <SearchBar 
        placeholder="Buscar produto" 
        onSearch={handleSearch}
      />
      <ProductTable 
        {...defaultProductTableProps}
        products={products} 
        fetchProducts={fetchProducts} 
      />
    </div>
  );
};

export default ProductRegisteredTab;
