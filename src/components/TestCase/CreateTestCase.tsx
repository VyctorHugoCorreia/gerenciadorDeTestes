import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/TestCase.css';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductDropDown from '../Dropdown/ProductDropDown';
import FeatureDropDown from '../Dropdown/FeatureDropDown';
import TestPlanDropDown from '../Dropdown/TestPlanDropDown'; // Importe o componente TestPlanDropDown

interface SelectedTeam {
  idTime: number;
  nomeTime: string;
}

const CreateTestCase: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [resetProductDropdown, setResetProductDropdown] = useState(false);
  const [selectedTestPlan, setSelectedTestPlan] = useState<number | null>(null); // Estado para o ID do plano selecionado

  const handleSelectTeam = (team: number | SelectedTeam | null | string) => {
    if (typeof team === 'string' || team === null) {
      setSelectedTeam(null);
      setResetProductDropdown(true);
      setSelectedProductId(null);
    } else if (typeof team !== 'number') {
      setSelectedTeam(team.idTime);
    }
  };

  const handleSelectProduct = (productId: number | null) => {
    setSelectedProductId(productId);
    setSelectedFeature(null);
  };

  const handleSelectFeature = (featureId: number | null) => {
    setSelectedFeature(featureId);
  };

  const handleSelectTestPlan = (testPlanId: number | null) => {
    setSelectedTestPlan(testPlanId);
  };


  return (
    <div>
      <div className='cardboard-style container'>
        {/* Teams Dropdown */}
        <div className="input-container">
          <span className='span-label'>Selecione o time:</span>
          <TeamsDropDown
            onSelectTeam={handleSelectTeam}
            selectedTeam={selectedTeam}
            disabled={false}
          />
        </div>

        {/* Product Dropdown */}
        <div className="input-container">
          <span className='span-label'>Selecione o produto:</span>
          <ProductDropDown
            onSelectProduct={handleSelectProduct}
            selectedTeamId={selectedTeam}
            disabled={!selectedTeam}
            isEditing={false}
            resetDropdown={resetProductDropdown}
            selectedProductId={selectedProductId}
          />
        </div>

        {/* Feature Dropdown */}
        <div className="input-container">
          <span className='span-label'>Selecione a funcionalidade:</span>
          <FeatureDropDown
            selectedProductId={selectedProductId}
            onSelectFeature={handleSelectFeature}
            disabled={!selectedProductId}
            isEditing={false}
            selectedFeatureId={selectedFeature}
          />
        </div>
      </div>


      <div className='cardboard-style container'>
        {/* Teams Dropdown */}
        <div className="input-container">
          <span className='span-label'>Selecione o plano de teste: </span>
          <TestPlanDropDown
            selectedProductId={selectedProductId}
            onSelectTestPlan={handleSelectTestPlan}
            disabled={!selectedProductId}
            isEditing={false}
            selectedTestPlanId={selectedTestPlan}
          />
        </div>

        


      </div>


    </div>


  );

};

export default CreateTestCase;
