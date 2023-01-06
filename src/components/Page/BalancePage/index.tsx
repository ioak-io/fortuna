import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronCircleLeft,
  faChevronCircleRight,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import OakButton from '../../../oakui/wc/OakButton';
import Topbar from '../../../components/Topbar';
import './style.scss';
import { newId } from '../../../events/MessageService';
import OakForm from '../../../oakui/wc/OakForm';
import OakInput from '../../../oakui/wc/OakInput';
import CompanyModel from '../../../model/CompanyModel';
import {
  getAccount,
  saveAccount,
  getAccountScope,
  saveAccountScope,
} from './service';
import OakSelect from '../../../oakui/wc/OakSelect';
import AccountItems from './AccountItems';
import AccountModel from '../../../model/AccountModel';
import OakModal from '../../../oakui/wc/OakModal';
import AccountTypeChip from './AccountTypeChip';
import AccountScope from './AccountScope';
import AccountScopeModel from '../../../model/AccountScopeModel';

interface Props {
  space: string;
}

const THIS_YEAR = new Date().getFullYear();

const EMPTY_ACCOUNT: AccountModel = {
  name: '',
  opening: 0,
  closing: 0,
  type: 'cash',
};

const BalancePage = (props: Props) => {
  const navigate = useNavigate();
  const authorization = useSelector((state: any) => state.authorization);
  const categories = useSelector((state: any) => state.category.categories);
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState<AccountModel[]>([]);
  const [scopeState, setScopeState] = useState<AccountScopeModel>({
    scope: 'This month',
  });
  const [currentItem, setCurrentItem] = useState<AccountModel>({
    ...EMPTY_ACCOUNT,
  });
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [year, setYear] = useState(THIS_YEAR);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (authorization.isAuth) {
      getAccount(props.space, authorization).then((response: any) => {
        if (response) {
          setState(response);
        }
      });
      getAccountScope(props.space, authorization).then((response: any) => {
        if (response) {
          setScopeState(response);
        }
      });
    }
  }, [year, authorization]);

  const handleChange = (_state: AccountModel[]) => {
    setState(_state);
  };

  const handleScopeChange = (_state: AccountScopeModel) => {
    setScopeState(_state);
  };

  const addAccount = () => {
    setCurrentItem({ ...EMPTY_ACCOUNT });
    setIsOpen(true);
    setCurrentIndex(-1);
  };

  const editAccount = (index: number) => {
    setCurrentItem({ ...state[index] });
    setIsOpen(true);
    setCurrentIndex(index);
  };

  const save = () => {
    console.log(scopeState);
    saveAccount(props.space, state, authorization).then((response: any) => {
      setState(response);
    });
    saveAccountScope(props.space, scopeState, authorization).then(
      (response: any) => {
        setScopeState(response);
      }
    );
  };

  const goBack = () => {
    navigate(-1)
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentIndex(-1);
  };

  const handleMetaChange = (detail: any) => {
    setCurrentItem({ ...currentItem, [detail.name]: detail.value });
  };

  const handleMetaSave = () => {
    const _state = [...state];
    if (currentIndex >= 0) {
      _state[currentIndex] = currentItem;
    } else {
      _state.push(currentItem);
    }
    setState(_state);
    setIsOpen(false);
  };

  const handleDelete = () => {
    setState(state.filter((item) => item._id !== currentItem._id));
    handleClose();
  };

  return (
    <>
      <div className="balance-page page-animate">
        <Topbar title="Account balances">right</Topbar>
        <div className="balance-page__main main-section content-section">
          <AccountScope
            data={scopeState}
            formId={formId}
            handleChange={handleScopeChange}
          />
        </div>
        <div className="balance-page__main main-section content-section">
          <div className="page-title">
            <div className="">Accounts</div>
            <OakButton handleClick={addAccount}>
              <FontAwesomeIcon icon={faPlus} />
            </OakButton>
          </div>
          <AccountItems
            data={state}
            formId={formId}
            handleChange={handleChange}
            handleClick={editAccount}
            handleAddAccount={addAccount}
          />
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
      <OakModal
        isOpen={isOpen}
        handleClose={handleClose}
        backdropIntensity={3}
        animationStyle="slide"
        animationSpeed="normal"
        height="auto"
        width="auto"
        heading="New expense"
      >
        <div slot="body">
          <div className="add-expense">
            {/* <OakForm formGroupName={formId} handleSubmit={save}> */}
            {isOpen && (
              <div className="form">
                <OakInput
                  name="name"
                  value={currentItem.name}
                  formGroupName={formId}
                  handleInput={handleMetaChange}
                  size="large"
                  color="container"
                  shape="rectangle"
                  label="Account name"
                  autofocus
                />
                <div>
                  {['cash', 'debit', 'credit'].map(
                    (item: any, index: number) => (
                      <AccountTypeChip
                        key={item._id || index}
                        activeValue={currentItem.type}
                        value={item}
                        handleClick={(value: string) =>
                          handleMetaChange({ name: 'type', value })
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )}
            {/* </OakForm> */}
          </div>
        </div>
        <div slot="footer">
          <div className="balance-page-footer">
            <OakButton
              formGroupName={formId}
              theme="primary"
              variant="regular"
              handleClick={handleMetaSave}
            >
              <FontAwesomeIcon icon={faChevronRight} /> Save
            </OakButton>
            <OakButton
              formGroupName={formId}
              theme="danger"
              variant="regular"
              handleClick={handleDelete}
            >
              <FontAwesomeIcon icon={faTrash} /> Delete
            </OakButton>
          </div>
        </div>
      </OakModal>
    </>
  );
};

export default BalancePage;
