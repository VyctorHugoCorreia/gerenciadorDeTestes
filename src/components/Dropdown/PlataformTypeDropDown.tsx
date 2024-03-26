import React, { useState, useEffect, useCallback } from 'react';
import PlataformTypeService from "../../services/PlataformTypeService";

interface PlataformType {
  idPlataforma: number;
  descPlataforma: string;
}

interface PlataformTypeDropDownProps {
  onSelectPlataformType: (PlataformTypeId: number | null) => void;
  disabled?: boolean;
  isEditing: boolean;
  selectedPlataformTypeId: number | null;
}

const PlataformTypeDropDown: React.FC<PlataformTypeDropDownProps> = ({
  onSelectPlataformType,
  disabled = false,
  isEditing,
  selectedPlataformTypeId,
}) => {
  const [plataformTypes, setPlataformTypes] = useState<PlataformType[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const fetchPlataformTypes = useCallback(async () => {
    try {
      const typesData = await PlataformTypeService.getPlataformTypes();
      setPlataformTypes(typesData);
    } catch (error) {
      console.error('Error fetching plataform types:', error);
    }
  }, []);

  useEffect(() => {
    fetchPlataformTypes();
  }, [fetchPlataformTypes]);

  useEffect(() => {
    setSelectedValue(selectedPlataformTypeId);
  }, [selectedPlataformTypeId]);

  const handlePlataformTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlataformTypeId = parseInt(event.target.value, 10);
    const newValue = isNaN(selectedPlataformTypeId) ? null : selectedPlataformTypeId;
    onSelectPlataformType(newValue);
    setSelectedValue(newValue);
  };

  return (
    <select
      value={selectedValue !== null ? selectedValue : ''}
      onChange={handlePlataformTypeChange}
      className="select-dropdown"
      disabled={disabled || isEditing}
    >
      {!isEditing && <option value="">Selecione a plataforma</option>}
      {plataformTypes.map((plataformTypes) => (
        <option key={plataformTypes.idPlataforma} value={plataformTypes.idPlataforma}>
          {plataformTypes.descPlataforma}
        </option>
      ))}
    </select>
  );
};

export default PlataformTypeDropDown;
