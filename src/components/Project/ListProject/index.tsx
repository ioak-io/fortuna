import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './style.scss';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import OakHeading from '../../../oakui/OakHeading';
import OakSubheading from '../../../oakui/OakSubheading';
import ProjectLink from './ProjectLink';

interface Props {
  space: string;
  history: any;
}

const ListProject = (props: Props) => {
  const projects = useSelector(state => state.project.projects);
  const gotoCreatePage = () =>
    props.history.push(`/${props.space}/project/create`);
  return (
    <OakPage>
      <OakSection>
        <OakHeading
          title="List of projects"
          links={[
            {
              label: 'New project',
              icon: 'playlist_add',
              action: gotoCreatePage,
            },
          ]}
          linkSize="large"
        />
        <div className="list-project">
          {projects?.map(item => (
            <ProjectLink
              key={item.id}
              space={props.space}
              history={props.history}
              project={item}
            />
          ))}
        </div>
      </OakSection>
    </OakPage>
  );
};

export default ListProject;
