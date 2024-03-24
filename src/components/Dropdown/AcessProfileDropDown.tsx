import React, { useEffect, useState } from 'react';
import AcessProfileService from '../../services/AcessProfileService';
import '../../styles/AddModal.css';

interface acessProfile {
  id: string;
  nome: string;
}

interface TeamsDropDownProps {
  onSelectAcessProfile: (perfilDeAcesso: { id: string; nome: string } | string) => void;
  selectedAcessProfile?: string | null;
  disabled?: boolean; 
}

const TeamsDropDown: React.FC<TeamsDropDownProps> = ({
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
      onSelectAcessProfile({ id: acessProfileInfo.id, nome: acessProfileInfo.nome });
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
          {acessProfile.nome}
        </option>
      ))}
    </select>
  );
};

export default TeamsDropDown;
