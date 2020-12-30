import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './FieldElement.scss';
import { any } from 'prop-types';
import { newId } from '../../events/MessageService';
import EditAttribute from './EditAttribute';

interface Props {
  data: any[];
  reference: string | null;
  handleChange: any;
  id: string;
}
const emptyField = {
  name: '',
  datatype: '',
  lower: 1,
  upper: 2,
  array: false,
  id: '',
};
const FieldElement = (props: Props) => {
  const [currentField, setCurrentField] = useState<any>();
  const [children, setChildren] = useState<any>();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editNodeData, setEditNodeData] = useState<any>({
    ...emptyField,
    parentReference: props.reference,
    reference: newId(),
    id: props.id,
  });

  useEffect(() => {
    setCurrentField(
      props.data.find(item => item.reference === props.reference)
    );
    setChildren(
      props.data.filter(item => item.parentReference === props.reference)
    );
  }, [props.data, props.reference]);

  useEffect(() => {
    if (!showEditDialog) {
      setEditNodeData({
        ...emptyField,
        parentReference: props.reference,
        reference: newId(),
      });
    }
  }, [showEditDialog]);

  const editNode = () => {
    setEditNodeData(currentField);
    setShowEditDialog(true);
  };

  const newNode = () => {
    setShowEditDialog(true);
  };

  const onRemoveNode = () => {
    props.handleChange('remove', props.reference, props.id);
  };

  const onEditNode = updatedNode => {
    props.handleChange('edit', updatedNode, props.id);
    setShowEditDialog(false);
  };

  return (
    <>
      <div className="field-element">
        <div className="field-element-parent">
          <div className="field-element-parent--title typography-5">
            {currentField && <div>{currentField?.name}</div>}
            {!currentField && <div>Root</div>}
          </div>
          {currentField && (
            <div className="field-element-parent--subtitle typography-4">
              <div>
                {`Datatype: ${currentField.datatype}${
                  currentField.array ? ' [ ]' : ''
                }`}
              </div>
              {!currentField && <div>Root</div>}
            </div>
          )}
          <div className="field-element-parent--action typography-4">
            {currentField && (
              <>
                <div
                  className="field-element-action hyperlink"
                  onClick={editNode}
                >
                  edit
                </div>
                <div
                  className="field-element-action hyperlink"
                  onClick={onRemoveNode}
                >
                  delete
                </div>
              </>
            )}
            {(!currentField || currentField.datatype === 'object') && (
              <div className="field-element-action hyperlink" onClick={newNode}>
                new-attribute
              </div>
            )}
          </div>
        </div>
        {children?.length > 0 && (
          <div className="field-element-children">
            {children.map(child => (
              <div
                className="field-element-children--element"
                key={child.reference}
              >
                <FieldElement
                  id={props.id}
                  data={props.data}
                  reference={child.reference}
                  handleChange={props.handleChange}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <EditAttribute
        visible={showEditDialog}
        toggleVisibility={() => setShowEditDialog(!showEditDialog)}
        data={editNodeData}
        onSave={onEditNode}
      />
    </>
  );
};

export default FieldElement;
