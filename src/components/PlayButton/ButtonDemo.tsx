import React, { useState } from 'react';
import OakContainer from '../../oakui/OakContainer';
import OakSubheading from '../../oakui/OakSubheading';
import './ButtonDemo.scss';
import ButtonDemoContrast from './ButtonDemoContrast';
import ButtonDemoIcon from './ButtonDemoIcon';
import ButtonDemoShape from './ButtonDemoShape';
import ButtonDemoSize from './ButtonDemoSize';
import ButtonDemoTheme from './ButtonDemoTheme';
import ButtonDemoVariant from './ButtonDemoVariant';

const ButtonDemo = () => {
  return (
    <OakContainer paddingHorizontal={4} paddingVertical={2}>
      <div className="button-demo">
        <div>
          <OakSubheading
            title="Size demonstration"
            subtitle="You can vary button dimension using size attribute"
          />
          <ButtonDemoSize />
        </div>

        <div>
          <OakSubheading
            title="Shape demonstration"
            subtitle="You can vary button shapes using shape attribute"
          />
          <ButtonDemoShape />
        </div>
        <div>
          <OakSubheading
            title="Theme demonstration"
            subtitle="You can vary color themes using theme attribute"
          />
          <ButtonDemoTheme />
        </div>
        <div>
          <OakSubheading
            title="Variant demonstration"
            subtitle="You can choose among available button style dynamism / hover changes using variant attribute"
          />
          <ButtonDemoVariant />
        </div>
        <div>
          <OakSubheading
            title="Primary color scheme contrast testing"
            subtitle="Test contrast levels on dark and light modes for primary color scheme"
          />
          <ButtonDemoContrast theme="primary" />
        </div>
        <div>
          <OakSubheading
            title="Secondary color scheme contrast testing"
            subtitle="Test contrast levels on dark and light modes for secondary color scheme"
          />
          <ButtonDemoContrast theme="secondary" />
        </div>
        <div>
          <OakSubheading
            title="Tertiary color scheme contrast testing"
            subtitle="Test contrast levels on dark and light modes for tertiary color scheme"
          />
          <ButtonDemoContrast theme="tertiary" />
        </div>
        <div>
          <OakSubheading
            title="Default color scheme contrast testing"
            subtitle="Test contrast levels on dark and light modes for default color scheme"
          />
          <ButtonDemoContrast theme="default" />
        </div>
        <div>
          <OakSubheading
            title="Info color scheme contrast testing"
            subtitle="Test contrast levels on dark and light modes for info color scheme"
          />
          <ButtonDemoContrast theme="info" />
        </div>
        <div>
          <OakSubheading
            title="Danger color scheme contrast testing"
            subtitle="Test contrast levels on dark and light modes for danger color scheme"
          />
          <ButtonDemoContrast theme="danger" />
        </div>
        <div>
          <OakSubheading
            title="Warning color scheme contrast testing"
            subtitle="Test contrast levels on dark and light modes for warning color scheme"
          />
          <ButtonDemoContrast theme="warning" />
        </div>
        <div>
          <OakSubheading
            title="Success color scheme contrast testing"
            subtitle="Test contrast levels on dark and light modes for success color scheme"
          />
          <ButtonDemoContrast theme="success" />
        </div>
        <div>
          <OakSubheading title="Icon demo" subtitle="TBD" />
          <ButtonDemoIcon />
        </div>
      </div>
    </OakContainer>
  );
};

export default ButtonDemo;
