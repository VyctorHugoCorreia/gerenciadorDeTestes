import React, { useEffect, useState, useCallback } from 'react';
import FeatureService from '../../services/FeatureService';

interface Feature {
  idFuncionalidade: number;
  descFuncionalidade: string;
  idProduto: number;
}

interface FeatureDropDownProps {
  selectedProductId: number | null;
  onSelectFeature: (featureId: number | null) => void;
  disabled?: boolean;
  isEditing: boolean;
  selectedFeatureId: number | null;
}

const FeatureDropDown: React.FC<FeatureDropDownProps> = ({
  selectedProductId,
  onSelectFeature,
  disabled = false,
  isEditing,
  selectedFeatureId,
}) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const fetchFeatures = useCallback(async () => {
    try {
      if (selectedProductId !== null) {
        const featuresData = await FeatureService.getFeatureByProduct(selectedProductId.toString());
        setFeatures(featuresData);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  }, [selectedProductId]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  useEffect(() => {
    if (!isEditing) {
      setSelectedValue(null);
    }
    setSelectedValue(selectedFeatureId);
  }, [isEditing, selectedFeatureId]);

  const handleTestPlanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFeatureId = parseInt(event.target.value, 10);
    const selectedFeature = features.find((feature) => feature.idFuncionalidade === selectedFeatureId);
    if (selectedFeature) {
      onSelectFeature(selectedFeature.idFuncionalidade);
      setSelectedValue(selectedFeature.idFuncionalidade);
    } else {
      onSelectFeature(null);
      setSelectedValue(null);
    }
  };

  return (
    <select
      value={selectedValue !== null ? selectedValue : ''}
      onChange={handleTestPlanChange}
      className="select-dropdown"
      disabled={disabled || isEditing}
    >
      {!isEditing && <option value="">Selecione a funcionalidade</option>}
      {features.map((feature) => (
        <option key={feature.idFuncionalidade} value={feature.idFuncionalidade}>
          {feature.descFuncionalidade}
        </option>
      ))}
    </select>
  );
};

export default FeatureDropDown;
