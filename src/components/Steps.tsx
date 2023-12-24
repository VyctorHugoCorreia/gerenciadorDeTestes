import React, { useState, ChangeEvent } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import '../styles/Steps.css';

interface GherkinScenarioProps {
  steps: string[];
  setSteps: React.Dispatch<React.SetStateAction<string[]>>;
}

const GherkinScenario: React.FC<GherkinScenarioProps> = ({ steps, setSteps }) => {
  const addStep = (index: number) => {
    const updatedSteps = [...steps.slice(0, index + 1), '', ...steps.slice(index + 1)];
    printUpdatedList(updatedSteps);
    setSteps(updatedSteps);
  };

  const removeStep = (indexToRemove: number) => {
    const updatedSteps = steps.filter((_, index) => index !== indexToRemove);
    printUpdatedList(updatedSteps);
    setSteps(updatedSteps);
  };

  const handleStepChange = (index: number, value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  const printUpdatedList = (updatedSteps: string[]) => {
    const passos = updatedSteps.map((desc_steps, index) => ({
      desc_steps,
      ordem: index + 1,
    }));

    console.log(JSON.stringify({ passos }, null, 2));
  };

  return (
    <div className='cardboard-container'>
      <div className='cardboard'>
        {steps.map((step, index) => (
          <div className="text-container" key={index}>
            <input
              type="text"
              value={step}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleStepChange(index, e.target.value)}
              className="text-field"
            />
            <button className="step-button" onClick={() => addStep(index)}>
              <FaPlus color="white" />
            </button>
            {index > 0 && (
              <button className="remove-button" onClick={() => removeStep(index)}>
                <FaMinus color="white" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GherkinScenario;
