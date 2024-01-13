import React, { useState } from 'react';
import FeatureService from '../../services/FeatureService';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import FeatureModal from './FeatureModal';
import Toast from '../Toast';
import TablePagination from '@mui/material/TablePagination';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, featureId: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [featureId]: event.currentTarget,
    });
  };

  const handleClose = (featureId: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [featureId]: null,
    });
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

  const handleDeleteFeature = async (featureId: number) => {
    try {
      await FeatureService.deleteFeature(featureId);
      fetchFeatures();
      setShowToast(true);
    } catch (err) {
      console.error('Error deleting feature:', err);
      setError(`${err}`);
      setErrorPopupOpen(true);
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      {features.length === 0 ? (
        <h3 className="no-records-message">Nenhuma funcionalidade foi encontrada</h3>
      ) : (
        <>
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
              {features.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((feature) => (
                <tr key={feature.idFuncionalidade}>
                  <td>{feature.idTime.nomeTime}</td>
                  <td>{feature.descFuncionalidade}</td>
                  <td>{feature.idTproduto.descProduto}</td>
                  <td className="action-buttons">
                    <div>
                      <IconButton
                        aria-label="Opções"
                        aria-controls={`menu-options-${feature.idFuncionalidade}`}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, feature.idFuncionalidade)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`menu-options-${feature.idFuncionalidade}`}
                        anchorEl={anchorElMap[feature.idFuncionalidade]}
                        open={Boolean(anchorElMap[feature.idFuncionalidade])}
                        onClose={() => handleClose(feature.idFuncionalidade)}
                      >
                        <MenuItem onClick={() => handleEditFeature(feature)}>Editar</MenuItem>
                        <MenuItem onClick={() => handleDeleteFeature(feature.idFuncionalidade)}>Excluir</MenuItem>
                      </Menu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={features.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Itens por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </>
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
