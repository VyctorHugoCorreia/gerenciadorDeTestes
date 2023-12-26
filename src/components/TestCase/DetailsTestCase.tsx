import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/TestCase.css';
import '../../styles/Table.css';
import TestCaseService from '../../services/TestCaseService';


interface SelectedTeam {
    idTime: number;
    nomeTime: string;
}

interface DetailsTestCaseProps {
    testCaseId?: string;
}


const DetailsTestCase: React.FC<DetailsTestCaseProps> = ({ testCaseId }) => {
    const navigate = useNavigate();
    const id = testCaseId ? parseInt(testCaseId, 10) : undefined;
    const [testCase, setTestCase] = useState<any>(null);



    useEffect(() => {
        const fetchTestCase = async () => {
            try {
                const testCaseDetails = await TestCaseService.searchTestCaseById(id);
                console.log(testCaseDetails)
                if (testCaseDetails.length > 0) {
                    setTestCase(testCaseDetails[0]);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchTestCase();
    }, [id]);


    const handleVoltar = () => {
        navigate('/cenarios-de-teste');
    };


    return (
        <div className='text-style'>
         <h2>Status</h2>
            <div className='cardboard-style container'>
                <div>
                    <span className='span-label'>Status da execução:</span>
                    <h4>{testCase ? testCase.idStatus.descStatus : 'Loading...'}</h4>
                </div>

                <div>
                    <span className='span-label'>Link do card a ser validado:</span>
                    <h4>{testCase ? testCase.linkCenario : 'Loading...'}</h4>
                </div>
            </div>

            <div className='cardboard-style'>
                <div>
                    <span className='span-label'>Titulo:</span>
                    <h4>{testCase ? testCase.tituloCenario : 'Loading...'}</h4>
                </div>

                <div>
                    <span className='span-label'>Descrição de cenário:</span>
                    <h4>{testCase ? testCase.descCenario : 'Loading...'}</h4>
                </div>


            </div>

            <div className='cardboard-style'>
                <h3>Passos a passo</h3>
                <div className="table-responsive">
                    <table className="table-container">
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Passo</th>
                                <th>Checklist</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Verifica se testCase existe e tem steps, e depois mapeia os passos */}
                            {testCase && testCase.steps ? (
                                testCase.steps.map((step: { passo: number; descricao: string }, index: number) => (
                                    <tr key={index}>
                                        <td>{step.passo}</td>
                                        <td>{step.descricao}</td>
                                        <td>Checklist</td>
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

                    <span className='span-label'>Funcionalidade:</span>
                    <h4>{testCase ? testCase.idFuncionalidade.descFuncionalidade : 'Loading...'}</h4>
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



            <div className="button-container">
                <button className="voltar-button" onClick={handleVoltar}>Voltar</button>
            </div>
        </div>
    );
};

export default DetailsTestCase;
