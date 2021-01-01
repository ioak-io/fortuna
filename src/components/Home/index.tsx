import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakHeading from '../../oakui/OakHeading';
import OakPage from '../../oakui/OakPage';
import OakSection from '../../oakui/OakSection';
import ChartDemo from './ChartDemo';
import './style.scss';
import TableDemo from './TableDemo';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  history: any;
}

const Home = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  let demoType = "chart";
  return (
    // <div className="home full">
    //   <div className="space-bottom-4">
    //     Copy below token as Authorization key on the request header from postman
    //   </div>
    //   <div className="auth-token">{authorization.token}</div>
    // </div>

    <OakPage>
      <OakSection>
        <OakHeading title="Table demo" subtitle="Laudantium eius fugit alias a iure consequatur accusantium dolores nam quasi sapiente vitae eum id aut" />
        {demoType === 'table' && <TableDemo />}
        {demoType === 'chart' && <ChartDemo />}
        <TableDemo />
      </OakSection>
    </OakPage>
  );
};

export default Home;
