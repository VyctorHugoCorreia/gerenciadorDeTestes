import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

// Definindo os tipos de evidência
type EvidenceType = 'video' | 'image' | 'gif' | 'pdf' | 'word';

// Definindo as propriedades do componente
interface EvidenceViewerProps {
  type: EvidenceType;
  src: string;
}

// Estilos do componente
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    media: {
      maxWidth: '100%',
    },
  }),
);

// Componente EvidenceViewer
const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ type, src }) => {
  const classes = useStyles();

  const renderEvidence = () => {
    switch (type) {
        case 'video':
            if (src.includes('youtube.com') || src.includes('youtu.be')) {
              const videoId = src.split('=')[1] || src.split('/').slice(-1)[0];
              return (
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allowFullScreen
                />
              );
            } else {
              return <video src={src} controls />;
            }
      case 'image':
        return <img src={src} alt="evidence" className={classes.media} />;
      case 'gif':
        return <img src={src} alt="evidence" className={classes.media} />;
      case 'pdf':
        return <embed src={src} type="application/pdf" width="100%" height="600px" />;
      case 'word':
        return <iframe src={src} title="evidence" width="100%" height="600px" />;
      default:
        return null;
    }
  };

  return (
    <Paper className={classes.paper}>
      {renderEvidence()}
    </Paper>
  );
};

export default EvidenceViewer;
