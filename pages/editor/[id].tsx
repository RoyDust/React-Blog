import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { ChangeEvent, useState } from "react";
import { Input, Button, message } from "antd";
import styles from "./index.module.scss"
import request from "@/service/fetch";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
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

  console.log(articleId);


  const handlePublish = () => {
    if (!title) {
      message.warning("请输入文章标题");
      return;
    }
    request.post('/api/article/update', {
      title,
      content,
      id: articleId
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


  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange} />
        <Button className={styles.button} type="primary" onClick={handlePublish}>更新文章</Button>
      </div>
      <MDEditor value={content} height={970} onChange={handleContentChange} />
    </div>
  );
}
// 将layout栏取消
(ModifyEditor as any).layout = null;


export default observer(ModifyEditor)