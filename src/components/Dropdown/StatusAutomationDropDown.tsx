import React, { useState, useEffect, useCallback } from 'react';
import StatusAutomationTypeService from "../../services/StatusAutomationService";

interface StatusAutomationType {
  idAutomatizado: number;
  descAutomatizado: string;
}

interface StatusAutomationTypeDropDownProps {
  onSelectStatusAutomationType: (StatusAutomationTypeId: number | null) => void;
  disabled?: boolean;
  isEditing: boolean;
  selectedStatusAutomationTypeId: number | null;
}

const StatusAutomationTypeDropDown: React.FC<StatusAutomationTypeDropDownProps> = ({
  onSelectStatusAutomationType,
  disabled = false,
  isEditing,
  selectedStatusAutomationTypeId,
}) => {
  const [statusAutomationTypes, setStatusAutomationTypes] = useState<StatusAutomationType[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const fetchStatusAutomationTypes = useCallback(async () => {
    try {
      const typesData = await StatusAutomationTypeService.getStatusTypes(); 
      setStatusAutomationTypes(typesData);
    } catch (error) {
      console.error('Error fetching plataform types:', error);
    }
  }, []);

  useEffect(() => {
    fetchStatusAutomationTypes();
  }, [fetchStatusAutomationTypes]);

  useEffect(() => {
    setSelectedValue(selectedStatusAutomationTypeId);
  }, [selectedStatusAutomationTypeId]);

  const handleStatusAutomationTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatusAutomationTypeId = parseInt(event.target.value, 10);
    const newValue = isNaN(selectedStatusAutomationTypeId) ? null : selectedStatusAutomationTypeId;
    onSelectStatusAutomationType(newValue);
    setSelectedValue(newValue);
  };

  return (
    <select
      value={selectedValue !== null ? selectedValue : ''}
      onChange={handleStatusAutomationTypeChange}
      className="select-dropdown"
      disabled={disabled || isEditing}
    >
      {!isEditing && <option value="">Selecione o status da automação de teste</option>}
      {statusAutomationTypes.map((statusAutomationTypes) => (
        <option key={statusAutomationTypes.idAutomatizado} value={statusAutomationTypes.idAutomatizado}>
          {statusAutomationTypes.descAutomatizado}
        </option>
      ))}
    </select>
  );
};

export default StatusAutomationTypeDropDown;
