import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './style.scss';
import OakButton from '../../../oakui/OakButton';
import OakFooter from '../../../oakui/OakFooter';
import OakForm from '../../../oakui/OakForm';
import OakText from '../../../oakui/OakText';
import { newMessageId, sendMessage } from '../../../events/MessageService';
import saveEmailServer from '../service';

interface Props {
  space: string;
  history: any;
  emailServer: any;
}

const DetailSection = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [state, setState] = useState({
    name: '',
    sender: '',
    host: '',
    port: '',
    password: '',
    projectId: '',
    reference: '',
  });

  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setState({ ...state, ...props.emailServer });
  }, [props.emailServer]);

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
    setState({ ...state, ...props.emailServer });
    setIsEdited(false);
  };

  const save = async () => {
    const jobId = newMessageId();
    sendMessage('notification', true, {
      id: jobId,
      type: 'running',
      message: `Saving project [${state.name}]`,
    });
    const response = await saveEmailServer(props.space, authorization, {
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
        message: `Email server [${state.name}] saved successfully`,
        duration: 3000,
      });
      props.history.push(`/${props.space}/email-server`);
    }
  };

  return (
    <div className="project-detail-section">
      {props.emailServer && (
        <OakForm>
          <OakText
            data={state}
            id="name"
            handleChange={handleNameChange}
            label="Server name"
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
            disabled
            label="Reference word for email server"
          />
          <OakText
            data={state}
            id="host"
            handleChange={handleChange}
            label="Host"
          />
          <OakText
            data={state}
            id="port"
            handleChange={handleChange}
            label="Port"
          />
          <OakText
            data={state}
            id="sender"
            handleChange={handleChange}
            label="Sender"
          />
          <OakText
            data={state}
            id="password"
            handleChange={handleChange}
            label="Email password"
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
