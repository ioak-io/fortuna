import React, { useEffect, useState } from 'react';
import { formatDate } from '../components/Lib/DateUtils';
import OakSelect from './OakSelect';
import OakSelectPlain from './OakSelectPlain';
import OakTextPlain from './OakTextPlain';
import './styles/TableCell.scss';

interface Props {
  row: any;
  headerMap: any;
  columnKey: string;
  handleCellDataChange: any;
}

const TableCell = (props: Props) => {
  const [dtype, setDtype] = useState('text');
  const [elements, setElements] = useState<any>([]);

  useEffect(() => {
    setDtype(props.headerMap[props.columnKey]?.dtype);
    setElements(props.headerMap[props.columnKey]?.elements);
  }, [props.headerMap, props.columnKey]);

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
      {dtype === 'date' && formatDate(props.row[props.columnKey])}
      {['input', 'input_text'].includes(dtype) && (
        <OakTextPlain
          data={props.row}
          handleChange={handleChange}
          id={props.columnKey}
        />
      )}
      {['input_textarea'].includes(dtype) && (
        <OakTextPlain
          data={props.row}
          handleChange={handleChange}
          id={props.columnKey}
          multiline
        />
      )}
      {dtype === 'input_number' && (
        <OakTextPlain
          type="number"
          data={props.row}
          handleChange={handleChange}
          id={props.columnKey}
        />
      )}
      {dtype === 'input_select' && (
        <OakSelectPlain
          data={props.row}
          handleChange={handleChange}
          id={props.columnKey}
          objects={elements}
        />
      )}
      {!['date', 'input', 'input_text', 'input_textarea', 'input_number', 'input_select'].includes(dtype) &&
        props.row[props.columnKey]}
    </div>
  );
};

export default TableCell;
