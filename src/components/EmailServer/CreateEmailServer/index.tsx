import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './style.scss';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import OakHeading from '../../../oakui/OakHeading';
import OakForm from '../../../oakui/OakForm';
import OakText from '../../../oakui/OakText';
import OakFooter from '../../../oakui/OakFooter';
import OakButton from '../../../oakui/OakButton';
import saveEmailServer from '../service';
import { sendMessage, newMessageId } from '../../../events/MessageService';

const queryString = require('query-string');

interface Props {
  space: string;
  history: any;
  location: any;
}

const CreateEmailServer = (props: Props) => {
  const goBack = () => props.history.goBack();
  const [state, setState] = useState({
    name: '',
    sender: '',
    host: '',
    port: '',
    password: '',
    projectId: '',
    reference: '',
  });

  const authorization = useSelector(state => state.authorization);

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    setState({ ...state, projectId: query?.projectId });
  }, [props.location.search]);

  const handleChange = event => {
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleNameChange = event => {
    setState({
      ...state,
      name: event.currentTarget.value,
      reference:
        state.name === state.reference
          ? event.currentTarget.value
          : state.reference,
    });
  };

  const save = async () => {
    const jobId = newMessageId();
    sendMessage('notification', true, {
      id: jobId,
      type: 'running',
      message: `Saving template [${state.name}]`,
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
        message: `Template [${state.name}] saved successfully`,
        duration: 3000,
      });
      props.history.push(
        `/${props.space}/template?projectId=${state.projectId}`
      );
    }
  };

  return (
    <OakPage>
      <OakSection>
        <OakHeading
          title="Create new template"
          links={[
            {
              label: 'Back',
              icon: 'reply',
              action: goBack,
            },
          ]}
          linkSize="large"
        />
        <div className="create-project">
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
              disabled
              handleChange={handleChange}
              label="Reference word for server"
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
          <OakFooter>
            <OakButton theme="primary" variant="appear" action={save}>
              Save
            </OakButton>
            <OakButton theme="default" variant="appear" action={goBack}>
              Cancel
            </OakButton>
          </OakFooter>
        </div>
      </OakSection>
    </OakPage>
  );
};

export default CreateEmailServer;
