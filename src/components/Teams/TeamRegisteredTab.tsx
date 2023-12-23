import React, { useEffect, useState } from 'react';
import AddTeamButton from './AddTeamButton';
import SearchBar from '../SearchBar';
import TeamTable from './TeamTable';
import TeamService from '../../services/TimeService';
import Steps from '../Steps';
const TeamRegisteredTab: React.FC = () => {
  const [times, setTimes] = useState<any[]>([]);

  const fetchTimes = async () => {
    try {
      const timesData = await TeamService.getAllTimes();
      setTimes(timesData);
    } catch (error) {
      console.error(error);
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
