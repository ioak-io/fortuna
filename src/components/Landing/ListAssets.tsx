import React from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import OakSpinner from '../../oakui/OakSpinner';
import AssetItem from './AssetItem';
import OakHeading from '../../oakui/OakHeading';

interface Props {
  history: any;
}

const ListAssets = (props: Props) => {
  const assetList = useSelector(state => state.asset);
  return (
    <div className="list-assets">
      {/* <OakHeading title="Choose an asset to proceed" /> */}
      <div className="typography-7 space-bottom-2">Choose an asset to proceed</div>
      <div className="list-assets--content">
        {assetList?.assets?.map(asset => (
          <AssetItem asset={asset} history={props.history} key={asset.id} />
        ))}
      </div>
    </div>
  );
};

export default ListAssets;
