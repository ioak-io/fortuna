import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakHeading from '../../oakui/OakHeading';
import OakPage from '../../oakui/OakPage';
import OakSection from '../../oakui/OakSection';
import ChartDemo from './ChartDemo';
import ModalDemo from './ModalDemo';
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
      <OakSection outer>
        <OakHeading title="Table demo" subtitle="Laudantium eius fugit alias a iure consequatur accusantium dolores nam quasi sapiente vitae eum id aut" />
        </OakSection>
        <ModalDemo />
        <TableDemo />
        <ChartDemo />
    </OakPage>
  );
};

export default Home;
