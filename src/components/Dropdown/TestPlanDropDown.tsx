import React, { useEffect, useState, useCallback } from 'react';
import TestPlanService from '../../services/TestPlanService';

interface TestPlan {
  idTestPlan: number;
  descTestPlan: string;
  idProduct: number;
}

interface TestPlanDropDownProps {
  selectedProductId: number | null;
  onSelectTestPlan: (testPlanId: number | null) => void;
  disabled?: boolean;
  isEditing: boolean;
  selectedTestPlanId: number | null;
}

const TestPlanDropDown: React.FC<TestPlanDropDownProps> = ({
  selectedProductId,
  onSelectTestPlan,
  disabled = false,
  isEditing,
  selectedTestPlanId 
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
    setSelectedValue(null); 
    setTestPlans([]);
    fetchTestPlans();
  }, [selectedProductId, fetchTestPlans]);

  useEffect(() => {
    if (isEditing && selectedTestPlanId !== null) {
      setSelectedValue(selectedTestPlanId);
    }
  }, [isEditing, selectedTestPlanId]);

  const handleTestPlanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTestPlanId = parseInt(event.target.value, 10);
    const selectedTestPlan = testPlans.find(plan => plan.idTestPlan === selectedTestPlanId);
    if (selectedTestPlan) {
      onSelectTestPlan(selectedTestPlan.idTestPlan);
      setSelectedValue(selectedTestPlan.idTestPlan);
    } else {
      onSelectTestPlan(null);
      setSelectedValue(null); 
    }
  };

  return (
    <select
      value={selectedValue !== null ? selectedValue : ''}
      onChange={handleTestPlanChange}
      className="select-dropdown"
      disabled={disabled}
      
    >
      {<option value="">Selecione o plano de testes</option>}
      {testPlans.map((plan) => (
        <option key={plan.idTestPlan} value={plan.idTestPlan}>
          {plan.descTestPlan}
        </option>
      ))}
    </select>
  );
};

export default TestPlanDropDown;
