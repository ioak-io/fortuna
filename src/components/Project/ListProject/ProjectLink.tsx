import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './ProjectLink.scss';

interface Props {
  space: string;
  history: any;
  project: any;
}

const ProjectLink = (props: Props) => {
  const goToViewPage = () =>
    props.history.push(`/${props.space}/project/view?id=${props.project.id}`);
  return (
    <div className="project-link" onClick={goToViewPage}>
      <div className="project-link--name">{props.project.name}</div>
    </div>
  );
};

export default ProjectLink;
