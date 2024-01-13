// SearchBar.tsx
import React, { useState, ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductDropDown from '../Dropdown/ProductDropDown';
import FeatureDropDown from '../Dropdown/FeatureDropDown';
import '../../styles/SearchBarTeams.css';
import TestPlanDropDown from '../Dropdown/TestPlanDropDown';

interface Team {
  idTime: number;
  nomeTime: string;
}

export interface Product {
  idTproduto: number;
}

export interface Feature {
  idFuncionalidade: number;
}

export interface TestPlan {
  idPlano: number;
}


interface SearchParams {
  searchValue: string;
  team: Team | null;
  product: Product | null;
  feature: Feature | null;
  testPlan: TestPlan | null;
}

interface SearchBarProps {
  placeholder: string;
  onSearch: (searchParams: SearchParams) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [selectedTestPlan, setSelectedTestPlan] = useState<TestPlan | null>(null);



  const handleSearch = () => {
    onSearch({
      searchValue,
      team: selectedTeam,
      product: selectedProduct,
      feature: selectedFeature,
      testPlan: selectedTestPlan,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSelectTeam = (team: Team | string) => {
    setSelectedTeam(typeof team === 'string' ? null : team);
  };

  const handleSelectProduct = (product: Product | string | null) => {
    setSelectedProduct(typeof product === 'string' ? null : product);
  };

  const handleSelectFeature = (feature: Feature | null) => {
    setSelectedFeature(feature);
  };

  const handleSelectTestPlan = (testPlan: TestPlan | null) => {
    setSelectedTestPlan(testPlan);
  };


  return (
    <div>
      <div className="dropdown-container">
        <div className='dropdown'>
          <TeamsDropDown onSelectTeam={handleSelectTeam} selectedTeam={selectedTeam?.idTime || null} />
        </div>
        <div className='dropdown'>
          <ProductDropDown
            onSelectProduct={(selectedProductId) => {
              setSelectedProductId(selectedProductId);
              handleSelectProduct(selectedProductId !== null ? { idTproduto: selectedProductId } : null);
            }}
            selectedTeamId={selectedTeam?.idTime}
            disabled={!selectedTeam}
            isEditing={false}
            resetDropdown={!selectedTeam}
            selectedProductId={selectedProductId || null}
          />
        </div>
        <div className='dropdown'>
          <FeatureDropDown
            selectedProductId={selectedProductId}
            onSelectFeature={(selectedFeature) => handleSelectFeature(selectedFeature !== null ? { idFuncionalidade: selectedFeature } : null)}
            disabled={!selectedProductId}
            isEditing={false}
            selectedFeatureId={selectedFeature?.idFuncionalidade || null}
          />
        </div>

        <div className='dropdown'>
          <TestPlanDropDown
            selectedProductId={selectedProductId}
            onSelectTestPlan={(selectedTestPlan) => handleSelectTestPlan(selectedTestPlan !== null ? { idPlano: selectedTestPlan } : null)}
            disabled={!selectedProductId}
            isEditing={false}
            selectedTestPlanId={selectedTestPlan?.idPlano || null}
          />
        </div>
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
