

import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import '../../styles/tooltip.css'; // Substitua pelo caminho do seu arquivo CSS

const ScenarioTypeInfo = () => {
    const [showInfo, setShowInfo] = useState(false);

    const infoText = (
        <div className="tooltip-content">
            <ul className="tooltip-list">
                <li>Funcional: Verificam se o software opera como esperado testando funções específicas.</li>
                <li>Integração: Avaliam a integração harmoniosa dos módulos do software.</li>
                <li>Unidade: Testam partes individuais do código para garantir funcionamento isolado.</li>
                <li>Regressão: Certificam-se de que as mudanças no código não afetam funcionalidades existentes.</li>
                <li>Aceitação do Usuário (UAT): Validam se o software atende aos requisitos e necessidades do usuário final.</li>
                <li>Desempenho: Avaliam velocidade, escalabilidade e estabilidade em diferentes condições de carga.</li>
                <li>Segurança: Analisam vulnerabilidades para proteger contra possíveis ataques.</li>
                <li>Usabilidade: Avaliam facilidade de uso e experiência do usuário.</li>
                <li>Compatibilidade: Verificam se o software funciona em diferentes ambientes.</li>
                <li>Recuperação de Desastres: Avaliam a capacidade de recuperação em falhas ou perda de dados.</li>

            </ul>
        </div>
    );

    return (
        <Tooltip
            title={infoText}
            open={showInfo}
            onClose={() => setShowInfo(false)}
            disableFocusListener
            disableTouchListener
            PopperProps={{
                style: {},
                placement: 'bottom-start', // Ajuste para o lado direito ou esquerdo
            }}
        >
            <span style={{ cursor: 'pointer' }}>
                <InfoIcon
                    onClick={() => setShowInfo(!showInfo)}
                    className="info-icon"
                    style={{ color: '#1082BE', cursor: 'pointer' }}
                />
            </span>
        </Tooltip>
    );
};

export default ScenarioTypeInfo;

