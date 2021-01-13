import React, { useState, useEffect } from 'react';
import './styles/oak-table.scss';
import TablePagination from './TablePagination';
import { isEmptyOrSpaces, match } from '../components/Utils';
import OakTableContainer from './OakTableContainer';

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
    // if (!props.showAll && data && props.totalRows) {
    //   viewLocal = data;
    // } else if (!props.showAll && data && !props.totalRows) {
    //   viewLocal = data.slice(
    //     (paginationPref.pageNo - 1) * paginationPref.rowsPerPage,
    //     paginationPref.pageNo * paginationPref.rowsPerPage
    //   );
    // } else if (props.showAll) {
    //   viewLocal = data;
    // }
    setView(viewLocal);
  }, [data]);

  // useEffect(() => {
  //   pageChanged();
  // }, [paginationPref]);

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
    console.log(123);
    console.log(props.data);
    setData(props.data || []);
    if (!props.data || props.data.length === 0) {
      return;
    }
    console.log('********');

    if (props.onChangePage) {
      props.onChangePage(
        paginationPref.pageNo,
        paginationPref.rowsPerPage,
        paginationPref.sortField,
        paginationPref.sortAsc,
        searchPref.text
      );
    } else {
      let dataLocal = props.data;
      if (!isEmptyOrSpaces(searchPref.text)) {
        console.log('&&&&&&&&&');
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
        console.log('%%%%%%%%%%');
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
    console.log('***sort');
    let _sortField = '';
    let _sortAsc = true;
    if (paginationPref.sortField === fieldName) {
      if (paginationPref.sortAsc) {
        _sortField = paginationPref.sortField;
        _sortAsc = false;
      }
    } else {
      _sortField = fieldName;
      _sortAsc = true;
    }
    setPaginationPref({
      ...paginationPref,
      sortField: _sortField,
      sortAsc: _sortAsc,
    });
  };

  return (
    <>
      <div className="oak-table">
        {!props.showAll &&
          ((props.navPlacement &&
            props.navPlacement === 'top') ||
            !props.navPlacement) && (
            <div className="oak-table--nav-top">
              <TablePagination
                searchPref={searchPref}
                handleSearchPrefChange={handleSearchPrefChange}
                onChangePage={onChangePage}
                totalRows={props.totalRows ? props.totalRows : data.length}
                doSearch={pageChanged}
                datagrid={datagrid}
                handleGridChange={handleGridChange}
                header={props.header}
              />
            </div>
          )}
        <OakTableContainer
          header={props.header?.filter(item => datagrid[item.key] !== 0)}
          data={props.data}
          handleSort={sort}
          sortAsc={paginationPref.sortAsc}
          sortBy={paginationPref.sortField}
        />
        {/* <table>
              <thead>
                <tr>
                  {props.header &&
                    props.header.map(item => (
                      <>
                        {datagrid[item.key] !== 0 && (
                          <th key={item.key}>
                            <div
                              className="table-container--label"
                              onClick={() => sort(item.key)}
                            >
                              {item.label}
                              {paginationPref.sortField === item.key &&
                                paginationPref.sortAsc && <KeyboardArrowUp />}
                              {paginationPref.sortField === item.key &&
                                !paginationPref.sortAsc && (
                                  <KeyboardArrowDown />
                                )}
                            </div>
                          </th>
                        )}
                      </>
                    ))}
                  {props.actionColumn && (
                    <th>
                      <div className="label">{props.actionColumn.label}</div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {view &&
                  view.map(row => (
                    <tr key={(key += 1)}>
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
            </table> */}
        {!props.showAll &&
          ((props.navPlacement &&
            props.navPlacement === 'bottom') ||
            !props.navPlacement) && (
            <div className="oak-table--nav-bottom">
              <TablePagination
                searchPref={searchPref}
                handleSearchPrefChange={handleSearchPrefChange}
                onChangePage={onChangePage}
                totalRows={props.totalRows ? props.totalRows : data.length}
                doSearch={pageChanged}
                datagrid={datagrid}
                handleGridChange={handleGridChange}
                header={props.header}
              />
            </div>
          )}
      </div>
    </>
  );
};

export default OakTable;
