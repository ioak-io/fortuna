import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakInputFile from '../../oakui/OakInputFile';
import OakCard from '../../oakui/OakCard';
import OakTable from '../../oakui/OakTable';
import './SelectInput.scss';
import packetBlack from '../../images/oneauth_white_small.svg';
import OakSelectNew from '../../oakui/OakSelectNew';
import OakSelectPlain from '../../oakui/OakSelectPlain';

const SelectInput = () => {
  const [state, setState] = useState({
    testField: '',
  });

  const handleChange = event => {
    console.log(event);
    setState({...state, [event.currentTarget.name]: event.currentTarget.value});
  };

  return (
    <OakCard title="Select input">
      <OakSelectNew
        data={state}
        id="testField"
        handleChange={handleChange}
        label="Test label"
        elements={[
          'one',
          'two',
          'three',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
        ]}
      />
      <OakSelectPlain
        data={state}
        id="testField"
        handleChange={handleChange}
        label="Test label"
        elements={[
          'one',
          'two',
          'three',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
          'lorem ipsum dolor sit',
          'dsas sdafds af ds f dsaf',
        ]}
      />
    </OakCard>
  );
};

export default SelectInput;
