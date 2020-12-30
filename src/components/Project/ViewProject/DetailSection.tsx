import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './style.scss';
import OakSubheading from '../../../oakui/OakSubheading';
import OakButton from '../../../oakui/OakButton';
import OakFooter from '../../../oakui/OakFooter';
import OakForm from '../../../oakui/OakForm';
import OakText from '../../../oakui/OakText';
import { newMessageId, sendMessage } from '../../../events/MessageService';
import { saveProject } from '../service';

const queryString = require('query-string');

interface Props {
  space: string;
  history: any;
  project: any;
}

const DetailSection = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [state, setState] = useState({
    reference: '',
    description: '',
    name: '',
  });

  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setState({ ...state, ...props.project });
  }, [props.project]);

  const gotoEditPage = () => {
    console.log('edit page');
  };

  const handleChange = event => {
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
    setIsEdited(true);
  };

  const handleNameChange = event => {
    setState({
      ...state,
      name: event.currentTarget.value,
      reference:
        state.name === state.reference
          ? state.reference
          : event.currentTarget.value,
    });
    setIsEdited(true);
  };

  const discardChanges = () => {
    setState({ ...state, ...props.project });
    setIsEdited(false);
  };

  const save = async () => {
    const jobId = newMessageId();
    sendMessage('notification', true, {
      id: jobId,
      type: 'running',
      message: `Saving project [${state.name}]`,
    });
    const response = await saveProject(props.space, authorization, {
      ...state,
      reference: state.reference
        .toLowerCase()
        .replace(/\s/g, '')
        .replace(/\W/g, ''),
    });
    console.log(response);
    if (response.status === 200) {
      sendMessage('notification', true, {
        id: jobId,
        type: 'success',
        message: `Project [${state.name}] saved successfully`,
        duration: 3000,
      });
      props.history.push(`/${props.space}/project`);
    }
  };

  return (
    <div className="project-detail-section">
      {props.project && (
        <OakForm>
          <OakText
            data={state}
            id="name"
            handleChange={handleNameChange}
            label="Project name"
          />
          <OakText
            data={{
              ...state,
              reference: state.reference
                .toLowerCase()
                .replace(/\s/g, '')
                .replace(/\W/g, ''),
            }}
            id="reference"
            handleChange={handleChange}
            label="Reference word for URL path prefix"
          />
          <OakText
            data={state}
            id="description"
            handleChange={handleChange}
            label="Short description about the project"
            multiline
          />
        </OakForm>
      )}
      {isEdited && (
        <OakFooter>
          <OakButton theme="primary" variant="appear" action={save}>
            Save
          </OakButton>
          <OakButton theme="default" variant="appear" action={discardChanges}>
            Discard
          </OakButton>
        </OakFooter>
      )}
    </div>
  );
};

export default DetailSection;
