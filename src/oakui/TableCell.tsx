import React, { useEffect, useState } from 'react';
import { formatDate } from '../components/Lib/DateUtils';
import OakSelect from './OakSelect';
import OakSelectNew from './OakSelectNew';
import OakSelectPlain from './OakSelectPlain';
import OakTextPlain from './OakTextPlain';
import './styles/TableCell.scss';

interface Props {
  row: any;
  header: any;
  columnKey: string;
  handleCellDataChange: any;
}

const TableCell = (props: Props) => {

  const handleChange = event => {
    // setState({
    //   ...state,
    //   [event.currentTarget.name]: event.currentTarget.value,
    // });
    if (props.handleCellDataChange) {
      props.handleCellDataChange(
        props.row,
        props.columnKey,
        event.currentTarget.value
      );
    }
  };

  // const formatDate = dateText => {
  //   if (!dateText || /^\s*$/.test(dateText)) {
  //     return '';
  //   }
  //   const date = new Date(dateText);
  //   return `${date.getFullYear()}-${date.getMonth() +
  //     1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  // };

  return (
    <div className="table-cell">
      {props.header.dtype === 'date' && formatDate(props.row[props.columnKey])}
      {['input', 'input_text'].includes(props.header.dtype) && (
        <OakTextPlain
          data={props.row}
          handleChange={handleChange}
          id={props.columnKey}
        />
      )}
      {['input_textarea'].includes(props.header.dtype) && (
        <OakTextPlain
          data={props.row}
          handleChange={handleChange}
          id={props.columnKey}
          multiline
        />
      )}
      {props.header.dtype === 'input_number' && (
        <OakTextPlain
          type="number"
          data={props.row}
          handleChange={handleChange}
          id={props.columnKey}
        />
      )}
      {props.header.dtype === 'input_select' && (
        <OakSelectPlain
          data={props.row}
          handleChange={handleChange}
          id={props.columnKey}
          objects={props.header.elements}
          elements={["fr", "gr", "lorem ipsum dolor sit", "dolor"]}
        />
      )}
      {!['date', 'input', 'input_text', 'input_textarea', 'input_number', 'input_select'].includes(props.header.dtype) &&
        props.row[props.columnKey]}
    </div>
  );
};

export default TableCell;
