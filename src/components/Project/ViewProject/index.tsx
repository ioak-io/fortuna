import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './style.scss';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import DetailSection from './DetailSection';
import OakTab from '../../../oakui/OakTab';
import { getProjectMembers } from '../service';
import MemberSection from './MemberSection';

const queryString = require('query-string');

interface Props {
  space: string;
  history: any;
  location: any;
}

const ViewProject = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const query = queryString.parse(props.location.search);
  const project = useSelector(state =>
    state.project.projects.find(item => item.id === query.id)
  );
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (project) {
        await fetchMembers();
      }
    })();
  }, [project]);

  const fetchMembers = async () => {
    const response = await getProjectMembers(
      props.space,
      authorization,
      project._id
    );

    if (response.status === 200) {
      setMembers(response.data.data);
    }
  };

  const tabMeta = [
    {
      slotName: 'overview',
      label: 'Overview',
      icon: 'dehaze',
    },
    {
      slotName: 'member',
      label: 'Members',
      icon: 'people',
    },
    {
      slotName: 'administrator',
      label: 'Administrators',
      icon: 'admin_panel_settings',
    },
  ];

  return (
    <OakPage>
      <OakTab meta={tabMeta} variant="fullpage">
        <div slot="overview">
          <OakSection>
            <DetailSection
              project={project}
              space={props.space}
              history={props.history}
            />
          </OakSection>
        </div>
        <div slot="member">
          <OakSection>
            <MemberSection
              project={project}
              space={props.space}
              history={props.history}
              members={members}
              type="MEMBER"
              refresh={fetchMembers}
            />
          </OakSection>
        </div>
        <div slot="administrator">
          <OakSection>
            <MemberSection
              project={project}
              space={props.space}
              history={props.history}
              members={members}
              type="ADMINISTRATOR"
              refresh={fetchMembers}
            />
          </OakSection>
        </div>
      </OakTab>
    </OakPage>
  );
};

export default ViewProject;
