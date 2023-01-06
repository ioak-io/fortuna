import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
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
  const [queryParam, setQueryParam] = useState<any>({});
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState<CompanyModel>({ ...EMPTY_COMPANY });

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    setQueryParam(query);
  }, [props.location.search]);

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
    <div className="edit-company-page">
      <Topbar title={queryParam.id ? 'Edit company' : 'New company'}>
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
                autofocus
                required
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
            {queryParam.id ? 'Save' : 'Save and go back'}
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
