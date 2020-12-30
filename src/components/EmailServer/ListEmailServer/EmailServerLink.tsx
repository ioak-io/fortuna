import React from 'react';

import './EmailServerLink.scss';

interface Props {
  space: string;
  history: any;
  template: any;
}

const EmailServerLink = (props: Props) => {
  const goToViewPage = () =>
    props.history.push(
      `/${props.space}/email-server/view?id=${props.template.id}`
    );
  return (
    <div
      aria-label="Link to view email server details"
      className="email-server-link"
      onClick={goToViewPage}
    >
      <div aria-label="Email server Name" className="project-link--name">
        {props.template.name}
      </div>
    </div>
  );
};

export default EmailServerLink;
