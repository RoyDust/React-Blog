import { NextPage } from "next"
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

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const NewEditor: NextPage = () => {
  const store = useStore();
  const { push } = useRouter();
  const { userId } = store.user.userInfo;
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("")

  const handlePublish = () => {
    if (!title) {
      message.warning("请输入文章标题");
      return;
    }
    request.post('/api/article/publish', {
      title,
      content
    }).then((res: any) => {
      if (res?.code === 0) {
        // Todo 跳转
        message.success("发布成功");
        userId ? push(`/user/${userId}`) : push("/")
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
        <Button className={styles.button} type="primary" onClick={handlePublish}>发布</Button>
      </div>
      <MDEditor value={content} height={970} onChange={handleContentChange} />
    </div>
  );
}
// 将layout栏取消
(NewEditor as any).layout = null;


export default observer(NewEditor)