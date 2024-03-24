import React, { useEffect, useState } from 'react';
import AddUserButton from './AddUserButton';
import SearchBar from './SearchBarUser';
import UserTable, { User } from './UserTable';
import UserService from '../../services/UserService';

interface PerfilDeAcesso {
  id: string;
  nome: string;
}

interface SearchParams {
  searchValueName: string;
  searchValueLogin: string;
  selectedAcessProfile: PerfilDeAcesso | null;
}

const ProductRegisteredTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchValueName: '',
    searchValueLogin: '',
    selectedAcessProfile: null,
  });
  
  const fetchUsers = async () => {
    try {
      const usersData = await UserService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const allUsers = await  UserService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const filteredUsers = await UserService.searchUsers({
        nome: searchParams.searchValueName,
        login: searchParams.searchValueLogin,
        perfilDeAcesso: searchParams.selectedAcessProfile?.nome ?? undefined,
      });

      setUsers(filteredUsers);
      setSearchParams(searchParams);
    } catch (error) {
      console.error(error);
    }
  };

  const defaultUsersTableProps = {
    open: false,
    onClose: () => {},
    onEdit: (user: User) => {},
  };

  return (
    <div>
      <AddUserButton fetchUsers={fetchAllUsers} />
      <SearchBar 
        onSearch={handleSearch}
      />
      <UserTable 
        {...defaultUsersTableProps}
        users={users} 
        fetchUsers={fetchUsers} 
      />
    </div>
  );
};

export default ProductRegisteredTab;
