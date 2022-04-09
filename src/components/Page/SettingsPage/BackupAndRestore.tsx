import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudDownloadAlt,
  faCloudUploadAlt,
  faFileExport,
  faFileImport,
} from '@fortawesome/free-solid-svg-icons';
import './BackupAndRestore.scss';
import { newId } from '../../../events/MessageService';
import CompanyModel from '../../../model/CompanyModel';
import OakInput from '../../../oakui/wc/OakInput';
import OakForm from '../../../oakui/wc/OakForm';
import * as service from './service';
import OakButton from '../../../oakui/wc/OakButton';
import OakCheckbox from '../../../oakui/wc/OakCheckbox';

const queryString = require('query-string');

interface Props {
  space: string;
  location: any;
}

const BackupAndRestore = (props: Props) => {
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const [queryParam, setQueryParam] = useState<any>({});
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState<any>({ expenseImportFile: null });

  const handleChange = (detail: any) => {
    console.log(detail);
    setState({ ...state, [detail.name]: detail.value });
  };

  const save = () => {
    // saveCompany(state, authorization).then((response: any) => {
    //   console.log('company details updated');
    // });
  };

  const importExpenseFile = () => {
    if (state.expenseImportFile?.length > 0) {
      console.log(state.expenseImportFile[0]);
      service.importExpenseFile(
        props.space,
        state.expenseImportFile[0],
        authorization
      );
    }
  };

  return (
    <div className="backup-and-restore">
      {/* <OakForm formGroupName={formId} handleSubmit={save}>
        <div className="form"> */}
      {/* <div className="form-two-column"> */}
      <div className="backup-and-restore__section content-section">
        <div className="page-title">System backup and restore</div>
        <div className="form">
          <div className="backup-and-restore__section__subtitle">
            Backup file that can be downloaded and kept offline on your device.
            This backup file can be used to upload into the tool again to
            restore from the backup file. You can also upload the backup file
            into another company. Backups are interoperable
          </div>
          <OakInput
            name="name"
            type="file"
            value={state.file}
            formGroupName={formId}
            handleInput={handleChange}
            size="small"
            color="container"
          />
          <div className="backup-and-restore__section__action">
            <OakButton handleClick={() => {}} theme="primary">
              <FontAwesomeIcon icon={faCloudDownloadAlt} />
              {/* <FontAwesomeIcon icon={faFileExport} /> */}
              Download backup
            </OakButton>
            <OakButton handleClick={() => {}} theme="default">
              <FontAwesomeIcon icon={faCloudUploadAlt} />
              {/* <FontAwesomeIcon icon={faFileExport} /> */}
              Restore from backup
            </OakButton>
          </div>
        </div>
      </div>
      <div className="content-section">
        <div className="page-title">Expense data import and export</div>
        <div className="form">
          <OakInput
            name="expenseImportFile"
            type="file"
            value={state.file}
            formGroupName={formId}
            handleInput={handleChange}
            size="small"
            color="container"
          />
          <OakCheckbox name="addAnother" value handleChange={() => {}}>
            Delete existing data before import
          </OakCheckbox>
          <OakCheckbox name="addAnother" value handleChange={() => {}}>
            Ignore possible duplicates
          </OakCheckbox>
          <div className="backup-and-restore__section__action">
            <OakButton handleClick={() => {}} theme="primary">
              <FontAwesomeIcon icon={faFileExport} />
              Export expense data
            </OakButton>
            <OakButton handleClick={importExpenseFile} theme="default">
              <FontAwesomeIcon icon={faFileImport} />
              Import expense data
            </OakButton>
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* </div>
      </OakForm> */}
    </div>
  );
};

export default BackupAndRestore;
