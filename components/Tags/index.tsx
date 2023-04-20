import React, { ChangeEvent, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import styles from './index.module.scss'
import classnames from 'classnames'


interface ITag {
  id: number;
  title: string;
}

interface IProps {
  changeTag: Function,
  tags: ITag[]
}

const Tags = (props: IProps) => {



  const { changeTag, tags } = props;

  console.log(tags);
  const [selectTag, setSelectTag] = useState(0);

  const handleSelectTag = (event: any) => {

    const { tagid } = event?.target?.dataset || {};
    console.log(tagid);

    setSelectTag(Number(tagid));
    changeTag(tagid)
  };

  return (
    <div className={styles.tags} onClick={handleSelectTag}>
      {tags?.map((tag) => (
        <div
          key={tag?.id}
          data-tagid={tag?.id}
          className={classnames(
            styles.tag,
            selectTag === tag?.id ? styles['active'] : ''
          )}
        >
          {tag?.title}
        </div>
      ))}
    </div>
  )
}

export default observer(Tags) 