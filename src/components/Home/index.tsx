import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakSection from '../../oakui/OakSection';
import './style.scss';

interface Props {
  match: any;
  history: any;
}

const Home = (props: Props) => {
  return (
      <OakSection>
        <OakHeading title="Welcome home" />
      </OakSection>
  );
};

export default Home;
