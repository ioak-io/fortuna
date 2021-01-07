import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakSection from '../../oakui/OakSection';
import ModalDemo from './ModalDemo';
import './style.scss';

interface Props {
  match: any;
  history: any;
}

const PlayModal = (props: Props) => {
  return (
    <>
      <OakSection outer>
        <OakHeading title="Modal dialog" />
      </OakSection>
      <ModalDemo />
    </>
  );
};

export default PlayModal;
