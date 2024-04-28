import React, { useEffect, useState } from 'react';
import TeamService from '../../services/TeamService';
import '../../styles/AddModal.css';

interface Team {
  idTeam: number;
  nameTeam: string;
}

interface TeamsDropDownProps {
  onSelectTeam: (team: { idTeam: number; nameTeam: string } | string) => void;
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
  const [loading, setLoading] = useState<boolean>(true); 

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
    } finally {
      setLoading(false); 
    }
  };

  const onSelectTeamSelected = (selectedTeamId: number) => {
    const teamInfo = teams.find((team) => team.idTeam === selectedTeamId);
    if (teamInfo) {
      onSelectTeam({ idTeam: teamInfo.idTeam, nameTeam: teamInfo.nameTeam });
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
      disabled={loading} 
    >
      {loading ? (
        <option value="">Carregando...</option>
      ) : (
        <>
          <option value="">Selecione o time</option>
          {teams.map((team) => (
            <option key={team.idTeam} value={team.idTeam}>
              {team.nameTeam}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default TeamsDropDown;
