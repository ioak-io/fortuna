import React, { useState, useEffect, ReactElement } from 'react';
import './styles/TablePagination.scss';
import { useLocation } from 'react-router';
import { isEmptyOrSpaces } from '../components/Utils';
import OakLink from './OakLink';
import OakText from './OakText';
import OakPagination from './OakPagination';
import OakTextPlain from './OakTextPlain';
import OakButton from './OakButton';

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
    props.doSearch();
  }

  return (
    <div className="table-pagination">
      <OakPagination
        onChangePage={props.onChangePage}
        totalRows={props.totalRows}
      >
        <div className="table-pagination--filter">
          <i className="material-icons" onClick={props.openDatagrid}>filter_list</i>
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
            <OakButton theme={props.searchPref.text ? "primary" : "default"} variant="regular" action={search} icon="search" />
            <OakButton theme="default" variant={props.searchPref.text ? "regular" : "disabled"} action={clearSearch} icon="close" />
            </div>
          </form>
          </div>
      </OakPagination>
    </div>
  );
};

export default TablePagination;
