import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronCircleLeft,
  faChevronCircleRight,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import OakButton from '../../../oakui/wc/OakButton';
import Topbar from '../../../components/Topbar';
import './style.scss';
import { newId } from '../../../events/MessageService';
import OakForm from '../../../oakui/wc/OakForm';
import OakInput from '../../../oakui/wc/OakInput';
import CompanyModel from '../../../model/CompanyModel';
import { getBudgetByYear, saveBudget } from './service';
import OakSelect from '../../../oakui/wc/OakSelect';
import BudgetItems from './BudgetItems';
import BudgetModel from '../../../model/BudgetModel';

const queryString = require('query-string');

interface Props {
  space: string;
}

const THIS_YEAR = new Date().getFullYear();
const NEXT_YEAR = new Date().getFullYear() + 1;
const LAST_YEAR = new Date().getFullYear() - 1;

const BudgetPage = (props: Props) => {
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const categories = useSelector((state: any) => state.category.categories);
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState<BudgetModel[]>([]);
  const [year, setYear] = useState(THIS_YEAR);

  useEffect(() => {
    if (authorization.isAuth) {
      getBudgetByYear(props.space, year, authorization).then(
        (response: any) => {
          if (response) {
            setState(response);
          }
        }
      );
    }
  }, [year, authorization]);

  const handleChange = (_state: BudgetModel[]) => {
    setState(_state);
  };
  const reduceYear = () => {
    setYear(year - 1);
  };
  const addYear = () => {
    setYear(year + 1);
  };

  const save = () => {
    console.log(state);
    saveBudget(props.space, year, state, authorization).then(
      (response: any) => {
        setState(response);
      }
    );
  };

  const getYearRange = () => {
    const _res = [];
    let i = 2000;
    while (i < 2100) {
      _res.push(i);
      i += 1;
    }
    return _res;
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="budget-page page-animate">
      <Topbar title="Budget">right</Topbar>
      <div className="budget-page__main main-section content-section">
        <div className="budget-page__main__year">
          <button onClick={reduceYear} className="button">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div>{year}</div>
          <button onClick={addYear} className="button">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className="budget-page__main__table">
          <BudgetItems
            data={state}
            formId={formId}
            year={year}
            handleChange={handleChange}
          />
        </div>
      </div>
      <div className="footer">
        <div />
        <div className="footer-right">
          <OakButton
            theme="primary"
            variant="regular"
            handleClick={save}
            formGroupName={formId}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </OakButton>
          <OakButton theme="info" variant="regular" handleClick={goBack}>
            <FontAwesomeIcon icon={faTimes} />
          </OakButton>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
