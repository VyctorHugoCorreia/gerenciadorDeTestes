import React, { useState, useEffect, useCallback } from 'react';
import ScenarioTypeService from "../../services/ScenarioTypeService";

interface ScenarioType {
  idTpcenario: number;
  descTpcenario: string;
}

interface ScenarioTypeDropDownProps {
  onSelectScenarioType: (scenarioTypeId: number | null) => void;
  disabled?: boolean;
  isEditing: boolean;
  selectedScenarioTypeId: number | null;
}

const ScenarioTypeDropDown: React.FC<ScenarioTypeDropDownProps> = ({
  onSelectScenarioType,
  disabled = false,
  isEditing,
  selectedScenarioTypeId,
}) => {
  const [scenarioTypes, setScenarioTypes] = useState<ScenarioType[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const fetchScenarioTypes = useCallback(async () => {
    try {
      const typesData = await ScenarioTypeService.getScenarioTypes(); // Método para buscar os tipos de cenário
      setScenarioTypes(typesData);
    } catch (error) {
      console.error('Error fetching scenario types:', error);
    }
  }, []);

  useEffect(() => {
    fetchScenarioTypes();
  }, [fetchScenarioTypes]);

  useEffect(() => {
    setSelectedValue(selectedScenarioTypeId);
  }, [selectedScenarioTypeId]);

  const handleScenarioTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedScenarioTypeId = parseInt(event.target.value, 10);

    const newValue = isNaN(selectedScenarioTypeId) ? null : selectedScenarioTypeId;

    onSelectScenarioType(newValue);
    setSelectedValue(newValue);
  };

  return (
    <select
      value={selectedValue !== null ? selectedValue : ''}
      onChange={handleScenarioTypeChange}
      className="select-dropdown"
      disabled={disabled || isEditing}
    >
      {!isEditing && <option value="">Selecione o tipo de cenário</option>}
      {scenarioTypes.map((scenarioType) => (
        <option key={scenarioType.idTpcenario} value={scenarioType.idTpcenario}>
          {scenarioType.descTpcenario}
        </option>
      ))}
    </select>
  );
};

export default ScenarioTypeDropDown;
