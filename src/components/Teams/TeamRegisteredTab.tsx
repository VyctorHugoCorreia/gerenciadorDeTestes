import React, { useEffect, useState } from 'react';
import AddTeamButton from './AddTeamButton';
import SearchBarTeams from '../searchBar/SearchBarTestCase';
import TeamTable from './TeamTable';
import TeamService from '../../services/TimeService';
import SearchBar from '../SearchBar';
const TeamRegisteredTab: React.FC = () => {
  const [times, setTimes] = useState<any[]>([]);

  const fetchTimes = async () => {
    try {
      const timesData = await TeamService.getAllTeams();
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
      const filteredTimes = await TeamService.searchTeams(searchValue);
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
