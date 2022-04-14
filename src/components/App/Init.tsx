import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExpenseFilterModel from '../../model/ExpenseFilterModel';
import {
  ExpenseFilterPaginationState,
  ExpenseFilterState,
} from '../../simplestates/ExpenseFilterState';
import ExpenseListState from '../../simplestates/ExpenseListState';
import { fetchAllCategories } from '../../actions/CategoryActions';
import { receiveMessage, sendMessage } from '../../events/MessageService';
import { searchExpense } from '../Page/ExpensePage/service';
import PaginationModel from '../../model/PaginationModel';
import ExpenseStateActions from '../../simplestates/ExpenseStateActions';
import { fetchAndSetCompanyItems } from '../../actions/CompanyActions';
import { fetchAndSetUserItems } from '../../actions/UserActions';
import { fetchAndSetFilterExpenseItems } from '../../actions/FilterExpenseActions';
import { fetchAllTags } from '../../actions/TagActions';
import { setProfile } from '../../actions/ProfileActions';
import ReceiptStateActions from '../../simplestates/ReceiptStateActions';

const Init = () => {
  const authorization = useSelector((state: any) => state.authorization);
  const profile = useSelector((state: any) => state.profile);
  const [previousAuthorizationState, setPreviousAuthorizationState] =
    useState<any>();
  const [space, setSpace] = useState<string>();
  const [previousSpace, setPreviousSpace] = useState<string>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authorization?.isAuth && space) {
      //  && !previousAuthorizationState?.isAuth) {
      initialize();
      dispatch(fetchAndSetUserItems(space, authorization));
      dispatch(fetchAllCategories(space, authorization));
      dispatch(fetchAllTags(space, authorization));
      dispatch(fetchAndSetFilterExpenseItems(space, authorization));
    }
  }, [authorization, space]);

  useEffect(() => {
    if (authorization?.isAuth && !previousAuthorizationState?.isAuth) {
      dispatch(fetchAndSetCompanyItems(authorization));
      setPreviousAuthorizationState(authorization);
    }
  }, [authorization]);

  useEffect(() => {
    if (space && previousSpace !== space) {
      setPreviousSpace(space);
    }
  }, [space]);

  useEffect(() => {
    initializeProfileFromSession();
    receiveMessage().subscribe((event: any) => {
      console.log(event);
      if (event.name === 'spaceChange') {
        setSpace(event.data);
      }
      if (event.name === 'spaceChange' && authorization.isAuth) {
        initialize();
      }
    });
  }, []);

  // useEffect(() => {
  //   document.body.addEventListener('mousedown', () => {
  //     sendMessage('usingMouse', true);
  //   });

  //   // Re-enable focus styling when Tab is pressed
  //   document.body.addEventListener('keydown', (event: any) => {
  //     if (event.keyCode === 9) {
  //       sendMessage('usingMouse', false);
  //     }
  //   });
  // }, [profile]);

  useEffect(() => {
    console.log('profile.theme');
    if (profile.theme === 'theme_light') {
      document.body.style.backgroundColor = 'var(--color-global-lightmode)';
    } else {
      document.body.style.backgroundColor = 'var(--color-global-darkmode)';
    }
  }, [profile.theme]);

  const initialize = () => {
    console.log('Initialization logic here');
    if (space) {
      // dispatch(fetchAllCategories(space, authorization));
    }
  };

  const initializeProfileFromSession = () => {
    const colorMode = sessionStorage.getItem('expenso_pref_profile_colormode');
    const sidebarStatus = sessionStorage.getItem('expenso_pref_sidebar_status');

    if (colorMode || sidebarStatus) {
      dispatch(
        setProfile({
          theme: colorMode || 'theme_dark',
          sidebar: sidebarStatus === 'expanded',
        })
      );
    }
  };

  return (
    <>
      <ExpenseStateActions space={space} />
      <ReceiptStateActions space={space} />
    </>
  );
};

export default Init;
