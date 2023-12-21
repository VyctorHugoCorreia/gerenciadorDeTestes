import React, { useEffect, useState } from 'react';
import FeatureService from '../../services/FeatureService';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import FeatureModal from './FeatureModal';
import Toast from '../Toast';

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
    idTproduto: {
      idTproduto: number;
      descProduto: string;
    }
  } | null>(null);
  const [showToast, setShowToast] = useState(false); 


  const handleDeleteFeature = async (featureId: number) => {
    try {
      await FeatureService.deleteFeature(featureId);
      fetchFeatures();
      setShowToast(true)
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
        idTproduto: idTproduto.idTproduto,
        descProduto: idTproduto.descProduto,

      },
    };

    setSelectedFeature(formattedFeature);
    setIsEditModalOpen(true);
  };


  return (

    <div>
      {features.length === 0 ? (
        <h3 className="no-records-message">Nenhuma funcionalidade foi encontrada</h3>
      ) : (<table className="table-container">
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
      )}
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

      <Toast
        message="Operação realizada com sucesso!"
        showToast={showToast}
        setShowToast={setShowToast} 
      />
    </div>
  );
};

export default FeatureTable;
