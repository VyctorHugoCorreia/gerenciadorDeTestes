import React, { useEffect, useState } from 'react';
import FeatureService from '../../services/FeatureService';
import '../../styles/Teams/TimeTable.css';
import ErrorPopup from '../ErrorPopup';
import FeatureModal from './FeatureModal'; // Importe o componente FeatureModal

export interface Feature {
  idFuncionalidade: number;
  descFuncionalidade: string;
  idTime: {
    idTime: number;
    nomeTime: string;
  };
  idTproduto: {
    idTproduto: number;
    descProduto: string;
    idTime: {
      idTime: number;
      nomeTime: string;
    };
  };
}

interface FeatureTableProps {
  features: Feature[];
  fetchFeatures: () => void;
}

const FeatureTable: React.FC<FeatureTableProps> = ({ features, fetchFeatures }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{
    id: number;
    name: string;
    idTime: {
      idTime: number;
      nomeTime: string;
    };
  } | null>(null);

  const handleDeleteFeature = async (featureId: number) => {
    try {
      await FeatureService.deleteFeature(featureId);
      fetchFeatures();
    } catch (err) {
      console.error('Error deleting feature:', err);
      setError(`${err}`);
      setErrorPopupOpen(true);
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  const handleEditFeature = (feature: Feature) => {
    const { idFuncionalidade, descFuncionalidade, idTime, idTproduto } = feature;

    const formattedFeature = {
      id: idFuncionalidade,
      name: descFuncionalidade,
      idTime: {
        idTime: idTime.idTime,
        nomeTime: idTime.nomeTime,
      },
      idTproduto: {
        id: idTproduto.idTproduto,
        name: idTproduto.descProduto,
        idTime: {
          idTime: idTproduto.idTime.idTime,
          nomeTime: idTproduto.idTime.nomeTime,
        },
      },
    };

    setSelectedFeature(formattedFeature);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <table className="table-container">
        <thead>
          <tr>
            <th>Time</th>
            <th>Funcionalidade</th>
            <th>Produto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.idFuncionalidade}>
              <td>{feature.idTime.nomeTime}</td>
              <td>{feature.descFuncionalidade}</td>
              <td>{feature.idTproduto.descProduto}</td>
              <td className="action-buttons">
                <button onClick={() => handleEditFeature(feature)}>Editar</button>
                <button onClick={() => handleDeleteFeature(feature.idFuncionalidade)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ErrorPopup
        open={errorPopupOpen}
        onClose={handleCloseErrorPopup}
        errorMessage={error}
      />

      <FeatureModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFeature(null);
        }}
        fetchFeatures={fetchFeatures}
        selectedFeature={selectedFeature}
      />
    </div>
  );
};

export default FeatureTable;
