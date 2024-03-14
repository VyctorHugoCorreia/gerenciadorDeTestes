import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TestCase.css';
import '../styles/Table.css';
import TestCaseService from '../services/TestCaseService';
import HistoryStatusTestCaseTable from '../components/TestCase/HistoryStatusTestCaseTable';
import HistoryStatusScenarioService from '../services/HistoryStatusScenarioService';


interface SelectedTeam {
    idTime: number;
    nomeTime: string;
}

interface DetailsTestCaseProps {
    testCaseId?: string;
}


const DetailsTestCaseScreen: React.FC<DetailsTestCaseProps> = ({ testCaseId }) => {
    const navigate = useNavigate();
    const idCenario = testCaseId ? parseInt(testCaseId, 10) : undefined;
    const [testCase, setTestCase] = useState<any>(null);




    useEffect(() => {
        const fetchTestCase = async () => {
            try {
                const testCaseDetails = await TestCaseService.searchTestCase({idCenario});
                console.log(testCaseDetails)
                if (testCaseDetails.length > 0) {
                    setTestCase(testCaseDetails[0]);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchTestCase();
    }, [idCenario]);


    const handleVoltar = () => {
        navigate('/cenarios-de-teste');
    };


    return (
        <div className='text-style'>
            <div className='cardboard-style container'>
                <div>
                    <span className='span-label'>Status da execução:</span>
                    <h4>{testCase ? testCase.idStatus.descStatus : 'Loading...'}</h4>
                </div>

                {testCase && testCase.linkCenario !== '' && (
                    <div>
                        <span className='span-label'>Link do card a ser validado:</span>
                        <h4>{testCase.linkCenario}</h4>
                    </div>
                )}


            </div>
          
            <div className='cardboard-style'>
                <div>
                    <span className='span-label'>Titulo:</span>
                    <h4>{testCase ? testCase.tituloCenario : 'Loading...'}</h4>
                </div>

                {testCase && testCase.descCenario !== '' && (
                    <div>
                        <span className='span-label'>Descrição de cenário:</span>
                        <h4>{testCase.descCenario}</h4>
                    </div>
                )}


            </div>
            {testCase && testCase.steps && testCase.steps.length > 0 && (
                <div className='cardboard-style'>


                    <div className="table-responsive">
                        <h3>Passos a passo</h3>
                        <table className="table-container">
                            <thead>
                                <tr>
                                    <th>Nº</th>
                                    <th>Passo</th>
                                    <th>Checklist</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testCase && testCase.steps ? (
                                    testCase.steps.map((step: { passo: number; descricao: string; status: string; }, index: number) => (
                                        <tr key={index}>
                                            <td>{step.passo}</td>
                                            <td>{step.descricao}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={step.status === 'A'}
                                                    disabled={true}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3}>Carregando...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
            <h2>Informações adicionais</h2>
            <div className='cardboard-style container'>
                <div>
                    <span className='span-label'>Time:</span>
                    <h4>{testCase ? testCase.idTime.nomeTime : 'Loading...'}</h4>
                </div>
                <div>
                    <span className='span-label'>Produto:</span>
                    <h4>{testCase ? testCase.idTproduto.descProduto : 'Loading...'}</h4>
                </div>

                <div>
                    <span className='span-label'>Plano de teste:</span>
                    <h4>{testCase ? testCase.idPlano.descPlano : 'Loading...'}</h4>
                </div>

                <div>
                    <span className='span-label'>Suite de testes:</span>
                    <h4>{testCase ? testCase.idSuite.descSuite : 'Loading...'}</h4>
                </div>

                <div>
                    <span className='span-label'>Tipo de cenário:</span>
                    <h4>{testCase ? testCase.idTpcenario.descTpcenario : 'Loading...'}</h4>
                </div>

                <div>
                    <span className='span-label'>Plataforma:</span>
                    <h4>{testCase ? testCase.idPlataforma.descPlataforma : 'Loading...'}</h4>
                </div>

                <div>
                    <span className='span-label'>Status da automação:</span>
                    <h4>{testCase ? testCase.idAutomatizado.descAutomatizado : 'Loading...'}</h4>
                </div>

                <div>
                    <span className='span-label'>Tags:</span>
                    <h4>{testCase ? (testCase.tags ? testCase.tags.join(' | ') : '') : 'Loading...'}</h4>
                </div>
            </div>
            <div className='cardboard-style container'>
                <div>
                    <span className='span-label'>Histórico de execução:</span>
                    <HistoryStatusTestCaseTable idCenario={testCaseId ? testCaseId : ""} />
                </div>

            </div>



            <div className="button-container">
                <button className="voltar-button" onClick={handleVoltar}>Voltar</button>
            </div>
        </div>
    );
};

export default DetailsTestCaseScreen;
