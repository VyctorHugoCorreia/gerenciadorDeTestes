import React, { useEffect, useState } from 'react';
import AcessProfileService from '../../services/AcessProfileService';
import '../../styles/AddModal.css';

interface acessProfile {
  id: string;
  name: string;
}

interface AcessProfileDropDownProps {
  onSelectAcessProfile: (perfilDeAcesso: { id: string; name: string } | string) => void;
  selectedAcessProfile?: string | null;
  disabled?: boolean; 
}

const AcessProfileDropDown: React.FC<AcessProfileDropDownProps> = ({
  onSelectAcessProfile,
  selectedAcessProfile,
  disabled = false, 
}) => {
  const [acessProfiles, setAcessProfiles] = useState<acessProfile[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | ''>('');

  useEffect(() => {
    fetchAcessProfile();
  }, []);

  useEffect(() => {
    if (selectedAcessProfile !== null && selectedAcessProfile !== undefined) {
      setSelectedValue(selectedAcessProfile);
      onSelectAcessProfileSelected(selectedAcessProfile);
    } else {
      setSelectedValue('');
    }
  }, [selectedAcessProfile]);

  
  const fetchAcessProfile = async () => {
    try {
      const acessProfilesData = await AcessProfileService.getAllAcessProfile();
      setAcessProfiles(acessProfilesData);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const onSelectAcessProfileSelected = (selectedAcessProfileId: string) => {
    const acessProfileInfo = acessProfiles.find((acessProfile) => acessProfile.id === selectedAcessProfileId);
    if (acessProfileInfo) {
      onSelectAcessProfile({ id: acessProfileInfo.id, name: acessProfileInfo.name });
    } else {
      onSelectAcessProfile('');
    }
  };

  const handleAcessProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAcessProfileId = event.target.value;
    setSelectedValue(selectedAcessProfileId);
    onSelectAcessProfileSelected(selectedAcessProfileId);
  };

  return (
    <select
      value={selectedValue}
      onChange={handleAcessProfileChange}
      className="select-dropdown"
      disabled={disabled}
    >
      <option value="">Selecione um perfil de acesso</option>
      {acessProfiles.map((acessProfile) => (
        <option key={acessProfile.id} value={acessProfile.id}>
          {acessProfile.name}
        </option>
      ))}
    </select>
  );
};

export default AcessProfileDropDown;
