import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import OakModal from '../../oakui/wc/OakModal';
import EditTagCommand from '../../events/EditTagCommand';
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

import { saveTag } from './service';

interface Props {
  space: string;
}

const EMPTY_CATEGORY = { _id: null, name: '', kakeibo: '' };

const EditTag = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const profile = useSelector((state: any) => state.profile);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formId, setFormId] = useState(newId());
  const [stepNumber, setStepNumber] = useState(1);
  const [state, setState] = useState({ ...EMPTY_CATEGORY });
  const [anotherDay, setAnotherDay] = useState(false);
  const [todayDate, setTodayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [yesterdayDate, setYesterdayDate] = useState(
    format(addDays(new Date(), 1), 'yyyy-MM-dd')
  );

  useEffect(() => {
    EditTagCommand.subscribe((message) => {
      if (message.open) {
        setState(
          message.record ? { ...message.record } : { ...EMPTY_CATEGORY }
        );
      }
      setIsOpen(message.open);
    });
  }, []);

  const handleClose = () => {
    EditTagCommand.next({ open: false });
  };

  const handleChange = (detail: any) => {
    setState({ ...state, [detail.name]: detail.value });
  };

  const updatekakeibo = (kakeibo: string) => {
    setState({ ...state, kakeibo });
  };

  const save = () => {
    console.log('save');
    saveTag(props.space, state, authorization);
    EditTagCommand.next({ open: false });
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
        heading={state._id ? 'Edit tag' : 'New tag'}
      >
        <div slot="body">
          <div className="edit-tag">
            {isOpen && (
              <OakForm formGroupName={formId} handleSubmit={save}>
                <div className="edit-tag__form">
                  <OakInput
                    name="name"
                    value={state.name}
                    formGroupName={formId}
                    gutterBottom
                    handleInput={handleChange}
                    size="large"
                    color="container"
                    shape="rectangle"
                    label="Tag name"
                    autofocus
                  />
                </div>
              </OakForm>
            )}
          </div>
        </div>
        <div slot="footer">
          <div className="edit-tag-footer">
            <OakButton
              formGroupName={formId}
              type="submit"
              theme="primary"
              variant="regular"
            >
              <FontAwesomeIcon icon={faChevronRight} />
              Save
            </OakButton>
          </div>
        </div>
      </OakModal>
    </>
  );
};

export default EditTag;
