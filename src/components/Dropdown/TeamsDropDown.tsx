import React, { useEffect, useState } from 'react';
import TeamService from '../../services/TimeService';
import '../../styles/AddModal.css';

interface Team {
  idTime: number;
  nomeTime: string;
}

interface TeamsDropDownProps {
  onSelectTeam: (team: { idTime: number; nomeTime: string } | string) => void;
  selectedTeam?: number | null;
  disabled?: boolean; 
}

const TeamsDropDown: React.FC<TeamsDropDownProps> = ({
  onSelectTeam,
  selectedTeam,
  disabled = false, 
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | ''>('');

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam !== null && selectedTeam !== undefined) {
      setSelectedValue(selectedTeam);
      onSelectTeamSelected(selectedTeam);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const teamsData = await TeamService.getAllTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const onSelectTeamSelected = (selectedTeamId: number) => {
    const teamInfo = teams.find((team) => team.idTime === selectedTeamId);
    if (teamInfo) {
      onSelectTeam({ idTime: teamInfo.idTime, nomeTime: teamInfo.nomeTime });
    } else {
      onSelectTeam('');
    }
  };

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeamId = parseInt(event.target.value, 10);
    setSelectedValue(selectedTeamId);
    onSelectTeamSelected(selectedTeamId);
  };

  return (
    <select
      value={selectedValue}
      onChange={handleTeamChange}
      className="select-dropdown"
      disabled={disabled}
    >
      <option value="">Selecione o time</option>
      {teams.map((team) => (
        <option key={team.idTime} value={team.idTime}>
          {team.nomeTime}
        </option>
      ))}
    </select>
  );
};

export default TeamsDropDown;
