import React, { useState, useEffect, useCallback } from 'react';
import Chart from 'chart.js/auto';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface MetricProps {
  title: string;
  metrics: Record<string, number>;
}

const Metric: React.FC<MetricProps> = ({ title, metrics }) => {
  const [totalCenarios, setTotalCenarios] = useState<number>(0);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

  const handleAccordionChange = useCallback((event: React.ChangeEvent<{}>, expanded: boolean) => {
    setAccordionOpen(expanded);
  }, []);

  useEffect(() => {
    const total = Object.values(metrics).reduce((acc, val) => acc + val, 0);
    setTotalCenarios(total);
  }, [metrics]);

  useEffect(() => {
    if (accordionOpen) {
      const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
      };

      const ctx = document.getElementById(`${title}-chart`) as HTMLCanvasElement | null;

      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: Object.keys(metrics),
            datasets: [
              {
                label: `Quantidade de cenários por ${title}`,
                data: Object.values(metrics),
                backgroundColor: Object.keys(metrics).map(() => generateRandomColor()),
                borderWidth: 1,
              },
            ],
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: `Total de cenários: ${totalCenarios}`,
              },
            },
          },
        });

        return () => {
          chart.destroy();
        };
      }
    }
  }, [title, metrics, totalCenarios, accordionOpen]);

  return (
    <Accordion
      expanded={accordionOpen}
      onChange={handleAccordionChange}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${title}-content`}
        id={`${title}-header`}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="metric cardboard-style">
          <h1>{title}</h1>
          <div className="chartCanvas">
            <canvas id={`${title}-chart`} />
          </div>
          <table className="table-container">
            <thead>
              <tr>
                <th>{`${title}`}</th>
                <th>Quantidade de cenários</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(metrics).map(([item, count]) => (
                <tr key={item}>
                  <td>{item}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Metric;
