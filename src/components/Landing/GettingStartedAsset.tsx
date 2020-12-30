import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './style.scss';
import OakButton from '../../oakui/OakButton';
import OakHeading from '../../oakui/OakHeading';
import OakForm from '../../oakui/OakForm';
import OakText from '../../oakui/OakText';
import { newMessageId, sendMessage } from '../../events/MessageService';
import createAsset from './service';
import { fetchAllAssets } from '../../actions/AssetActions';

interface Props {
  history: any;
}

const GettingStartedAsset = (props: Props) => {
  const dispatch = useDispatch();
  const [showCreate, setShowCreate] = useState(false);
  const [state, setState] = useState({
    name: '',
    description: '',
  });

  const handleChange = event => {
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const save = async () => {
    const jobId = newMessageId();
    sendMessage('notification', true, {
      id: jobId,
      type: 'running',
      message: `Creating asset [${state.name}]`,
    });
    const response = await createAsset({
      ...state,
      reference: state.name
        .toLowerCase()
        .replace(/\s/g, '')
        .replace(/\W/g, ''),
    });
    console.log(response);
    if (response.status === 200) {
      sendMessage('notification', true, {
        id: jobId,
        type: 'success',
        message: `Asset [${state.name}] saved successfully`,
        duration: 3000,
      });
      dispatch(fetchAllAssets());
      setState({ name: '', description: '' });
      setShowCreate(false);
    }
  };

  return (
    <div className="getting-started">
      {!showCreate && (
        <div>
          <div className="getting-started--steps space-top-2">
            <div className="typography-7">
              Are you new and need to get started?
            </div>
            <div className="typography-4">
              An asset represents an application or product being supported.
              Create an asset to get started with the process of onboarding your
              product into Expenso.
            </div>
          </div>
        </div>
      )}
      {showCreate && (
        <>
          <OakHeading title="Setup new asset" />
          <OakForm>
            <OakText
              data={state}
              id="name"
              handleChange={handleChange}
              label="Asset name"
            />
            <OakText
              data={state}
              id="description"
              handleChange={handleChange}
              label="Short description"
              multiline
            />
          </OakForm>
        </>
      )}
      <div className="action-footer position-center">
        {!showCreate && (
          <OakButton
            theme="default"
            variant="appear"
            action={() => setShowCreate(true)}
          >
            Create a new asset
          </OakButton>
        )}
        {showCreate && (
          <OakButton theme="primary" variant="appear" action={save}>
            Submit
          </OakButton>
        )}
        {showCreate && (
          <OakButton
            theme="default"
            variant="appear"
            action={() => setShowCreate(false)}
          >
            Cancel
          </OakButton>
        )}
      </div>
    </div>
  );
};

export default GettingStartedAsset;
