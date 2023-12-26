import React, { useState, ChangeEvent } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import '../styles/Steps.css';

interface DynamicListProps {
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const DynamicList: React.FC<DynamicListProps> = ({ items, setItems }) => {
  const addItem = (index: number) => {
    const updatedItems = [...items.slice(0, index + 1), '', ...items.slice(index + 1)];
    setItems(updatedItems);
  };

  const removeItem = (indexToRemove: number) => {
    const updatedItems = items.filter((_, index) => index !== indexToRemove);
    setItems(updatedItems);
  };

  const handleItemChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
  };

  return (
    <div className='cardboard-container'>
      <div className='cardboard'>
        {items.map((item, index) => (
          <div className="text-container" key={index}>
            <input
              type="text"
              value={item}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(index, e.target.value)}
              className="text-field"
            />
            <button className="step-button" onClick={() => addItem(index)}>
              <FaPlus color="white" />
            </button>
            {index > 0 && (
              <button className="remove-button" onClick={() => removeItem(index)}>
                <FaMinus color="white" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicList;
