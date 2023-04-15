import React, { } from 'react'
import { prepareConnection } from '@/db'
import { Article } from '@/db/entity'
import ListItem from '@/components/ListItem'
import { IArticle } from './api'
import { Divider } from 'antd'


interface IProps {
  articles: IArticle[]
}


export async function getServerSideProps() {
  const db = await prepareConnection()
  const articles = await db.getRepository(Article).find({
    relations: ['user']
  })
  console.log("articles:", articles);

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || []
    }
  }
}

const index = (props: IProps) => {
  const { articles } = props;

  console.log(articles);

  return (
    <div>
      <div className="content-layout">
        {
          articles?.map((article) =>
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

export default index