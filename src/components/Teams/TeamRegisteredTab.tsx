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
  const fetchTeams = async () => {
    try {
      const teamsData = await TeamService.getAllTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const filteredTeams = await TeamService.searchTeams({
        nameTeam: searchParams.searchValue
      });

      setTeams(filteredTeams);
      setSearchParams(searchParams);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <AddTeamButton fetchTeams={fetchTeams} />
      <SearchBar
      placeholder="Buscar time" 
      onSearch={handleSearch}
       />
      <TeamTable teams={teams} fetchTeams={fetchTeams} />
    </div>
  );
};

export default TeamRegisteredTab;
