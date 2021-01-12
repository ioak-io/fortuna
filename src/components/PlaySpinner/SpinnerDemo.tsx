import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakCard from '../../oakui/OakCard';
import OakSpinner from '../../oakui/OakSpinner';
import './SpinnerDemo.scss';

const SpinnerDemo = () => {
  const staticText =
    'Quam delectus sint quo atque in quasi aliquid vel veniam exercitationem aliquam possimus molestiae eos alias. Quo cupiditate quibusdam soluta quo neque vel illum perferendis facilis saepe dicta officiis. Assumenda velit reprehenderit ipsa aliquam placeat sequi vitae eveniet iure dolores inventore iste similique libero aspernatur quidem ratione. Ipsa deserunt magni numquam reprehenderit veniam maiores labore enim temporibus exercitationem labore nisi temporibus nemo cumque ullam optio. Quae nesciunt facilis et molestiae sed assumenda nam architecto maxime unde soluta. Officia alias asperiores itaque reiciendis voluptas sint ut hic pariatur voluptate suscipit rerum earum. Iste consectetur dolore recusandae expedita officia non explicabo dicta temporibus';
  return (
    <div className="spinner-demo">
      <OakCard subtitle="Chasing dots">
        <div className="spinner-demo--section">
          <OakSpinner style="chasing-dots" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Moving dots">
        <div className="spinner-demo--section">
          {/* <OakSpinner style="moving-dots" /> */}
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Double bounce">
        <div className="spinner-demo--section">
          <OakSpinner style="double-bounce" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Moving cube">
        <div className="spinner-demo--section">
          <OakSpinner style="shifting-cube" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Circle zoom">
        <div className="spinner-demo--section">
          <OakSpinner style="circle-zoom" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Twin dots">
        <div className="spinner-demo--section">
          <OakSpinner style="twin-dots" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Bouncing dots">
        <div className="spinner-demo--section">
          <OakSpinner style="bouncing-dots" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Rotating plane">
        <div className="spinner-demo--section">
          <OakSpinner style="rotating-plane" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Stretching bars">
        <div className="spinner-demo--section">
          <OakSpinner style="stretching-bars" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Circling dots">
        <div className="spinner-demo--section">
          <OakSpinner style="circling-dots" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Circling and bouncing dots">
        <div className="spinner-demo--section">
          <OakSpinner style="circling-and-bouncing-dots" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Checker grid">
        <div className="spinner-demo--section">
          <OakSpinner style="checker-grid" />
          {staticText}
        </div>
      </OakCard>
      <OakCard subtitle="Folding cube">
        <div className="spinner-demo--section">
          <OakSpinner style="folding-cube" />
          {staticText}
        </div>
      </OakCard>
    </div>
  );
};

export default SpinnerDemo;
