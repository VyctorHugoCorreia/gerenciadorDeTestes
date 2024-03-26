import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AcessProfileDropDown from '../Dropdown/AcessProfileDropDown';
import '../../styles/SearchBar.css';

export interface AcessProfile {
  id: string;
  nome: string;
}

interface SearchParams {
  searchValueName: string;
  searchValueLogin: string;

  selectedAcessProfile: AcessProfile | null;
}

interface SearchBarProps {
  onSearch: (searchParams: SearchParams) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch
}) => {
  const [searchValueName, setSearchValueName] = useState<string>('');
  const [searchValueLogin, setSearchValueLogin] = useState<string>('');

  const [selectedAcessProfile, setSelectedAcessProfile] = useState<AcessProfile | null>(null);

  const handleSearch = () => {
    onSearch({
      searchValueName,
      searchValueLogin,
      selectedAcessProfile
    });
  };



  const handleInputChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValueName(event.target.value);
  };

  const handleInputChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValueLogin(event.target.value);
  };


  const handleSelectAcessProfile = (acessProfile: AcessProfile | string) => {
    setSelectedAcessProfile(typeof acessProfile === 'string' ? null : acessProfile);
  };

  return (
    <div>
      <div className="dropdown-container">
        <div className='dropdown'>
          <AcessProfileDropDown onSelectAcessProfile={handleSelectAcessProfile} selectedAcessProfile={selectedAcessProfile?.id || null} />
        </div>
      </div>
      <div className="search-container">
        <div className="search-container"> 

        <TextField
          className="search-field"
          variant="outlined"
          placeholder=" Buscar por nome"
          value={searchValueName}
          onChange={handleInputChangeName}
        />
       
        <TextField
          className="search-field"
          variant="outlined"
          placeholder="Buscar por login"
          value={searchValueLogin}
          onChange={handleInputChangeLogin}
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
      
      </div>
    </div>
  );
};

export default SearchBar;
