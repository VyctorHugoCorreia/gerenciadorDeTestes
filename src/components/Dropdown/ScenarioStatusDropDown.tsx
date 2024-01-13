import React, { useState, useEffect, useCallback } from 'react';
import ScenarioStatusService from "../../services/ScenarioStatusService";
import '../../styles/TestCase.css';

interface ScenarioStatus {
  idStatus: number;
  descStatus: string;
}

interface ScenarioStatusDropDownProps {
  onSelectScenarioStatus: (ScenarioStatusId: number | null) => void;
  disabled?: boolean;
  isEditing: boolean;
  selectedScenarioStatusId: number | null;
}

const ScenarioStatusDropDown: React.FC<ScenarioStatusDropDownProps> = ({
  onSelectScenarioStatus,
  disabled = false,
  isEditing,
  selectedScenarioStatusId,
}) => {
  const [scenarioStatus, setScenarioStatuss] = useState<ScenarioStatus[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const fetchScenarioStatus = useCallback(async () => {
    try {
      const typesData = await ScenarioStatusService.getStatusTypes(); 
      setScenarioStatuss(typesData);
    } catch (error) {
      console.error('Error fetching plataform types:', error);
    }
  }, []);

  useEffect(() => {
    if (!isEditing) {
      onSelectScenarioStatus(3);
      setSelectedValue(3);
    } else {
      setSelectedValue(selectedScenarioStatusId);
    }
  }, [isEditing, onSelectScenarioStatus, selectedScenarioStatusId]);


  useEffect(() => {
    fetchScenarioStatus();
  }, [fetchScenarioStatus]);

  useEffect(() => {
    setSelectedValue(selectedScenarioStatusId);
  }, [selectedScenarioStatusId]);

  const handleScenarioStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedScenarioStatusId = parseInt(event.target.value, 10);
    const newValue = isNaN(selectedScenarioStatusId) ? null : selectedScenarioStatusId;
    onSelectScenarioStatus(newValue);
    setSelectedValue(newValue);
  };

  return (
    <select
      value={selectedValue !== null ? selectedValue : ''}
      onChange={handleScenarioStatusChange}
      className="select-dropdown scenario-status-dropdown"
      disabled={disabled}
    >
      <option value="">Selecione o status</option>
      {scenarioStatus.map((scenarioStatus) => (
        <option key={scenarioStatus.idStatus} value={scenarioStatus.idStatus}>
          {scenarioStatus.descStatus}
        </option>
      ))}
    </select>
  );
};

export default ScenarioStatusDropDown;
