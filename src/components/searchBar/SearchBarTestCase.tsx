// SearchBar.tsx
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import '../../styles/SearchBarTeams.css';

interface SearchBarProps {
  placeholder: string;
  onSearch: (searchParams: SearchParams) => void;
}

interface SearchParams {
  searchValue: string;
  team: Team | null;
}

interface Team {
  idTime: number;
  nomeTime: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleSearch = () => {
    onSearch({ searchValue, team: selectedTeam });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSelectTeam = (team: Team | string) => {
    setSelectedTeam(typeof team === 'string' ? null : team);
  };

  return (
    <div>
      <div className="dropdown-container dropdown">
        <TeamsDropDown onSelectTeam={handleSelectTeam} selectedTeam={selectedTeam?.idTime || null} />
      </div>

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
    </div>
  );
};

export default SearchBar;
