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
import {
  ArrowDownward,
  ArrowUpward,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@material-ui/icons';
import OakTableRow from './OakTableRow';

interface Props {
  header: {
    key: string;
    label: string;
    dtype?: string; // 'text' | 'date' | 'number';
    elements?: any;
  }[];
  data: any;
  handleSort: any;
  sortBy?: string;
  sortAsc?: boolean;
}

const OakTableContainer = (props: Props) => {
  return (
    <div className="oak-table-container">
      <table>
        <thead>
          <tr>
            {props.header &&
              props.header.map(header => (
                <th onClick={() => props.handleSort(header.key)}>
                  <span>
                    {header.label}
                    {props.sortBy === header.key && props.sortAsc && (
                      <ArrowUpward fontSize={"small"} />
                    )}
                    {props.sortBy === header.key && !props.sortAsc && (
                      <ArrowDownward fontSize={"small"} />
                    )}
                  </span>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {props.data &&
            props.data.map(row => (
              <OakTableRow row={row} header={props.header} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default OakTableContainer;
