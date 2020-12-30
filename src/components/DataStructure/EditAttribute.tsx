import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import OakForm from '../../oakui/OakForm';
import OakText from '../../oakui/OakText';
import OakFooter from '../../oakui/OakFooter';
import OakButton from '../../oakui/OakButton';
import OakModal from '../../oakui/OakModal';
import OakSelect from '../../oakui/OakSelect';
import OakCheckbox from '../../oakui/OakCheckbox';

interface Props {
  data: any;
  visible: boolean;
  toggleVisibility: any;
  onSave: any;
}

const EditAttribute = (props: Props) => {
  const [state, setState] = useState({
    name: '',
    datatype: '',
    lower: 1,
    upper: 2,
    array: false,
  });

  useEffect(() => {
    setState({ ...state, ...props.data });
  }, [props.data]);

  const handleChange = event => {
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleNumberChange = event => {
    setState({
      ...state,
      [event.currentTarget.name]: parseInt(event.currentTarget.value, 10),
    });
  };

  const handleCheckboxChange = event => {
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.checked,
    });
  };

  const save = () => {
    props.onSave(state);
  };

  return (
    <OakModal visible={props.visible} toggleVisibility={props.toggleVisibility}>
      <OakForm>
        <OakText
          data={state}
          id="name"
          handleChange={handleChange}
          label="Field name"
        />
        <OakSelect
          data={state}
          id="datatype"
          handleChange={handleChange}
          label="Datatype"
          elements={[
            'char',
            'word',
            'sentence',
            'integer',
            'decimal',
            'alphanumeric',
            'boolean',
            'sequence_number',
            'object',
          ]}
        />
        <OakText
          data={state}
          id="lower"
          handleChange={handleNumberChange}
          type="number"
          label="Lower bound"
        />
        <OakText
          data={state}
          id="upper"
          handleChange={handleNumberChange}
          type="number"
          label="Upper bound"
        />
        <OakCheckbox
          id="array"
          data={state}
          handleChange={handleCheckboxChange}
          theme="primary"
          variant="circle"
          label="Array type"
        />
      </OakForm>
      <OakFooter>
        <OakButton theme="primary" variant="appear" action={save}>
          Update
        </OakButton>
      </OakFooter>
    </OakModal>
  );
};

export default EditAttribute;
