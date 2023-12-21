import React, { useEffect, useState } from 'react';
import AddFeatureButton from './AddFeatureButton'; 
import SearchBar from '../SearchBar';
import FeatureTable, { Feature } from './FeatureTable';
import FeatureService from '../../services/FeatureService';

const FeatureRegisteredTab: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);

  const fetchFeatures = async () => {
    try {
      const featuresData = await FeatureService.getAllFeatures();
      setFeatures(featuresData);
    } catch (error) {
      console.error(error);
      
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleSearch = async (searchValue: string) => {
    try {
      const filteredFeatures = await FeatureService.searchFeatures(searchValue);
      setFeatures(filteredFeatures);
    } catch (error) {
      console.error(error);
    }
  };

  const defaultFeatureTableProps = {
    open: false,
    onClose: () => {},
    onEdit: (feature: Feature) => {},
  };



  return (
    <div>
        <AddFeatureButton fetchFeatures={fetchFeatures} />
      <SearchBar 
        placeholder="Buscar funcionalidade" 
        onSearch={handleSearch}
      />
      <FeatureTable 
        {...defaultFeatureTableProps}
        features={features} 
        fetchFeatures={fetchFeatures} 
      />
    </div>
  );
};

export default FeatureRegisteredTab;
