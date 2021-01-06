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

interface Props {
  onChangePage: any;
  openDatagrid: any;
  searchPref: any;
  handleSearchPrefChange: any;
  totalRows: any;
  doSearch: any;
}

const TablePagination = (props: Props) => {
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
    <div className="table-pagination">
      <OakPagination
        onChangePage={props.onChangePage}
        totalRows={props.totalRows}
      >
        <div className="table-pagination--filter">
          <FilterList onClick={props.openDatagrid} />
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
            <OakButton theme={props.searchPref.text ? "primary" : "default"} variant="regular" action={search} size="xsmall">
            <Search />
            </OakButton>
            <OakButton theme="default" variant={props.searchPref.text ? "regular" : "disabled"} action={clearSearch} size="xsmall">
              <Close />
            </OakButton>
            </div>
          </form>
          </div>
      </OakPagination>
    </div>
  );
};

export default TablePagination;
