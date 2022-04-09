import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import './EditCompany.scss';
import { newId } from '../../../events/MessageService';
import CompanyModel from '../../../model/CompanyModel';
import OakInput from '../../../oakui/wc/OakInput';
import OakForm from '../../../oakui/wc/OakForm';
import { saveCompany } from '../EditCompanyPage/service';

const queryString = require('query-string');

interface Props {
  space: string;
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

const EditCompany = (props: Props) => {
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const company = useSelector((state: any) =>
    state.company.items.find(
      (item: any) => item.reference === parseInt(props.space, 10)
    )
  );
  const [queryParam, setQueryParam] = useState<any>({});
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState<CompanyModel>({ ...EMPTY_COMPANY });

  useEffect(() => {
    if (company) {
      setState({ ...company });
    }
  }, [company]);

  const handleChange = (detail: any) => {
    setState({ ...state, [detail.name]: detail.value });
  };

  const save = () => {
    saveCompany(state, authorization).then((response: any) => {
      console.log('company details updated');
    });
  };

  return (
    <div className="edit-company content-section">
      {company && (
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
            <OakInput
              name="currency"
              value={state.currency}
              formGroupName={formId}
              handleInput={handleChange}
              size="small"
              color="container"
              label="Currency"
              required
            />
            <OakInput
              name="numberFormat"
              value={state.numberFormat}
              formGroupName={formId}
              handleInput={handleChange}
              size="small"
              color="container"
              label="Number format"
              required
            />
          </div>
        </OakForm>
      )}
      {!company && <div>Company details cannot be loaded at the moment</div>}
    </div>
  );
};

export default EditCompany;
