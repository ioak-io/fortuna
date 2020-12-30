import React from 'react';

import './TemplateLink.scss';

interface Props {
  space: string;
  history: any;
  template: any;
}

const TemplateLink = (props: Props) => {
  const goToViewPage = () =>
    props.history.push(`/${props.space}/template/view?id=${props.template.id}`);
  return (
    <div
      aria-label="Link to view template details"
      className="template-link"
      onClick={goToViewPage}
    >
      <div aria-label="Template Name" className="project-link--name">
        {props.template.name}
      </div>
    </div>
  );
};

export default TemplateLink;
