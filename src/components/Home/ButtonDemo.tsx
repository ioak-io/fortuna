import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakSection from '../../oakui/OakSection';
import OakSubheading from '../../oakui/OakSubheading';
import './ButtonDemo.scss';
import ButtonDemoContrast from './ButtonDemoContrast';
import ButtonDemoIcon from './ButtonDemoIcon';
import ButtonDemoShape from './ButtonDemoShape';
import ButtonDemoSize from './ButtonDemoSize';
import ButtonDemoTheme from './ButtonDemoTheme';
import ButtonDemoVariant from './ButtonDemoVariant';

const ButtonDemo = () => {
  const authorization = useSelector(state => state.authorization);
  const [visible, setVisible] = useState(false);

  const dummyAction = () => {
    console.log('button clicked');
  };

  return (
    <div className="button-demo">
      <OakSection>
        <OakSubheading
          title="Size demonstration"
          subtitle="You can vary button dimension using size attribute"
        />
        <ButtonDemoSize />
      </OakSection>

      <OakSection>
        <OakSubheading
          title="Shape demonstration"
          subtitle="You can vary button shapes using shape attribute"
        />
        <ButtonDemoShape />
      </OakSection>

      <OakSection>
        <OakSubheading
          title="Theme demonstration"
          subtitle="You can vary color themes using theme attribute"
        />
        <ButtonDemoTheme />
      </OakSection>

      <OakSection>
        <OakSubheading
          title="Variant demonstration"
          subtitle="You can choose among available button style dynamism / hover changes using variant attribute"
        />
        <ButtonDemoVariant />
      </OakSection>
      <OakSection>
        <OakSubheading
          title="Primary color scheme contrast testing"
          subtitle="Test contrast levels on dark and light modes for primary color scheme"
        />
        <ButtonDemoContrast theme="primary" />
      </OakSection>
      <OakSection>
        <OakSubheading
          title="Secondary color scheme contrast testing"
          subtitle="Test contrast levels on dark and light modes for secondary color scheme"
        />
        <ButtonDemoContrast theme="secondary" />
      </OakSection>
      <OakSection>
        <OakSubheading
          title="Tertiary color scheme contrast testing"
          subtitle="Test contrast levels on dark and light modes for tertiary color scheme"
        />
        <ButtonDemoContrast theme="tertiary" />
      </OakSection>
      <OakSection>
        <OakSubheading
          title="Default color scheme contrast testing"
          subtitle="Test contrast levels on dark and light modes for default color scheme"
        />
        <ButtonDemoContrast theme="default" />
      </OakSection>
      <OakSection>
        <OakSubheading
          title="Info color scheme contrast testing"
          subtitle="Test contrast levels on dark and light modes for info color scheme"
        />
        <ButtonDemoContrast theme="info" />
      </OakSection>
      <OakSection>
        <OakSubheading
          title="Danger color scheme contrast testing"
          subtitle="Test contrast levels on dark and light modes for danger color scheme"
        />
        <ButtonDemoContrast theme="danger" />
      </OakSection>
      <OakSection>
        <OakSubheading
          title="Warning color scheme contrast testing"
          subtitle="Test contrast levels on dark and light modes for warning color scheme"
        />
        <ButtonDemoContrast theme="warning" />
      </OakSection>
      <OakSection>
        <OakSubheading
          title="Success color scheme contrast testing"
          subtitle="Test contrast levels on dark and light modes for success color scheme"
        />
        <ButtonDemoContrast theme="success" />
      </OakSection>
      <OakSection>
        <OakSubheading
          title="Icon demo"
          subtitle="TBD"
        />
        <ButtonDemoIcon />
      </OakSection>
    </div>
  );
};

export default ButtonDemo;
