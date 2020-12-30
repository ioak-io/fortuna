import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import OakSubheading from '../../../oakui/OakSubheading';
import OakAutoComplete from '../../../oakui/OakAutoComplete';
import { addProjectMember } from '../service';
import { newMessageId, sendMessage } from '../../../events/MessageService';
import OakButton from '../../../oakui/OakButton';
import MemberLink from './MemberLink';

interface Props {
  space: string;
  history: any;
  project: any;
  members: any[];
  type: 'MEMBER' | 'ADMINISTRATOR';
  refresh: any;
}

const MemberSection = (props: Props) => {
  const users = useSelector(state => state.user.users);
  const authorization = useSelector(state => state.authorization);
  const [userMap, setUserMap] = useState<any>({});

  useEffect(() => {
    const localMap = {};
    users?.forEach(item => (localMap[item._id] = item));
    setUserMap(localMap);
  }, [users]);

  const gotoEditPage = () => {
    console.log('edit page');
  };

  const addUser = async userId => {
    const jobId = newMessageId();
    sendMessage('notification', true, {
      id: jobId,
      type: 'running',
      message: `Adding member to project`,
    });
    const response = await addProjectMember(props.space, authorization, {
      userId,
      projectId: props.project._id,
      type: props.type,
    });
    if (response.status === 200) {
      sendMessage('notification', true, {
        id: jobId,
        type: 'success',
        message: `Member added to project successfully`,
        duration: 3000,
      });
      props.refresh();
    }
  };
  return (
    <div className="project-member-section">
      {users && (
        <OakAutoComplete
          handleChange={addUser}
          objects={users?.map(item => {
            return {
              key: item._id,
              value: `${item.firstName} ${item.lastName}`,
            };
          })}
          label="Search for users to add"
        />
      )}
      {props.project && (
        <div className="project-member-section--content">
          {props.members
            .filter(item => item.type === props.type)
            .map(member => (
              <MemberLink
                user={userMap[member.userId]}
                member={member}
                key={member._id}
                space={props.space}
                refresh={props.refresh}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default MemberSection;
