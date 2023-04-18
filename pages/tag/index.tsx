import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Button, Tabs, message } from 'antd';
import type { TabsProps } from 'antd';
import { observer } from 'mobx-react-lite';
import request from '@/service/fetch';
import { useStore } from '@/store';
import styles from './index.module.scss'
import * as ANTD_ICONS from '@ant-design/icons'

interface IUser {
  id: number;
  nickname: string;
  avatar: string
}

interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUser[];
}


const Tags: NextPage = () => {

  const store = useStore();
  const [followTags, setFollowTags] = useState<ITag[]>();
  const [allTags, setAllTags] = useState<ITag[]>();
  const { userId } = store?.user?.userInfo || {};
  const [needRefresh, setNeedRefresh] = useState(false)

  // 发起请求获得数据
  useEffect(() => {
    request('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        const { followTags = [], allTags = [] } = res?.data as any;
        console.log(followTags);
        console.log(allTags);
        setFollowTags(followTags);
        setAllTags(allTags)
      }
    })
  }, [needRefresh])

  const onChange = (TagId: string) => {
    console.log(TagId);

  };

  // 关注
  const handleFollow = (tagId: number) => {
    console.log(tagId);

    request.post('/api/tag/follow', {
      type: "follow",
      tagId
    }).then((res: any) => {
      console.log(res);

      if (res?.code === 0) {
        message.success('关注成功')
        setNeedRefresh(!needRefresh)
      } else {
        message.error(res?.msg || "关注失败")
      }
    })
  }

  // 取消关注
  const handleUnFollow = (tagId: number) => {
    request.post('/api/tag/follow', {
      type: "unFollow",
      tagId
    }).then((res: any) => {
      if (res?.code === 0) {
        message.success('取关成功')
        setNeedRefresh(!needRefresh)
      } else {
        message.error(res?.msg || "取关失败")
      }
    })
  }

  // tab页面
  const items: TabsProps['items'] = [
    {
      key: 'follow',
      label: `已关注标签`,
      children: <div className={styles.tags}>{
        followTags?.map((tag: any) => (
          <div className={styles.tagWrapper} key={tag?.title}>
            <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
            <div className={styles.title}>{tag?.title}</div>
            <div>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
            {
              tag?.users?.find((user: any) => Number(user?.id) === Number(userId)) ? (
                <Button type='primary' onClick={() => handleUnFollow(tag?.id)}>已关注</Button>
              ) : (
                <Button onClick={() => handleFollow(tag?.id)}>取消关注</Button>
              )
            }
          </div>
        ))
      }</div>,
    },
    {
      key: 'all',
      label: `全部标签`,
      children: <div className={styles.tags} >{
        allTags?.map((tag: any) => (
          <div className={styles.tagWrapper} key={tag?.title}>
            <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
            <div className={styles.title}>{tag?.title}</div>
            <div>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
            {
              tag?.users?.find((user: any) => Number(user?.id) === Number(userId)) ? (
                <Button type='primary' onClick={() => handleUnFollow(tag?.id)}>已关注</Button>
              ) : (
                <Button onClick={() => handleFollow(tag?.id)}>关注</Button>
              )
            }
          </div>
        ))
      }</div>,
    }
  ];

  return (
    <div className='content-layout'>
      <Tabs defaultActiveKey="follow" items={items} onChange={onChange} />
    </div>
  )
}

export default observer(Tags);