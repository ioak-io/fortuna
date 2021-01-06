import React, { useState, useEffect } from 'react';
import './styles/oak-table.scss';
import OakPagination from './OakPagination';
import TableCell from './TableCell';
import TableCellAction from './TableCellAction';
import OakModal from './OakModal';
import OakSection from './OakSection';
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
  data: any;
  onChangePage?: any;
  totalRows?: number;
  navPlacement?: 'top' | 'bottom';
  handleCellDataChange?: any;
  showAll?: boolean;
  actionColumn?: {
    label: string;
    actions: {
      label: string;
      icon?: string;
      actionHandler: any;
      actionName: any;
      theme?: string;
      variant?: string;
    }[];
  };
}

const OakTable = (props: Props) => {
  const [data, setData] = useState<any>([]);
  const [view, setView] = useState<any[]>([]);
  const [searchPref, setSearchPref] = useState({
    text: '',
  });
  const [showDatagrid, setShowDatagrid] = useState(false);
  const [paginationPref, setPaginationPref] = useState({
    pageNo: 1,
    rowsPerPage: 6,
    sortField: '',
    sortAsc: true,
  });

  const [headerMap, setHeaderMap] = useState({});

  const [datagrid, setDatagrid] = useState<any>([]);

  useEffect(() => {
    const headerMap = {};
    const datagridLocal = {};
    props.header.forEach(element => {
      headerMap[element.key] = element;
      datagridLocal[element.key] = element.dtype?.startsWith('input') ? -1 : 1;
    });
    setHeaderMap(headerMap);
    setDatagrid(datagridLocal);
  }, []);

  useEffect(() => {
    pageChanged();
  }, [props.data]);

  useEffect(() => {
    let viewLocal: any[] = data;
    if (!props.showAll && data && props.totalRows) {
      viewLocal = data;
    } else if (!props.showAll && data && !props.totalRows) {
      viewLocal = data.slice(
        (paginationPref.pageNo - 1) * paginationPref.rowsPerPage,
        paginationPref.pageNo * paginationPref.rowsPerPage
      );
    } else if (props.showAll) {
      viewLocal = data;
    }
    setView(viewLocal);
  }, [data]);

  useEffect(() => {
    pageChanged();
  }, [paginationPref]);

  const handleGridChange = event => {
    setDatagrid({
      ...datagrid,
      [event.target.name]: event.target.checked ? 1 : 0,
    });
  };

  const handleSearchPrefChange = event => {
    setSearchPref({
      ...searchPref,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const pageChanged = () => {
    setData(props.data || []);
    if (!props.data) {
      return;
    }

    if (props.onChangePage) {
      props.onChangePage(
        paginationPref.pageNo,
        paginationPref.rowsPerPage,
        paginationPref.sortField,
        paginationPref.sortAsc,
        searchPref.text
      );
    } else {
      let dataLocal = [...props.data];
      if (!isEmptyOrSpaces(searchPref.text)) {
        dataLocal = dataLocal.filter(item => {
          let outcome = false;
          props.header.forEach(headerItem => {
            let value = item[headerItem.key];
            if (headerItem.dtype === 'input_select') {
              console.log(value, headerItem);
              value = headerItem.elements.find(item => item.key === value)
                ?.value;
              console.log(
                match(value, searchPref.text),
                value,
                searchPref.text
              );
            }
            if (match(value, searchPref.text)) {
              outcome = true;
            }
          });
          return outcome;
        });
      }
      if (paginationPref.sortField) {
        dataLocal = dataLocal.sort((a: any, b: any) => compare(a, b));
      }
      setData(dataLocal);
    }
  };

  function compare(a: any, b: any): number {
    const { sortField } = paginationPref;
    const { sortAsc } = paginationPref;
    const headerElement = headerMap[sortField];
    if (!headerElement?.dtype || headerElement?.dtype === 'text') {
      if (sortAsc) {
        return a[paginationPref.sortField] > b[paginationPref.sortField]
          ? 1
          : a[paginationPref.sortField] < b[paginationPref.sortField]
          ? -1
          : 0;
      }
      return a[paginationPref.sortField] < b[paginationPref.sortField]
        ? 1
        : a[paginationPref.sortField] > b[paginationPref.sortField]
        ? -1
        : 0;

      // } else if (headerElement.dtype === 'number') {
    }
    if (sortAsc) {
      return a[paginationPref.sortField] - b[paginationPref.sortField] > 0
        ? 1
        : a[paginationPref.sortField] - b[paginationPref.sortField] < 0
        ? -1
        : 0;
    }
    return a[paginationPref.sortField] - b[paginationPref.sortField] < 0
      ? 1
      : a[paginationPref.sortField] - b[paginationPref.sortField] > 0
      ? -1
      : 0;
  }

  const onChangePage = (pageNo: number, rowsPerPage: number) => {
    setPaginationPref({
      ...paginationPref,
      pageNo,
      rowsPerPage,
    });
  };

  const sort = fieldName => {
    setPaginationPref({
      ...paginationPref,
      sortField: fieldName,
      sortAsc:
        paginationPref.sortField === fieldName ? !paginationPref.sortAsc : true,
    });
  };

  const openDatagrid = () => {
    setShowDatagrid(true);
  };

  let key = 0;

  return (
    <>
      <div className="oak-table">
        {!props.showAll &&
          props.navPlacement &&
          ['both', 'top'].includes(props.navPlacement) && (
            <div className="oak-table--nav-top">
              <div className="oak-table--nav-top--container">
                <TablePagination
                  searchPref={searchPref}
                  handleSearchPrefChange={handleSearchPrefChange}
                  onChangePage={onChangePage}
                  openDatagrid={openDatagrid}
                  totalRows={props.totalRows ? props.totalRows : data.length}
                  doSearch={pageChanged}
                />
              </div>
            </div>
          )}
        <div className="desktop-view">
          <div className="table-container">
            <table>
              <thead>
                {props.header &&
                  props.header.map(item => (
                    <>
                      {datagrid[item.key] !== 0 && (
                        <td key={item.key}>
                          <div
                            className="table-container--label"
                            onClick={() => sort(item.key)}
                          >
                            {item.label}
                            {paginationPref.sortField === item.key &&
                              paginationPref.sortAsc && <KeyboardArrowUp />}
                            {paginationPref.sortField === item.key &&
                              !paginationPref.sortAsc && <KeyboardArrowDown />}
                          </div>
                        </td>
                      )}
                    </>
                  ))}
                {props.actionColumn && (
                  <td>
                    <div className="label">{props.actionColumn.label}</div>
                  </td>
                )}
              </thead>
              <tbody>
                {view &&
                  view.map(row => (
                    <tr key={(key += 1)}>
                      {props.header &&
                        props.header.map(column => (
                          <>
                            {datagrid[column.key] !== 0 && (
                              <td
                                key={(key += 1)}
                                className={
                                  headerMap[column.key]?.dtype
                                    ? headerMap[column.key]?.dtype
                                    : ''
                                }
                              >
                                <TableCell
                                  key={(key += 1)}
                                  columnKey={column.key}
                                  headerMap={headerMap}
                                  row={row}
                                  handleCellDataChange={
                                    props.handleCellDataChange || undefined
                                  }
                                />
                              </td>
                            )}
                          </>
                        ))}
                      {props.actionColumn && (
                        <td>
                          <TableCellAction
                            actions={props.actionColumn.actions}
                            row={row}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {!props.showAll &&
            ((props.navPlacement &&
              ['bottom', 'both'].includes(props.navPlacement)) ||
              !props.navPlacement) && (
              <div className="oak-table--nav-bottom">
                <OakPagination
                  onChangePage={onChangePage}
                  totalRows={props.totalRows ? props.totalRows : data.length}
                />
              </div>
            )}
        </div>

        <div className="mobile-view">
          <div className="card-container">
            {view &&
              view.map(row => (
                <div className="card-container--card" key={(key += 1)}>
                  {props.header &&
                    props.header.map(column => (
                      // <div key={(key += 1)}>
                      //   <b>{column.label}</b>: {row[column.key]}
                      // </div>
                      <div
                        className="card-container--card--column"
                        key={(key += 1)}
                      >
                        <div className="card-container--card--column--label typography-3">
                          {column.label}
                        </div>
                        <TableCell
                          key={(key += 1)}
                          columnKey={column.key}
                          headerMap={headerMap}
                          row={row}
                          handleCellDataChange={
                            props.handleCellDataChange || undefined
                          }
                        />
                      </div>
                    ))}
                </div>
              ))}
          </div>
          {!props.showAll && (
            <OakPagination
              onChangePage={onChangePage}
              totalRows={props.totalRows ? props.totalRows : data.length}
              label="Rows"
            />
          )}
        </div>
      </div>
      <OakModal
        visible={showDatagrid}
        toggleVisibility={() => setShowDatagrid(!showDatagrid)}
        label="Choose columns"
      >
        <div className="modal-body">
          <div className="datagrid-list">
            {props.header &&
              props.header.map(item => (
                <>
                  {datagrid[item.key] !== -1 && (
                    <OakCheckbox
                      data={datagrid}
                      id={item.key}
                      label={item.label}
                      handleChange={handleGridChange}
                      theme="primary"
                      variant="circle"
                    />
                  )}
                </>
              ))}
          </div>
        </div>
        <div className="modal-footer">
          <OakButton
            action={() => setShowDatagrid(false)}
            theme="default"
            variant="appear"
            align="left"
          >
            <Close />
            Close
          </OakButton>
        </div>
      </OakModal>
    </>
  );
};

export default OakTable;
