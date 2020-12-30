import { httpDelete, httpGet, httpPost, httpPut } from '../Lib/RestTemplate';
import constants from '../Constants';
import { sendMessage } from '../../events/MessageService';

export const saveProject = async (space, authorization, payload) => {
  const response = await httpPost(
    `${constants.API_URL_PROJECT}/${space}/`,
    payload,
    {
      headers: {
        Authorization: authorization.token,
      },
    }
  );
  return response;
};

export const addProjectMember = async (space, authorization, payload) => {
  const response = await httpPost(
    `${constants.API_URL_PROJECTMEMBER}/${space}/`,
    payload,
    {
      headers: {
        Authorization: authorization.token,
      },
    }
  );
  return response;
};

export const getProjectMembers = async (space, authorization, projectId) => {
  const response = await httpGet(
    `${constants.API_URL_PROJECTMEMBER}/${space}/project/${projectId}`,
    {
      headers: {
        Authorization: authorization.token,
      },
    }
  );
  return response;
};

export const removeProjectMember = async (space, authorization, id) => {
  const response = await httpDelete(
    `${constants.API_URL_PROJECTMEMBER}/${space}/${id}`,
    {
      headers: {
        Authorization: authorization.token,
      },
    }
  );
  return response;
};
