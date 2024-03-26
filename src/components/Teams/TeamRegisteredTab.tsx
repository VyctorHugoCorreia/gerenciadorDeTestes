import React, { useEffect, useState } from 'react';
import AddTeamButton from './AddTeamButton';
import TeamTable from './TeamTable';
import TeamService from '../../services/TeamService';
import SearchBar from '../searchBar/SearchBar';

interface SearchParams {
  searchValue: string;
}


const TeamRegisteredTab: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>(
    {
      searchValue: '',
    }
  );
  const fetchTimes = async () => {
    try {
      const timesData = await TeamService.getAllTeams();
      setTeams(timesData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTimes();
  }, []);

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const filteredTeams = await TeamService.searchTeams({
        nomeTime: searchParams.searchValue
      });

      setTeams(filteredTeams);
      setSearchParams(searchParams);
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
      <TeamTable times={teams} fetchTimes={fetchTimes} />
    </div>
  );
};

export default TeamRegisteredTab;
