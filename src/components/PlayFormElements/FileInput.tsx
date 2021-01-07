import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakInputFile from '../../oakui/OakInputFile';
import OakSection from '../../oakui/OakSection';
import OakTable from '../../oakui/OakTable';
import './FileInput.scss';
import packetBlack from '../../images/oneauth_white_small.svg';

const FileInput = () => {
  const [state, setState] = useState<any>({
    testFiles: null
  });

  const handleChange = event => {
    console.log(event);
  }

  return (
      <OakSection subtitle="File input">
        <OakInputFile data={state} id="testFiles" handleChange={handleChange} placeholder="Custom placeholder" label="File one" multiple />
        <OakInputFile data={state} id="testFiles" handleChange={handleChange} label="File two lorem ipsum"/>
        <OakInputFile data={state} id="testFiles" handleChange={handleChange} label="File two lorem ipsum">
        <img
          className="file-input--packet"
          src={packetBlack}
        />
          </OakInputFile>
      </OakSection>
  );
};

export default FileInput;
