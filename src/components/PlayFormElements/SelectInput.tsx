import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakInputFile from '../../oakui/OakInputFile';
import OakSection from '../../oakui/OakSection';
import OakTable from '../../oakui/OakTable';
import './SelectInput.scss';
import packetBlack from '../../images/oneauth_white_small.svg';
import OakSelectNew from '../../oakui/OakSelectNew';

const SelectInput = () => {
  const [state, setState] = useState({
    testField: ''
  });
  
  const handleChange = event => {
    console.log(event);
  }

  return (
      <OakSection subtitle="Select input">
        <OakSelectNew data={state} id="testField" handleChange={handleChange} elements={["one", "two", "three"]} />
      </OakSection>
  );
};

export default SelectInput;
