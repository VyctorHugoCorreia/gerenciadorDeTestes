import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LoginForm from './screens/LoginForm';
import Dashboard from './components/DashBoard/Dashboard';
import CreateTestCase from './screens/CreateTestCaseScreen';
import EditTestCase from './screens/EditTestCaseScreen';
import DetailsTestCase from './screens/DetailsTestCaseScreen';
import TestCaseRegisteredTab from './components/TestCase/TestCaseRegisteredTab';
import TestPlanRegisteredTab from './components/TestPlan/TestPlanRegisteredTab';
import TestSuiteRegisteredTab from './components/TestSuite/TestSuiteRegisteredTab';
import TeamRegisteredTab from './components/Teams/TeamRegisteredTab';
import ProductRegisteredTab from './components/Products/ProductRegisteredTab';
import { getAuthentication } from './authentication/authentication'; 


const App: React.FC = () => {
  const navigate = useNavigate();

  const checkAuthentication = () => {
   
    return getAuthentication();
  };

  const AuthenticatedTabs = () => {
    return (
      <Tabs>
        <Tab label="Cenários de teste" component={Link} to="/cenarios-de-teste" />
        <Tab label="Plano de teste" component={Link} to="/plano-de-teste" />
        <Tab label="Suíte de teste" component={Link} to="/suite-de-teste" />
        <Tab label="Times cadastrados" component={Link} to="/times-cadastrados" />
        <Tab label="Produtos cadastrados" component={Link} to="/produtos-cadastrados" />
      </Tabs>
    );
  };

  const requireAuth = (element: React.ReactNode) => {
    if (checkAuthentication()) {
      return element;
    } else {
      navigate('/login');
      return null;
    }
  };

  return (
    <>
      {checkAuthentication() && <AuthenticatedTabs />}

      <Routes>
        <Route
          path="/login"
          element={<LoginForm/>}
        />
        <Route
          path="/dashboard"
          element={requireAuth(<Dashboard />)}
        />
        <Route
          path="/criar-caso-de-teste"
          element={requireAuth(<CreateTestCase />)}
        />
        <Route
          path="/edit-test-case/:id"
          element={requireAuth(<EditTestCase />)}
        />
        <Route
          path="/details-test-case/:id"
          element={requireAuth(<DetailsTestCase />)}
        />
        <Route
          path="/cenarios-de-teste"
          element={requireAuth(<TestCaseRegisteredTab />)}
        />
        <Route
          path="/plano-de-teste"
          element={requireAuth(<TestPlanRegisteredTab />)}
        />
        <Route
          path="/suite-de-teste"
          element={requireAuth(<TestSuiteRegisteredTab />)}
        />
        <Route
          path="/times-cadastrados"
          element={requireAuth(<TeamRegisteredTab />)}
        />
        <Route
          path="/produtos-cadastrados"
          element={requireAuth(<ProductRegisteredTab />)}
        />
      </Routes>
    </>
  );
};

export default App;
