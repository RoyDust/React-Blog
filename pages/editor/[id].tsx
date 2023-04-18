import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { ChangeEvent, useEffect, useState } from "react";
import { Input, Button, message, Select } from "antd";
import styles from "./index.module.scss"
import request from "@/service/fetch";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { prepareConnection } from "@/db";
import { Article } from "@/db/entity";
import { IArticle } from "../api";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface IProps {
  article: IArticle
}

// ssr 这里还是属于后端
export async function getServerSideProps({ params }: any) {

  // 获取文章id
  console.log(params);
  const articleId = params?.id;

  const db = await prepareConnection()
  const articleRepo = db.getRepository(Article)
  const article = await articleRepo.findOne({
    where: {
      id: articleId
    },
    relations: ['user']
  })
  console.log("article:详情", article);

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || []
    }
  }
}


const ModifyEditor = (props: IProps) => {
  const { push, query } = useRouter();
  const articleId = Number(query?.id);
  const { article } = props;
  const [content, setContent] = useState(article?.content || "");
  const [title, setTitle] = useState(article?.title || "")
  const [allTags, setAllTags]: [[], Function] = useState([])
  const [tagIds, setTagIds] = useState([])

  console.log(articleId);

  // 获取所有tags
  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        const { allTags = [] } = res?.data as any;
        console.log(allTags);
        // 将allTags进行过滤处理 
        let options: any[] = [];
        allTags.forEach((item: any) => {
          options.push({ value: `${item?.id}`, label: `${item?.title}` })
        })
        setAllTags(options || [])
      }
    })
  }, [])



  const handlePublish = () => {
    if (!title) {
      message.warning("请输入文章标题");
      return;
    }
    request.post('/api/article/update', {
      id: articleId,
      title,
      content,
      tagIds
    }).then((res: any) => {
      if (res?.code === 0) {
        // Todo 跳转
        message.success("更新成功");
        articleId ? push(`/article/${articleId}`) : push("/")
      } else {
        message.error(res?.msg || '发布失败')
      }
    })
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value)
  }

  const handleContentChange = (content: any) => {
    setContent(content)
  }

  // 选择标签
  const handleSelectTag = (value: []) => {
    setTagIds(value)
    // console.log(tagIds);
  }


  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange} />
        <Select className={styles.tag} mode="multiple" allowClear placeholder="请输入标签" onChange={handleSelectTag} options={allTags} />
        <Button className={styles.button} type="primary" onClick={handlePublish}>更新文章</Button>
      </div>
      <MDEditor value={content} height={970} onChange={handleContentChange} />
    </div>
  );
}
// 将layout栏取消
(ModifyEditor as any).layout = null;


export default observer(ModifyEditor)