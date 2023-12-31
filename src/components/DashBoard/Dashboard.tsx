import React, { useState, useEffect } from 'react';
import ProductService from '../../services/ProductService';
import Metric from './Metric';
import '../../styles/dashboard.css'
import FeatureService from '../../services/FeatureService';
import TestPlanService from '../../services/TestPlanService';
import TestSuiteService from '../../services/TestSuiteService';
import ScenarioTypeService from '../../services/ScenarioTypeService';
import ScenarioStatusService from '../../services/ScenarioStatusService';
import StatusAutomationService from '../../services/StatusAutomationService';
import '../../styles/Table.css'

interface DashboardProps {
  idTime?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ idTime }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [feature, setFeature] = useState<any[]>([]);
  const [testPlan, setTestPlan] = useState<any[]>([]);
  const [testSuite, setTestSuite] = useState<any[]>([]);
  const [ScenarioType, setScenarioType] = useState<any[]>([]);
  const [ScenarioStatus, setScenarioStatus] = useState<any[]>([]);
  const [ScenarioStatusAutomation, setScenarioStatusAutomation] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await ProductService.getProductsByTeam(idTime);
        setProducts(productsData);

        const featureData = await FeatureService.getFeatureByTeam(idTime);
        setFeature(featureData)

        const testPlanData = await TestPlanService.getTestPlansByTeam(idTime);
        setTestPlan(testPlanData)

        const testSuiteData = await TestSuiteService.getTestSuitesByTeam(idTime);
        setTestSuite(testSuiteData)

        const ScenarioTypeData = await ScenarioTypeService.getScenarioTypeByTeam(idTime);
        setScenarioType(ScenarioTypeData)

        const ScenarioStatusData = await ScenarioStatusService.getStatusTypesByTeam(idTime);
        setScenarioStatus(ScenarioStatusData)

        const ScenarioStatusAutomationData = await StatusAutomationService.getStatusTypesByTeam(idTime);
        setScenarioStatusAutomation(ScenarioStatusAutomationData)
      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      }
    };

    fetchData();
  }, []);

  const totalCenarios = products.reduce((acc, product) => acc + product.quantidadeCenarios, 0);

  const metricsDataProducts: Record<string, number> = products.reduce((acc, product) => {
    acc[product.descProduto] = product.quantidadeCenarios;
    return acc;
  }, {});

  const metricsDataFeatures: Record<string, number> = feature.reduce((acc, functionality) => {
    acc[functionality.descFuncionalidade] = functionality.quantidadeCenarios;
    return acc;
  }, {});

  const metricsDataTestPlan: Record<string, number> = testPlan.reduce((acc, testPlan) => {
    acc[testPlan.descPlano] = testPlan.quantidadeCenarios;
    return acc;
  }, {});

  const metricsDataTestSuite: Record<string, number> = testSuite.reduce((acc, testSuite) => {
    acc[testSuite.descSuite] = testSuite.quantidadeCenarios;
    return acc;
  }, {});

  const metricsDataScenarioType: Record<string, number> = ScenarioType.reduce((acc, ScenarioType) => {
    acc[ScenarioType.descTpcenario] = ScenarioType.quantidadeCenarios;
    return acc;
  }, {});
  const metricsDataScenarioStatus: Record<string, number> = ScenarioStatus.reduce((acc, ScenarioStatus) => {
    acc[ScenarioStatus.descStatus] = ScenarioStatus.quantidadeCenarios;
    return acc;
  }, {});
  const metricsDataScenarioStatusAutomation: Record<string, number> = ScenarioStatusAutomation.reduce((acc, ScenarioStatusAutomation) => {
    acc[ScenarioStatusAutomation.descAutomatizado] = ScenarioStatusAutomation.quantidadeCenarios;
    return acc;
  }, {});
  return (
    <div className="dashboard">
      <div>
        <div>
          <h2>Visão resumida:</h2>
          <h3>Total de cenários de testes: <span> {totalCenarios}</span></h3>
        </div>

        <div className="summary-table-container cardboard-style">
          <div className="summary-table">
            <table className="table-container">
              <thead>
                <tr>
                  <th>Status da Execução</th>
                  <th>Quantidade de Cenários</th>
                </tr>
              </thead>
              <tbody>
                {ScenarioStatus.map((status, index) => (
                  <tr key={`status-execution-row-${index}`}>
                    <td>{status.descStatus}</td>
                    <td>{status.quantidadeCenarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          <div className="summary-table">
            <table className="table-container ">
              <thead>
                <tr>
                  <th>Status da Automação</th>
                  <th>Quantidade de Cenários</th>
                </tr>
              </thead>
              <tbody>
                {ScenarioStatusAutomation.map((automationStatus, index) => (
                  <tr key={`status-automation-row-${index}`}>
                    <td>{automationStatus.descAutomatizado}</td>
                    <td>{automationStatus.quantidadeCenarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2>Visão geral:</h2>
          <Metric title="Status de execução" metrics={metricsDataScenarioStatus} />
          <Metric title="Status automação de teste" metrics={metricsDataScenarioStatusAutomation} />
          <Metric title="Tipo de testes" metrics={metricsDataScenarioType} />
          <Metric title="Produtos" metrics={metricsDataProducts} />
          <Metric title="Planos de teste" metrics={metricsDataTestPlan} />
          <Metric title="Suites de teste" metrics={metricsDataTestSuite} />
          <Metric title="Funcionalidades" metrics={metricsDataFeatures} />



        </div>


      </div>
    </div>
  );
};

export default Dashboard;
