import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import OakForm from '../../../oakui/wc/OakForm';
import { newId } from '../../../events/MessageService';
import OakButton from '../../../oakui/wc/OakButton';
import OakSelect from '../../../oakui/wc/OakSelect';
import OakInput from '../../../oakui/wc/OakInput';

import './TagEditor.scss';
import Tag from './Tag';
import { ARTICLE_TAG_CLOUD } from '../../../components/Types/ArticleSchema';
import OakClickArea from '../../../oakui/wc/OakClickArea';

interface Props {
  tags: any[];
  handleRemoval?: any;
  handleAddition?: any;
}

const TagEditor = (props: Props) => {
  const { data } = useQuery(ARTICLE_TAG_CLOUD, {
    fetchPolicy: 'cache-and-network',
  });

  const [allTags, setAllTags] = useState<any>([]);

  useEffect(() => {
    if (data?.articleTagCloud) {
      setAllTags(data.articleTagCloud.map((tag: any) => tag.name));
    }
  }, [data]);

  const [tagName, setTagName] = useState('');
  const [showNewTagPrompt, setShowNewTagPrompt] = useState(false);
  const handleTagNameChange = (detail: any) => {
    setTagName(detail.value);
  };
  const handleNewTagAction = (detail: any) => {
    if (detail.value === 'new') {
      setShowNewTagPrompt(true);
      setTagName(detail.criteria);
    }
  };

  const addNewTag = () => {
    handleAddition(tagName);
    setTagName('');
    setShowNewTagPrompt(false);
  };

  const handleTagSelection = (detail: any) => {
    handleAddition(detail.value);
  };
  const handleAddition = (_tag: string) => {
    props.handleAddition(_tag);
  };
  const handleRemoval = (_tag: string) => {
    props.handleRemoval(_tag);
  };
  const formId = newId();

  return (
    <div className="tag-editor">
      <div className="tag-editor__content">
        <div className="tag-editor__content__form">
          {!showNewTagPrompt && (
            <OakSelect
              label="Tags"
              shape="sharp"
              name="tag"
              autocomplete
              options={allTags}
              actionItems={['new']}
              value=""
              placeholder="Add tag"
              handleChange={handleTagSelection}
              handleActionItem={handleNewTagAction}
              popupColor="surface"
              color="container"
              fill
            />
          )}
          {showNewTagPrompt && (
            <div className="tag-editor__content__form__newtag">
              <OakInput
                label="Tags"
                shape="sharp"
                name="tagName"
                placeholder="Create new tag"
                value={tagName}
                handleChange={handleTagNameChange}
                color="container"
                fill
              />
              <div className="tag-editor__content__form__newtag__action">
                <OakClickArea handleClick={addNewTag}>
                  <div className="tag-editor__content__form__newtag__action__icon">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </OakClickArea>
                <OakClickArea handleClick={() => setShowNewTagPrompt(false)}>
                  <div className="tag-editor__content__form__newtag__action__icon">
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                </OakClickArea>
              </div>
            </div>
          )}
        </div>
        <div className="tag-editor__content__chips">
          {props.tags?.map((item) => (
            <Tag tag={item} handleClick={() => handleRemoval(item)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagEditor;
