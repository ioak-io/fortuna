import React, { useState, useEffect, ReactElement } from 'react';
import './styles/TablePagination.scss';
import { useLocation } from 'react-router';
import { isEmptyOrSpaces } from '../components/Utils';
import OakLink from './OakLink';
import OakText from './OakText';
import OakPagination from './OakPagination';
import OakTextPlain from './OakTextPlain';
import OakButton from './OakButton';
import { Close, FilterList, Search } from '@material-ui/icons';
import OakModal from './OakModal';
import OakCheckbox from './OakCheckbox';

interface Props {
  onChangePage: any;
  searchPref: any;
  handleSearchPrefChange: any;
  totalRows: any;
  doSearch: any;
  header: any;
  datagrid: any;
  handleGridChange: any;
}

const TablePagination = (props: Props) => {
  const [showChooseColumns, setShowChooseColumns] = useState(false);
  const search = (event) => {
    event.preventDefault();
    props.doSearch();
  }

  const clearSearch = () => {
    props.handleSearchPrefChange({
      currentTarget: {
        name: 'text', value: ''
      }
    })
  }

  return (
    <>
    <OakModal
      visible={showChooseColumns}
      toggleVisibility={() => setShowChooseColumns(!showChooseColumns)}
      label="Choose columns"
    >
      <div className="modal-body">
        <div className="datagrid-list">
          {props.header &&
            props.header.map(item => (
              <>
                {props.datagrid[item.key] !== -1 && (
                  <OakCheckbox
                    data={props.datagrid}
                    id={item.key}
                    label={item.label}
                    handleChange={props.handleGridChange}
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
          action={() => setShowChooseColumns(false)}
          theme="default"
          variant="appear"
          align="left"
        >
          <Close />
          Close
        </OakButton>
      </div>
    </OakModal>
    <div className="table-pagination">
      <OakPagination
        onChangePage={props.onChangePage}
        totalRows={props.totalRows}
      >
        <div className="table-pagination--filter">
          {/* <FilterList onClick={props.openDatagrid} /> */}
          <OakButton action={() => setShowChooseColumns(true)} theme="default" variant="appear" shape="icon" size="xsmall">
            <FilterList />
          </OakButton>
          <form
            method="GET"
            onSubmit={search}
            noValidate
            className="table-pagination--filter--search"
          >
            <OakTextPlain
              data={props.searchPref}
              id="text"
              handleChange={props.handleSearchPrefChange}
              placeholder="Search"
            />
            <div className="table-pagination--filter--search--action">
            <OakButton theme={props.searchPref.text ? "primary" : "default"} variant="appear" action={search} size="xsmall" shape="icon">
            <Search />
            </OakButton>
            <OakButton theme="default" variant={props.searchPref.text ? "appear" : "disabled"} action={clearSearch} size="xsmall" shape="icon">
              <Close />
            </OakButton>
            </div>
          </form>
          </div>
      </OakPagination>
    </div>
    </>
  );
};

export default TablePagination;
