import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { newId } from '../../events/MessageService';
import OakButton from '../../oakui/wc/OakButton';
import OakCheckbox from '../../oakui/wc/OakCheckbox';
import OakForm from '../../oakui/wc/OakForm';
import OakInput from '../../oakui/wc/OakInput';
import OakModal from '../../oakui/wc/OakModal';
import OakSelect from '../../oakui/wc/OakSelect';

interface Props {
  data: any;
  visible: boolean;
  toggleVisibility: any;
  onSave: any;
}

const EditAttribute = (props: Props) => {
  const formId = newId();
  const [state, setState] = useState({
    name: '',
    datatype: '',
    lower: 1,
    upper: 2,
    startSequenceFrom: 0,
    enumValues: '',
    delimiter: ',',
    array: false,
  });

  useEffect(() => {
    setState({ ...state, ...props.data });
  }, [props.data]);

  const handleChange = (detail: any) => {
    setState({
      ...state,
      [detail.name]: detail.value,
    });
  };

  const handleNumberChange = (detail: any) => {
    setState({
      ...state,
      [detail.name]: parseInt(detail.value, 10),
    });
  };

  const save = () => {
    props.onSave(state);
  };

  return (
    <OakModal isOpen={props.visible} handleClose={props.toggleVisibility}>
      <div slot="body">
        <OakForm handleSubmit={save} formGroupName={formId}>
          <OakInput
            gutterBottom
            formGroupName={formId}
            value={state.name}
            name="name"
            handleInput={handleChange}
            label="Field name"
          />
          <OakSelect
            value={state.datatype}
            name="datatype"
            handleChange={handleChange}
            label="Datatype"
            options={[
              'object',
              'integer',
              'decimal',
              'char',
              'word',
              'sentence',
              'alphanumeric',
              'boolean',
              'enum',
              'sequence_number',
            ]}
            positioningStrategy="fixed"
          />
          {['sequence_number'].includes(state.datatype) && (
            <OakInput
              gutterBottom
              formGroupName={formId}
              value={state.startSequenceFrom}
              name="startSequenceFrom"
              handleChange={handleNumberChange}
              type="number"
              label="Start from"
            />
          )}
          {state.datatype &&
            !['sequence_number', 'boolean', 'enum', 'object'].includes(
              state.datatype
            ) && (
              <>
                <OakInput
                  gutterBottom
                  formGroupName={formId}
                  value={state.lower}
                  name="lower"
                  handleInput={handleNumberChange}
                  type="number"
                  label="Lower bound"
                />
                <OakInput
                  gutterBottom
                  formGroupName={formId}
                  value={state.upper}
                  name="upper"
                  handleInput={handleNumberChange}
                  type="number"
                  label="Upper bound"
                />
              </>
            )}
          {['enum'].includes(state.datatype) && (
            <>
              <OakInput
                gutterBottom
                formGroupName={formId}
                value={state.enumValues}
                name="enumValues"
                handleInput={handleChange}
                label="Possible values"
              />
              <OakInput
                gutterBottom
                formGroupName={formId}
                value={state.delimiter}
                name="delimiter"
                handleInput={handleChange}
                label="Possible values delimited by"
              />
            </>
          )}
          {state.datatype && (
            <OakCheckbox
              name="array"
              value={state.array}
              handleChange={handleChange}
            >
              Array type
            </OakCheckbox>
          )}
        </OakForm>
      </div>
      <div className="modal-footer">
        <OakButton
          type="submit"
          theme="primary"
          variant="appear"
          formGroupName={formId}
        >
          Update
        </OakButton>
      </div>
    </OakModal>
  );
};

export default EditAttribute;
