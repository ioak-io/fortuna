import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { newMessageId, sendMessage } from '../../../events/MessageService';
import OakButton from '../../../oakui/OakButton';
import { removeProjectMember } from '../service';

import './MemberLink.scss';

interface Props {
  space: string;
  member: any;
  user: any;
  refresh: any;
}

const MemberLink = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [showConfirm, setShowConfirm] = useState(false);

  const remove = async () => {
    const jobId = newMessageId();
    sendMessage('notification', true, {
      id: jobId,
      type: 'running',
      message: `Removing member from project`,
    });
    const response = await removeProjectMember(
      props.space,
      authorization,
      props.member._id
    );

    if (response.status === 200) {
      sendMessage('notification', true, {
        id: jobId,
        type: 'success',
        message: `Member removed from project successfully`,
        duration: 3000,
      });
      props.refresh();
    }
  };

  return (
    <div className="project-member-link">
      <div>{`${props.user?.firstName} ${props.user?.lastName}`}</div>
      <div className="project-member-link--action">
        {!showConfirm && (
          <OakButton
            theme="primary"
            variant="regular"
            action={() => setShowConfirm(true)}
          >
            Remove
          </OakButton>
        )}
        {showConfirm && (
          <>
            <OakButton
              theme="default"
              variant="regular"
              action={() => setShowConfirm(false)}
            >
              Cancel
            </OakButton>
            <OakButton theme="primary" variant="regular" action={remove}>
              Confirm
            </OakButton>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberLink;
