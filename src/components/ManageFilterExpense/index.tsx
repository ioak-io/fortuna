import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { cloneDeep } from 'lodash';
import { compose } from '@oakui/core-stage/style-composer/OakTableComposer';
import OakModal from '../../oakui/wc/OakModal';
import ManageFilterExpenseCommand from '../../events/ManageFilterExpenseCommand';
import {
  receiveMessage,
  sendMessage,
  newId,
} from '../../events/MessageService';
import OakForm from '../../oakui/wc/OakForm';
import OakInput from '../../oakui/wc/OakInput';

import './style.scss';
import OakSelect from '../../oakui/wc/OakSelect';
import OakButton from '../../oakui/wc/OakButton';

import { publishAllFilters } from './service';
import OakRadio from '../../oakui/wc/OakRadio';
import ExpenseFilterModel from '../../model/ExpenseFilterModel';
import OakCheckbox from '../../oakui/wc/OakCheckbox';
import OakRadioGroup from '../../oakui/wc/OakRadioGroup';
import { fetchAndSetExpenseItems } from '../../store/actions/ExpenseActions';

interface Props {
  space: string;
}

const EMPTY_FILTER: ExpenseFilterModel = {
  name: '',
  showInDashboard: false,
  showInSummary: false,
  from: '',
  to: '',
  description: '',
  moreThan: null,
  lessThan: null,
  days: null,
  months: null,
  monthNumber: null,
  yearNumber: null,
  categoryIdList: [],
  kakeiboList: [],
  tagIdList: [],
};

const ManageFilterExpense = (props: Props) => {
  const dispatch = useDispatch();
  const authorization = useSelector((state: any) => state.authorization);
  const appliedFilter = useSelector((state: any) => state.expense.filter);
  const filterExpenseList = useSelector(
    (state: any) => state.filterExpense.items
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState<ExpenseFilterModel[]>([]);

  useEffect(() => {
    ManageFilterExpenseCommand.subscribe((message) => {
      setIsOpen(message);
    });
  }, []);

  useEffect(() => {
    setState(cloneDeep(filterExpenseList));
  }, [isOpen]);

  useEffect(() => {
    setState(cloneDeep(filterExpenseList));
  }, [filterExpenseList]);

  const handleClose = () => {
    setState([]);
    ManageFilterExpenseCommand.next(false);
  };

  const handleChange = (detail: any, index: number) => {
    const _state = [...state];
    _state[index] = { ..._state[index], [detail.name]: detail.value };
    setState([..._state]);
  };

  const applyFilter = (record: ExpenseFilterModel) => {
    dispatch(fetchAndSetExpenseItems(props.space, authorization, record));
  };

  const deleteFilter = (record: ExpenseFilterModel) => {
    setState([...state.filter((item) => item._id !== record._id)]);
  };

  const save = () => {
    publishAllFilters(props.space, state, authorization);
    handleClose();
  };

  return (
    <>
      <OakModal
        isOpen={isOpen}
        handleClose={handleClose}
        backdropIntensity={3}
        animationStyle="slide"
        animationSpeed="normal"
        height="auto"
        width="auto"
        heading="Manage filters"
      >
        <div slot="body">
          <div className="manage-filter-expense">
            <table
              className={compose({
                color: 'surface',
                dense: true,
              })}
            >
              <thead>
                <tr>
                  <th className="manage-filter-expense__column--name">
                    Filter name
                  </th>
                  <th className="manage-filter-expense__column--selection">
                    Summary
                  </th>
                  <th className="manage-filter-expense__column--selection">
                    Dashboard
                  </th>
                  <th className="manage-filter-expense__column--selection">
                    {' '}
                  </th>
                </tr>
              </thead>
              <tbody>
                {state?.map((record: any, index: number) => (
                  <tr key={record._id}>
                    <td className="manage-filter-expense__column--name">
                      <OakInput
                        size="xsmall"
                        name="name"
                        handleInput={(detail: any) =>
                          handleChange(detail, index)
                        }
                        value={record.name}
                      />
                    </td>
                    <td className="manage-filter-expense__column--selection">
                      <div>
                        <OakCheckbox
                          name="showInSummary"
                          value={record.showInSummary}
                          handleChange={(detail: any) =>
                            handleChange(detail, index)
                          }
                        />
                      </div>
                    </td>
                    <td className="manage-filter-expense__column--selection">
                      <div>
                        <OakCheckbox
                          name="showInDashboard"
                          value={record.showInDashboard}
                          handleChange={(detail: any) =>
                            handleChange(detail, index)
                          }
                        />
                      </div>
                    </td>
                    <td className="manage-filter-expense__column--selection">
                      <div className="manage-filter-expense__action">
                        {appliedFilter._id !== record._id && (
                          <OakButton
                            handleClick={() => applyFilter(record)}
                            theme="info"
                            size="xsmall"
                          >
                            Apply
                          </OakButton>
                        )}
                        <OakButton
                          handleClick={() => deleteFilter(record)}
                          theme="info"
                          size="xsmall"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </OakButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div slot="footer">
          <div className="manage-filter-expense-footer">
            <OakButton handleClick={save} theme="primary" variant="regular">
              <FontAwesomeIcon icon={faChevronRight} />
              Save
            </OakButton>
          </div>
        </div>
      </OakModal>
    </>
  );
};

export default ManageFilterExpense;
