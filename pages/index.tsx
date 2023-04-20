import React, { useEffect, useState } from 'react'
import { prepareConnection } from '@/db'
import { Article, Tag } from '@/db/entity'
import ListItem from '@/components/ListItem'
import { IArticle } from './api'
import { Divider } from 'antd'
import Tags from '@/components/Tags'
import request from '@/service/fetch'


interface ITag {
  id: number;
  title: string;
}

interface IProps {
  articles: IArticle[],
  tags: ITag[]
}

export async function getServerSideProps() {
  const db = await prepareConnection()
  const articles = await db.getRepository(Article).find({
    relations: ['user', 'tags']
  })
  const tags = await db.getRepository(Tag).find({
    relations: ['users'],
  });
  console.log("articles:", articles);

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || []
    }
  }
}

const Index = (props: IProps) => {
  const { articles, tags } = props;

  const [selectTag, setSelectTag]: [number, Function] = useState(0);
  const [showAricles, setShowAricles] = useState([...articles]);

  console.log(articles);
  console.log(tags);

  useEffect(() => {
    console.log("++++++", selectTag);

    if (selectTag) {
      selectTag &&
        request.get(`/api/article/get?tag_id=${selectTag}`).then((res: any) => {
          if (res?.code === 0) {
            console.log(res);
            setShowAricles(res?.data);
          }
        });
    } else {
      setShowAricles([...articles])
    }

  }, [selectTag, articles]);


  const changeTag = (tagId: number) => {
    setSelectTag(tagId)
  }



  return (
    <div>
      <Tags changeTag={changeTag} tags={tags} />
      <div className="content-layout">
        {
          showAricles?.map((article) =>
          (
            <>
              <ListItem article={article} key={article.id} />
              <Divider />
            </>
          ))
        }
      </div>
    </div>
  )
}

export default Index