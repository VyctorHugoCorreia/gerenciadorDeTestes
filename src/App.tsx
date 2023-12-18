// App.tsx
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TeamRegisteredTab from './components/Teams/TeamRegisteredTab'; // Importe o componente TimesCadastradosTab
import ProductRegisteredTab from './components/ProductRegisteredTab';

const App: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Cenários de teste" />
        <Tab label="Plano de teste" />
        <Tab label="Suíte de teste" />
        <Tab label="Times cadastrados" />
        <Tab label="Produtos cadastrados" />
        <Tab label="Funcionalidades cadastradas" />
      </Tabs>
      {tabValue === 3 && <TeamRegisteredTab />}
      {tabValue === 4 && <ProductRegisteredTab />}
      {/* Adicione outras verificações para renderizar outras abas */}
    </div>
  );
};

export default App;
