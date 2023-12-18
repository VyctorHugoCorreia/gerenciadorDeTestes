// TeamRegisteredTab.tsx
import React, { useEffect, useState } from 'react';
import AddTeamButton from './AddTeamButton';
import SearchBar from '../SearchBar';
import TeamTable from './TeamTable';
import TeamService from '../../services/TimeService';

const TeamRegisteredTab: React.FC = () => {
  const [times, setTimes] = useState<any[]>([]);

  const fetchTimes = async () => {
    try {
      const timesData = await TeamService.getAllTimes();
      setTimes(timesData);
    } catch (error) {
      console.error(error);
      // Trate o erro de acordo com o que for melhor para sua aplicação
    }
  };

  useEffect(() => {
    fetchTimes();
  }, []);

  const handleSearch = async (searchValue: string) => {
    try {
      const filteredTimes = await TeamService.searchTimes(searchValue);
      setTimes(filteredTimes);
    } catch (error) {
      console.error(error);
      // Trate o erro de acordo com o que for melhor para sua aplicação
    }
  };

  return (
    <div>
      <AddTeamButton fetchTimes={fetchTimes} />
      <SearchBar 
      placeholder="Buscar time" 
      onSearch={handleSearch}
       />
      <TeamTable times={times} fetchTimes={fetchTimes} />
    </div>
  );
};

export default TeamRegisteredTab;
