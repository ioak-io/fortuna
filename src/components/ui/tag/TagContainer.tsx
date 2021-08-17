import { Maybe } from 'graphql/jsutils/Maybe';
import React from 'react';
import Tag from './Tag';
import { ArticleTag } from '../../../types/graphql';

interface Props {
  tags: Array<Maybe<ArticleTag>>;
}

const TagContainer = (props: Props) => {
  return (
    <div className="tag-container">
      {props.tags.map((item: Maybe<ArticleTag>) => (
        <div key={item?.id}>{item && <Tag tag={item.name || ''} />}</div>
      ))}
    </div>
  );
};

export default TagContainer;
