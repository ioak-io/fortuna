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
import saveTemplate from '../service';
import { sendMessage, newMessageId } from '../../../events/MessageService';

const queryString = require('query-string');

interface Props {
  space: string;
  history: any;
  location: any;
}

const CreateTemplate = (props: Props) => {
  const goBack = () => props.history.goBack();
  const [state, setState] = useState({
    name: '',
    subject: '',
    body: '',
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

  const handleSubjectChange = event => {
    setState({
      ...state,
      subject: event.currentTarget.value,
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
      message: `Saving template [${state.subject}]`,
    });
    const response = await saveTemplate(props.space, authorization, {
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
        message: `Template [${state.subject}] saved successfully`,
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
              label="Template name"
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
              label="Reference word for template name"
            />
            <OakText
              data={state}
              id="subject"
              handleChange={handleSubjectChange}
              label="Email subject"
            />
            <OakText
              data={state}
              id="body"
              handleChange={handleChange}
              label="Email body"
              multiline
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

export default CreateTemplate;
