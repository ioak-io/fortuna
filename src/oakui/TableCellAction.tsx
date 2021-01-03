import React, { useEffect, useState } from 'react';
import OakButton from './OakButton';
import './styles/TableCellAction.scss';

interface Props {
  row: any;
  actions: any[];
}

const TableCellAction = (props: Props) => {
  const handleClick = action => {
    action.actionHandler(action.actionName, props.row);
  };

  return (
    <div className="table-cell-action">
      {props.actions.map(item => (
        <div className="table-cell-action--item">
          <OakButton
            theme={item.theme || 'default'}
            action={() => handleClick(item)}
            variant={item.variant || 'block'}
          >
            {item.icon && <i className="material-icons">{item.icon}</i>}
            {item.label}
          </OakButton>
        </div>
      ))}
    </div>
  );
};

export default TableCellAction;
