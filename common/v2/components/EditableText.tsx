import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import Typography from './Typography';
import styled from 'styled-components';

import checkmark from 'common/assets/images/icn-checkmark.svg';
import editIcon from 'common/assets/images/icn-edit.svg';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const EditIcon = styled.img`
  margin-left: 3px;
`;

interface Props {
  value: string;
  className?: string;
  bold?: boolean;
  truncate?: boolean;
  saveValue(value: string): void;
}

function EditableText({ saveValue, value, className, bold, truncate }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  return (
    <Wrapper className={className}>
      {editMode ? (
        <InputField
          value={editValue}
          onChange={e => setEditValue(e.currentTarget.value)}
          height={'1.5rem'}
          marginBottom={'0'}
          customIcon={() => (
            <img
              src={checkmark}
              onClick={() => {
                saveValue(editValue);
                setEditMode(false);
              }}
            />
          )}
        />
      ) : (
        <>
          <Typography bold={bold} truncate={truncate}>
            {value}
          </Typography>
          <EditIcon
            onClick={() => {
              setEditMode(true);
            }}
            src={editIcon}
          />
        </>
      )}
    </Wrapper>
  );
}

export default EditableText;
