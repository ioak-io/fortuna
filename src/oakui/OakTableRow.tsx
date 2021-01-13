import React, { useState, useEffect } from 'react';
import './styles/oak-table.scss';
import OakPagination from './OakPagination';
import TableCell from './TableCell';
import TableCellAction from './TableCellAction';
import OakModal from './OakModal';
import OakCard from './OakCard';
import OakForm from './OakForm';
import OakCheckbox from './OakCheckbox';
import OakButton from './OakButton';
import OakLink from './OakLink';
import OakText from './OakText';
import TablePagination from './TablePagination';
import { isEmptyOrSpaces, match } from '../components/Utils';
import { Close, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

interface Props {
  header: {
    key: string;
    label: string;
    dtype?: string; // 'text' | 'date' | 'number';
    elements?: any;
  }[];
  row: any;
  handleCellDataChange?: any;
}

const OakTableRow = (props: Props) => {
  return (
    <tr>
      {props.header.map(header => (
        <td>
          <TableCell
            header={header}
            columnKey={header.key}
            row={props.row}
            handleCellDataChange={props.handleCellDataChange}
          />
        </td>
      ))}
    </tr>
  );
};

export default OakTableRow;
