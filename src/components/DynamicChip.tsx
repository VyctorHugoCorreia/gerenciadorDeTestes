import React, { useState, ChangeEvent } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { Clear } from '@mui/icons-material';
import '../styles/dynamicChip.css'

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
          <Chip
            key={index}
            label={
              <div className="chip-content">
                <InputBase
                  value={item}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(index, e.target.value)}
                  className="input-base"
               
                />
              </div>
            }
            onDelete={index !== 0 ? () => removeItem(index) : undefined}
            color="primary"
            className="chip"
            deleteIcon={<Clear className="delete-icon" />}
          />
        ))}
        <IconButton onClick={() => addItem(items.length - 1)} className='add-button'>
          <FaPlus color='white'/>
        </IconButton>
      </div>
    </div>
  );
};

export default DynamicList;
