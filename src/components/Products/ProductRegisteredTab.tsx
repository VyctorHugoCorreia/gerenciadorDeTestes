import React, { useEffect, useState } from 'react';
import AddProductButton from './AddProductButton';
import SearchBar from '../searchBar/SearchBarWithTeam';
import ProductTable, { Product } from './ProductTable';
import ProductService from '../../services/ProductService';

interface Team {
  idTime: number;
  nomeTime: string;
}

interface SearchParams {
  searchValue: string;
  team: Team | null;
}


const ProductRegisteredTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>(
    {
      searchValue: '',
      team: null,
    }
  );
  
  const fetchProducts = async () => {
    try {
      const productsData = await ProductService.getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error(error);
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
    }
  };

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const filteredProducts = await ProductService.searchProducts({
        descProduto: searchParams.searchValue,
        idTime: searchParams.team?.idTime ?? undefined,
      });

      setProducts(filteredProducts);
      setSearchParams(searchParams);
    } catch (error) {
      console.error(error);
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
