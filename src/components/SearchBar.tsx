import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../styles/SearchBar.css';

interface SearchBarProps {
  placeholder: string;
  onSearch: (searchValue: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="search-container">
      <TextField
        className="search-field"
        variant="outlined"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
      />
      <Button
        className="search-button"
        variant="contained"
        color="primary"
        onClick={handleSearch}
      >
        Pesquisar
      </Button>
    </div>
  );
};

export default SearchBar;
