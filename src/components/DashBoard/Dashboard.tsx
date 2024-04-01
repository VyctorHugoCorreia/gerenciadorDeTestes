import React, { useState, useEffect } from 'react';
import ProductService from '../../services/ProductService';
import Metric from './Metric';
import '../../styles/dashboard.css'
import TestPlanService from '../../services/TestPlanService';
import TestSuiteService from '../../services/TestSuiteService';
import ScenarioTypeService from '../../services/ScenarioTypeService';
import ScenarioStatusService from '../../services/ScenarioStatusService';
import StatusAutomationService from '../../services/StatusAutomationService';
import { useNavigate, useParams } from 'react-router-dom';

import '../../styles/Table.css'

interface DashboardProps {
}



const Dashboard: React.FC<DashboardProps> = () => {
  const { idTeam } = useParams<{ idTeam: string }>(); 

  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [testPlan, setTestPlan] = useState<any[]>([]);
  const [testSuite, setTestSuite] = useState<any[]>([]);
  const [ScenarioType, setScenarioType] = useState<any[]>([]);
  const [ScenarioStatus, setScenarioStatus] = useState<any[]>([]);
  const [ScenarioStatusAutomation, setScenarioStatusAutomation] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (idTeam == "dashboard") {
          const productsData = await ProductService.getAllProducts();
          setProducts(productsData);

          const testPlanData = await TestPlanService.getAllTestPlan();
          setTestPlan(testPlanData)

          const testSuiteData = await TestSuiteService.getAllTestSuite();
          setTestSuite(testSuiteData)

          const ScenarioTypeData = await ScenarioTypeService.getScenarioTypes();
          setScenarioType(ScenarioTypeData)

          const ScenarioStatusData = await ScenarioStatusService.getStatusTypes();
          setScenarioStatus(ScenarioStatusData)

          const ScenarioStatusAutomationData = await StatusAutomationService.getStatusTypes();
          setScenarioStatusAutomation(ScenarioStatusAutomationData)
        }
        else {
          const productsData = await ProductService.getProductsByTeam(idTeam);
          setProducts(productsData);

          const testPlanData = await TestPlanService.getTestPlansByTeam(idTeam);
          setTestPlan(testPlanData)

          const testSuiteData = await TestSuiteService.getTestSuitesByTeam(idTeam);
          setTestSuite(testSuiteData)

          const ScenarioTypeData = await ScenarioTypeService.getScenarioTypeByTeam(idTeam);
          setScenarioType(ScenarioTypeData)

          const ScenarioStatusData = await ScenarioStatusService.getStatusTypesByTeam(idTeam);
          setScenarioStatus(ScenarioStatusData)

          const ScenarioStatusAutomationData = await StatusAutomationService.getStatusTypesByTeam(idTeam);
          setScenarioStatusAutomation(ScenarioStatusAutomationData)
        }

      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      }
    };

    fetchData();
  }, []);

  const ScenarioTotal = products.reduce((acc, product) => acc + product.scenarioQuantity, 0);

  const metricsDataProducts: Record<string, number> = products.reduce((acc, product) => {
    acc[product.descProduct] = product.scenarioQuantity;
    return acc;
  }, {});


  const metricsDataTestPlan: Record<string, number> = testPlan.reduce((acc, testPlan) => {
    acc[testPlan.descTestPlan] = testPlan.scenarioQuantity;
    return acc;
  }, {});

  const metricsDataTestSuite: Record<string, number> = testSuite.reduce((acc, testSuite) => {
    acc[testSuite.descTestSuite] = testSuite.scenarioQuantity;
    return acc;
  }, {});

  const metricsDataScenarioType: Record<string, number> = ScenarioType.reduce((acc, ScenarioType) => {
    acc[ScenarioType.descScenarioType] = ScenarioType.scenarioQuantity;
    return acc;
  }, {});
  const metricsDataScenarioStatus: Record<string, number> = ScenarioStatus.reduce((acc, ScenarioStatus) => {
    acc[ScenarioStatus.descScenarioStatus] = ScenarioStatus.scenarioQuantity;
    return acc;
  }, {});
  const metricsDataScenarioStatusAutomation: Record<string, number> = ScenarioStatusAutomation.reduce((acc, ScenarioStatusAutomation) => {
    acc[ScenarioStatusAutomation.descAutomationStatus] = ScenarioStatusAutomation.scenarioQuantity;
    return acc;
  }, {});

  const handleVoltar = () => {
    navigate('/cenarios-de-teste');
  };

  return (
    <div className="dashboard">
      <div>
        <div className="summary-table-container cardboard-style">
          <div>
            <h2>Visão resumida:</h2>
            <h3>Total de cenários de testes: <span> {ScenarioTotal}</span></h3>

            <div style={{ display: 'flex' }}>


            </div>
            <div className="summary-table">
              <table className="table-container">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Quantidade de cenários</th>
                    <th>Status automação</th>
                    <th>Quantidade de cenários</th>
                  </tr>
                </thead>
                <tbody>
                  {ScenarioStatus.map((status, index) => (
                    <tr key={`status-execution-row-${index}`}>
                      <td>{status.descScenarioStatus}</td>
                      <td>{status.scenarioQuantity}</td>
                      {ScenarioStatusAutomation[index] ? (
                        <>
                          <td>{ScenarioStatusAutomation[index].descAutomationStatus}</td>
                          <td>{ScenarioStatusAutomation[index].scenarioQuantity}</td>
                        </>
                      ) : (
                        <>
                          <td>-</td>
                          <td>-</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        <div className='cardboard-style'>
          <div>
            <h2>Visão geral:</h2>
            <Metric title="Status de execução" metrics={metricsDataScenarioStatus} />
            <Metric title="Status automação de teste" metrics={metricsDataScenarioStatusAutomation} />
            <Metric title="Tipo de testes" metrics={metricsDataScenarioType} />
            <Metric title="Produtos" metrics={metricsDataProducts} />
            <Metric title="Planos de teste" metrics={metricsDataTestPlan} />
            <Metric title="Suites de teste" metrics={metricsDataTestSuite} />
          </div>

        </div>
      </div>

      <div className="button-container">
        <button className="voltar-button" onClick={handleVoltar}>Voltar</button>
      </div>
    </div>
  );
};

export default Dashboard;
