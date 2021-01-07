import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { receiveMessage } from '../../events/MessageService';

const Init = () => {
  const authorization = useSelector(state => state.authorization);
  const [previousAuthorizationState, setPreviousAuthorizationState] = useState<
    any
  >();
  const [space, setSpace] = useState<string>();
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      authorization.isAuth &&
      authorization.isAuth !== previousAuthorizationState.isAuth &&
      space
    ) {
      initialize();
    }
    setPreviousAuthorizationState(authorization);
  }, [authorization]);

  useEffect(() => {
    receiveMessage().subscribe(event => {
      if (event.name === 'spaceChange') {
        setSpace(event.data);
      }
      if (event.name === 'spaceChange' && authorization.isAuth) {
        initialize();
      }
    });
  }, []);

  const initialize = () => {
    console.log('Initialization logic here');
  };
  return <></>;
};

export default Init;
