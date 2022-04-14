import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import OakButton from '../../../oakui/wc/OakButton';
import Topbar from '../../../components/Topbar';
import './style.scss';
import { newId } from '../../../events/MessageService';
import OakForm from '../../../oakui/wc/OakForm';
import OakInput from '../../../oakui/wc/OakInput';
import CompanyModel from '../../../model/CompanyModel';
import { saveCompany } from './service';

const queryString = require('query-string');

interface Props {
  history: any;
  location: any;
}

const EMPTY_COMPANY: CompanyModel = {
  _id: undefined,
  name: '',
  description: '',
  reference: null,
  numberFormat: 'en-US',
  currency: 'USD',
};

const BudgetPage = (props: Props) => {
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState<CompanyModel>({ ...EMPTY_COMPANY });

  const handleChange = (detail: any) => {
    setState({ ...state, [detail.name]: detail.value });
  };

  const save = () => {
    saveCompany(state, authorization).then((response: any) => {
      goBack();
    });
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="budget-page">
      <Topbar title="Budget">right</Topbar>
      <div className="budget-page__main main-section content-section">
        <OakForm formGroupName={formId} handleSubmit={save}>
          <div className="form">
            <OakInput
              name="name"
              value={state.name}
              formGroupName={formId}
              handleInput={handleChange}
              size="small"
              color="container"
              label="Company name"
              autofocus
              required
            />
          </div>
        </OakForm>
      </div>
      <div className="footer">
        <div />
        <div className="footer-right">
          <OakButton
            theme="primary"
            variant="regular"
            type="submit"
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
