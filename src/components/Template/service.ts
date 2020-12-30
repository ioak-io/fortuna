import { httpPost } from '../Lib/RestTemplate';
import constants from '../Constants';
// import { sendMessage } from '../../events/MessageService';

const saveTemplate = async (space, authorization, payload) => {
  const response = await httpPost(
    `${constants.API_URL_TEMPLATE}/${space}/`,
    payload,
    {
      headers: {
        Authorization: authorization.token,
      },
    }
  );
  return response;
};

export default saveTemplate;
