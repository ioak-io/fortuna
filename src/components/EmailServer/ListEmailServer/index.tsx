import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './style.scss';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import OakHeading from '../../../oakui/OakHeading';
import OakForm from '../../../oakui/OakForm';
import OakSelect from '../../../oakui/OakSelect';
import OakButton from '../../../oakui/OakButton';
import OakFooter from '../../../oakui/OakFooter';
import EmailServerLink from './EmailServerLink';

const queryString = require('query-string');

interface Props {
  space: string;
  history: any;
  location: any;
}

const ListEmailServer = (props: Props) => {
  const projects = useSelector(state => state.project.projects);
  const [state, setState] = useState({
    projectId: '',
  });
  const [emailServers, setEmailServers] = useState<any[]>();
  const [projectElements, setProjectElements] = useState<any>([]);

  const allEmailServers = useSelector(state => state.emailServer.emailServers);

  useEffect(() => {
    setEmailServers(
      allEmailServers.filter(item => item.projectId === state.projectId)
    );
  }, [state.projectId, allEmailServers]);

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    setState({ ...state, projectId: query?.projectId });
  }, [props.location.search]);

  useEffect(() => {
    const localState: any[] = [];
    projects.map(item => {
      localState.push({ key: item.id, value: item.name });
    });
    setProjectElements(localState);
  }, [projects]);

  const gotoCreatePage = () =>
    props.history.push(
      `/${props.space}/email-server/create?projectId=${state.projectId}`
    );

  const handleProjectChange = event => {
    props.history.push(
      `/${props.space}/email-server?projectId=${event.currentTarget.value}`
    );
  };

  return (
    <OakPage>
      <OakSection>
        <OakHeading title="Email Servers" subtitle="Manage email servers" />
        <OakForm>
          <OakSelect
            id="projectId"
            data={state}
            handleChange={handleProjectChange}
            label="Choose project"
            objects={projectElements}
          />
        </OakForm>
        {state.projectId && (
          <>
            <OakFooter>
              <OakButton
                action={gotoCreatePage}
                theme="primary"
                variant="appear"
              >
                New email server
              </OakButton>
            </OakFooter>
            <div
              aria-label="List of Email Servers"
              className="list-email-servers"
            >
              {emailServers?.map(item => (
                <EmailServerLink
                  key={item.id}
                  space={props.space}
                  history={props.history}
                  template={item}
                />
              ))}
            </div>
          </>
        )}
      </OakSection>
    </OakPage>
  );
};

export default ListEmailServer;
