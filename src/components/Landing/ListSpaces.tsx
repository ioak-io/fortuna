import React from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import OakSpinner from '../../oakui/OakSpinner';
import OakHeading from '../../oakui/OakHeading';
import SpaceItem from './SpaceItem';

interface Props {
  history: any;
}

const ListSpaces = (props: Props) => {
  const spaceList = useSelector(state => state.space);
  return (
    <div className="list-spaces">
      <OakHeading title="Choose a space to proceed" />
      <div className="list-spaces--content">
        {spaceList?.spaces?.map(space => (
          <SpaceItem space={space} history={props.history} key={space.id} />
        ))}
      </div>
    </div>
  );
};

export default ListSpaces;
