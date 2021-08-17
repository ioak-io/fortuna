import React, { useState } from 'react';

import './DataStructureBuilder.scss';
import FieldElement from './FieldElement';

interface Props {
  data: any;
  id: string;
  handleChange: any;
  label: string;
}

const DataStructureBuilder = (props: Props) => {
  return (
    <div className="data-structure-builder">
      <div className="data-structure-builder__label">{props.label}</div>
      <div className="data-structure-builder__content">
        <FieldElement
          data={props.data[props.id]}
          id={props.id}
          reference={null}
          handleChange={props.handleChange}
        />
      </div>
    </div>
  );
};

export default DataStructureBuilder;
