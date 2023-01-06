/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faCompressAlt,
  faExpandAlt,
  faFileExport,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { compose as tableCompose } from '@oakui/core-stage/style-composer/OakTableComposer';

import './ListExpense.scss';
import OakTypography from '../../../oakui/wc/OakTypography';
import { searchExpense } from './service';
import OakCheckbox from '../../../oakui/wc/OakCheckbox';
import OakButton from '../../../oakui/wc/OakButton';
import QuickEditExpenseCommand from '../../../events/QuickEditExpenseCommand';
import ExpenseListState from '../../../simplestates/ExpenseListState';
import ExpenseListLoadMoreCommand from '../../../simplestates/ExpenseListLoadMoreCommand';
import ExpenseModel from '../../../model/ExpenseModel';
import {
  fetchAndAppendExpenseItems,
  fetchAndSetExpenseItems,
} from '../../../store/actions/ExpenseActions';
import { formatCurrencyByCompanyDetail } from '../../../components/CurrencyUtils';
import TableHeader from '../../../components/TableHeader';

interface Props {
  space: string;
  data?: any;
}

const ListExpense = (props: Props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const authorization = useSelector((state: any) => state.authorization);
  const categories = useSelector((state: any) => state.category.categories);
  const expenseState: any = useSelector((state: any) => state.expense);
  const company = useSelector((state: any) =>
    state.company.items.find(
      (item: any) => item.reference === parseInt(props.space, 10)
    )
  );

  const [sortPref, setSortPref] = useState<any>({
    sortBy: expenseState?.pagination?.sortBy,
    sortOrder: expenseState?.pagination?.sortOrder,
  });

  const [denseView, setDenseView] = useState(true);
  // const [data, setData] = useState<any[]>([]);
  const [categoryMap, setCategoryMap] = useState<any>({});

  const [checkedRecords, setCheckedRecords] = useState<any[]>([]);

  useEffect(() => {
    if (categories) {
      const _categoryMap: any = {};
      categories.forEach((category: any) => {
        _categoryMap[category._id] = category;
      });
      setCategoryMap(_categoryMap);
    }
  }, [categories]);

  // useEffect(() => {
  //   ExpenseListState.asObservable().subscribe((items) => {
  //     setData(items);
  //   });
  // }, []);

  useEffect(() => {
    if (
      expenseState?.pagination &&
      (expenseState?.pagination?.sortBy !== sortPref.sortBy ||
        expenseState?.pagination?.sortOrder !== sortPref.sortOrder)
    ) {
      dispatch(
        fetchAndSetExpenseItems(props.space, authorization, {
          ...expenseState.filter,
          pagination: { pageNo: 0, pageSize: 20, hasMore: true, ...sortPref },
        })
      );
    }
  }, [sortPref]);

  const toggleCheckedState = (recordId: string) => {
    if (checkedRecords.includes(recordId)) {
      setCheckedRecords(checkedRecords.filter((item) => item !== recordId));
    } else {
      setCheckedRecords([...checkedRecords, recordId]);
    }
  };

  const toggleAll = () => {
    const _checkedRecords: string[] = [];
    if (expenseState.items.length > checkedRecords.length) {
      expenseState.items.forEach((item: any) => {
        _checkedRecords.push(item._id);
      });
    }
    setCheckedRecords(_checkedRecords);
  };

  const openAddBillPage = () => {
    history.push(`/${props.space}/receipt/edit`);
  };

  const openAddExpense = () => {
    QuickEditExpenseCommand.next({ open: true, record: null });
  };

  const openRecord = (record: any) => {
    QuickEditExpenseCommand.next({ open: true, record });
  };

  const loadMore = () => {
    dispatch(
      fetchAndAppendExpenseItems(props.space, authorization, {
        ...expenseState.filter,
        pagination: { ...expenseState.pagination },
      })
    );
  };

  const handleSortChange = (sortBy: string) => {
    let _sortPref = { ...sortPref };
    if (_sortPref.sortBy === sortBy) {
      if (_sortPref.sortOrder === 'descending') {
        _sortPref = {
          sortBy: null,
          sortOrder: null,
        };
      } else {
        _sortPref.sortOrder = 'descending';
      }
    } else {
      _sortPref = {
        sortBy,
        sortOrder: 'ascending',
      };
    }
    setSortPref(_sortPref);
  };

  return (
    <>
      <div className="list-expense__action">
        <div className="list-expense__action__left" />
        <div className="list-expense__action__right">
          {checkedRecords.length > 0 && (
            <OakButton
              handleClick={() => {}}
              variant="regular"
              theme="danger"
              size="small"
            >
              <FontAwesomeIcon icon={faTrash} /> Delete ({checkedRecords.length}
              )
            </OakButton>
          )}
          <OakButton
            theme="primary"
            variant="regular"
            handleClick={openAddBillPage}
            size="small"
          >
            <FontAwesomeIcon icon={faPlus} /> Bill
          </OakButton>
          <OakButton
            theme="info"
            variant="regular"
            handleClick={openAddExpense}
            size="small"
          >
            <FontAwesomeIcon icon={faPlus} /> Item
          </OakButton>
          <div className="desktop-only">
            <OakButton
              theme="info"
              variant="regular"
              handleClick={() => {}}
              size="small"
            >
              <FontAwesomeIcon icon={faFileExport} />
            </OakButton>
          </div>
          <div className="desktop-only">
            <OakButton
              theme="info"
              variant="regular"
              handleClick={() => {
                setDenseView(!denseView);
              }}
              size="small"
            >
              <FontAwesomeIcon icon={denseView ? faExpandAlt : faCompressAlt} />
            </OakButton>
          </div>
        </div>
      </div>
      <div className="content-section list-expense">
        <table
          className={tableCompose({
            color: 'surface',
            dense: denseView,
          })}
        >
          <thead>
            <tr>
              <th className="list-expense__column list-expense__column--selection">
                <OakCheckbox
                  name="check"
                  value={checkedRecords.length === expenseState.items.length}
                  handleChange={toggleAll}
                />
              </th>
              <th className="list-expense__column">
                <TableHeader
                  name="billDate"
                  label="Date"
                  sortPref={sortPref}
                  handleChange={handleSortChange}
                />
              </th>
              <th className="list-expense__column">
                <TableHeader
                  name="category"
                  label="Category"
                  sortPref={sortPref}
                  handleChange={handleSortChange}
                />
              </th>
              {/* <th className="list-expense__column list-expense__column--kakeibo">
                Kakeibo
              </th> */}
              <th className="list-expense__column">
                <TableHeader
                  name="description"
                  label="Description"
                  sortPref={sortPref}
                  handleChange={handleSortChange}
                />
              </th>
              <th className="list-expense__column">
                <TableHeader
                  name="amount"
                  label="Amount"
                  sortPref={sortPref}
                  handleChange={handleSortChange}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {expenseState.items.map((record: any) => (
              <tr key={record._id}>
                <td className="list-expense__column list-expense__column--selection">
                  <div>
                    <OakCheckbox
                      name="check"
                      value={checkedRecords.includes(record._id)}
                      handleChange={() => toggleCheckedState(record._id)}
                    />
                  </div>
                </td>
                <td
                  className="list-expense__column"
                  onClick={() => openRecord(record)}
                >
                  {format(new Date(record.billDate), 'yyyy-MM-dd')}
                </td>
                <td onClick={() => openRecord(record)}>
                  {categoryMap[record.category]
                    ? categoryMap[record.category].name
                    : ''}
                </td>
                {/* <td
                  className="list-expense__column list-expense__column--kakeibo"
                  onClick={() => openRecord(record)}
                >
                  {categoryMap[record.category]
                    ? categoryMap[record.category].kakeibo
                    : ''}
                </td> */}
                <td
                  className="list-expense__column list-expense__column--description"
                  onClick={() => openRecord(record)}
                >
                  {record.description}
                </td>
                <td
                  className="list-expense__column"
                  onClick={() => openRecord(record)}
                >
                  {formatCurrencyByCompanyDetail(record.amount, company)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenseState.pagination.hasMore && (
          <div className="load-more">
            <button className="button load-more__button" onClick={loadMore}>
              Load more
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ListExpense;
