import React, { useEffect, useState, useCallback } from 'react';
import TestPlanService from '../../services/TestPlanService';

interface TestPlan {
  idPlano: number;
  descPlano: string;
  idProduto: number;
}

interface TestPlanDropDownProps {
  selectedProductId: number | null;
  onSelectTestPlan: (testPlanId: number | null) => void;
  disabled?: boolean;
  isEditing: boolean;
}

const TestPlanDropDown: React.FC<TestPlanDropDownProps> = ({
  selectedProductId,
  onSelectTestPlan,
  disabled = false,
  isEditing
}) => {
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const fetchTestPlans = useCallback(async () => {
    try {
      if (selectedProductId) {
        const plansData = await TestPlanService.getTestPlansByProduct(selectedProductId.toString());
        setTestPlans(plansData);
      }
    } catch (error) {
      console.error('Error fetching test plans:', error);
    }
  }, [selectedProductId]);

  useEffect(() => {
    fetchTestPlans();
  }, [fetchTestPlans]);

  useEffect(() => {
    setSelectedValue(null); // Reset quando o produto selecionado muda
    setTestPlans([]);
    fetchTestPlans(); // Re-fetch dos planos de teste ao trocar o produto selecionado
  }, [selectedProductId, fetchTestPlans]);

  const handleTestPlanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTestPlanId = parseInt(event.target.value, 10);
    const selectedTestPlan = testPlans.find(plan => plan.idPlano === selectedTestPlanId);
    if (selectedTestPlan) {
      onSelectTestPlan(selectedTestPlan.idPlano);
      console.log("Test plan selected:", selectedTestPlan.idPlano);
      setSelectedValue(selectedTestPlan.idPlano);
    } else {
      onSelectTestPlan(null);
      setSelectedValue(null); // Reset do valor selecionado se nenhum plano for selecionado
    }
  };

  return (
    <select
      value={selectedValue || ''} 
      onChange={handleTestPlanChange}
      className="select-dropdown"
      disabled={disabled} 
    >
      {!isEditing && <option value="">Selecione o plano de testes</option>}
      {testPlans.map((plan) => (
        <option key={plan.idPlano} value={plan.idPlano}>
          {plan.descPlano}
        </option>
      ))}
    </select>
  );
};

export default TestPlanDropDown;
