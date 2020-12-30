import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OakButton from '../../../oakui/OakButton';
import OakText from '../../../oakui/OakText';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import OakHeading from '../../../oakui/OakHeading';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import { fetchSpace } from '../../Auth/AuthService';
import SpaceItem from './SpaceItem';
import './style.scss';

interface Props {
  history: any;
  location: any;
  space: string;
}

const queryString = require('query-string');

const OneAuth = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [view, setView] = useState<Array<any> | undefined>(undefined);
  const [searchCriteria, setSearchCriteria] = useState({ text: '' });

  useEffect(() => {
    const queryParam = queryString.parse(props.location.search);
    if (queryParam.space) {
      window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${queryParam.space}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}&from=${queryParam.from}`;
    }
  }, []);

  useEffect(() => {
    fetchSpace().then(response => {
      setView(search(response.data, searchCriteria.text));
    });
  }, [searchCriteria]);

  const search = (existingSpace, criteria) => {
    if (isEmptyOrSpaces(criteria)) {
      return existingSpace;
    }
    return existingSpace.filter(
      item => item.name.toLowerCase().indexOf(criteria.toLowerCase()) !== -1
    );
  };

  const handleSearchCriteria = event => {
    setSearchCriteria({
      ...searchCriteria,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (authorization.isAuth) {
      props.history.push(`/${props.space}/article`);
    }
  }, [authorization]);

  const goBack = () => {
    props.history.goBack();
  };

  const getHeadingLinks = () => {
    const links: any[] = [];
    if (props.history.length > 2) {
      links.push({
        label: 'Go back',
        icon: 'reply',
        action: () => goBack(),
      });
    }
    return links;
  };

  return (
    <OakPage>
      <OakSection>
        <div className="view-space-item">
          <div className="page-header">
            <OakHeading
              title="Login via Oneauth"
              subtitle="You will be redirected to oneauth for signing in to your space"
              links={getHeadingLinks()}
              linkSize="large"
            />
            {/* <div className="action-header position-right">
              {props.history.length > 2 && (
                <OakButton
                  action={() => cancelCreation()}
                  theme="default"
                  variant="appear"
                >
                  <i className="material-icons">close</i>Back
                </OakButton>
              )}
            </div> */}
          </div>
          <OakText
            label="Type company name to filter"
            handleChange={handleSearchCriteria}
            id="text"
            data={searchCriteria}
          />
          <div className="list-spaces">
            <div className="list-spaces--content">
              {view?.map(space => (
                <SpaceItem
                  history={props.history}
                  space={space}
                  key={space._id}
                />
              ))}
            </div>
          </div>
        </div>
      </OakSection>
    </OakPage>
  );
};

export default OneAuth;
