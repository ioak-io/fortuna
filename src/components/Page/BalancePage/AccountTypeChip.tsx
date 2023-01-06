import React, { useEffect, useState } from 'react';
import './AccountTypeChip.scss';

interface Props {
  value: string;
  activeValue: string;
  handleClick: any;
}

const AccountTypeChip = (props: Props) => {
  const handleClick = () => {
    props.handleClick(props.value);
  };

  return (
    <button
      className={`button account-type-chip ${
        props.value === props.activeValue
          ? 'account-type-chip--active'
          : 'account-type-chip--inactive'
      }`}
      onClick={handleClick}
    >
      {props.value}
    </button>
  );
};

export default AccountTypeChip;
