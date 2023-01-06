import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const EditCompanyPage = (props: Props) => {
  const navigate = useNavigate();
  const authorization = useSelector((state: any) => state.authorization);
  const companyList = useSelector((state: any) => state.company.items);
  const [searchParams] = useSearchParams();
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
    navigate(-1);
  };

  return (
    <div className="edit-company-page">
      <Topbar title={searchParams.get('id') ? 'Edit company' : 'New company'}>
        right
      </Topbar>
      <div className="edit-company-page__main main-section content-section page-width">
        <OakForm formGroupName={formId} handleSubmit={save}>
          <div className="form">
            <div className="form-two-column">
              <OakInput
                name="name"
                value={state.name}
                formGroupName={formId}
                handleInput={handleChange}
                size="small"
                color="container"
                label="Company name"
              />
              <OakInput
                name="reference"
                value={state.reference}
                formGroupName={formId}
                handleInput={handleChange}
                size="small"
                color="container"
                label="Company ID"
                disabled
                tooltip={
                  !state.reference ? 'Auto generated after creation' : ''
                }
              />
            </div>
            <OakInput
              name="description"
              value={state.description}
              formGroupName={formId}
              handleInput={handleChange}
              size="small"
              color="container"
              label="Description"
              type="textarea"
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
            {searchParams.get('id') ? 'Save' : 'Save and go back'}
          </OakButton>
          <OakButton theme="info" variant="regular" handleClick={goBack}>
            <FontAwesomeIcon icon={faTimes} />
          </OakButton>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyPage;
