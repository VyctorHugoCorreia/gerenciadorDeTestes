import React, { useEffect, useState, useCallback } from 'react';
import TestSuiteService from '../../services/TestSuiteService';

interface TestSuite {
  idTestSuite: number;
  descTestSuite: string;
  idTestPlan: number;
}

interface TestSuiteDropDownProps {
  selectedTestPlanId: number | null;
  onSelectTestSuite: (testSuiteId: number | null) => void;
  disabled?: boolean;
  isEditing: boolean;
  selectedTestSuiteId: number | null;
}

const TestSuiteDropDown: React.FC<TestSuiteDropDownProps> = ({
  selectedTestPlanId,
  onSelectTestSuite,
  disabled = false,
  isEditing,
  selectedTestSuiteId 
}) => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const fetchTestSuites = useCallback(async () => {
    try {
      if (selectedTestPlanId) {
        const suitesData = await TestSuiteService.getTestSuitesByPlan(selectedTestPlanId);
        setTestSuites(suitesData);
      }
    } catch (error) {
      console.error('Error fetching test suites:', error);
    }
  }, [selectedTestPlanId]);

  useEffect(() => {
    fetchTestSuites();
  }, [fetchTestSuites]);

  useEffect(() => {
    setSelectedValue(null); 
    setTestSuites([]);
    fetchTestSuites();
  }, [selectedTestPlanId, fetchTestSuites]);

  useEffect(() => {
    if (isEditing && selectedTestSuiteId !== null) {
      setSelectedValue(selectedTestSuiteId);
    }
  }, [isEditing, selectedTestSuiteId]);

  const handleTestSuiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTestSuiteId = parseInt(event.target.value, 10);
    const selectedTestSuite = testSuites.find(suite => suite.idTestSuite === selectedTestSuiteId);
    if (selectedTestSuite) {
      onSelectTestSuite(selectedTestSuite.idTestSuite);
      setSelectedValue(selectedTestSuite.idTestSuite);
    } else {
      onSelectTestSuite(null);
      setSelectedValue(null); 
    }
  };

  return (
    <select
      value={selectedValue !== null ? selectedValue : ''}
      onChange={handleTestSuiteChange}
      className="select-dropdown"
      disabled={disabled}
    >
      {<option value="">Selecione a suíte de testes</option>}
      {testSuites.map((suite) => (
        <option key={suite.idTestSuite} value={suite.idTestSuite}>
          {suite.descTestSuite}
        </option>
      ))}
    </select>
  );
};

export default TestSuiteDropDown;
