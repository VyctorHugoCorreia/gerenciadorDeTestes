import React, { useState } from 'react';
import '../../styles/TestCase.css';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductDropDown from '../Dropdown/ProductDropDown';

interface SelectedTeam {
  idTime: number;
  nomeTime: string;
}

const CreateTestCase: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [resetProductDropdown, setResetProductDropdown] = useState(false);

  const handleSelectTeam = (team: number | SelectedTeam | null | string) => {
    if (typeof team === 'string' || team === null) {
      setSelectedTeam(null);
      setResetProductDropdown(true);
      setSelectedProductId(0);
    } else if (typeof team !== 'number') {
      setSelectedTeam(team.idTime);
    }
  };

  const handleSelectProduct = (productId: number | null) => {
    setSelectedProductId(productId);
  };

  return (
    <div className='cardboard-style'>
      {/* Teams Dropdown */}
      <TeamsDropDown
        onSelectTeam={handleSelectTeam}
        selectedTeam={selectedTeam}
        disabled={false}
      />

      {/* Product Dropdown */}
      <ProductDropDown
        onSelectProduct={handleSelectProduct}
        selectedTeamId={selectedTeam}
        disabled={!selectedTeam}
        isEditing={false}
        resetDropdown={resetProductDropdown}
        selectedProductId={selectedProductId}
      />
    </div>
  );
};

export default CreateTestCase;
