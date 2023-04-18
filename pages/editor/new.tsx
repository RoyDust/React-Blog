import { NextPage } from "next"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { ChangeEvent, useEffect, useState } from "react";
import { Input, Button, message, Select } from "antd";
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
  const [allTags, setAllTags]: [[], Function] = useState([])
  const [tagIds, setTagIds] = useState([])

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

  // 发布文章请求
  const handlePublish = () => {
    if (!title) {
      message.warning("请输入文章标题");
      return;
    }
    request.post('/api/article/publish', {
      title,
      content,
      tagIds
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
        <Button className={styles.button} type="primary" onClick={handlePublish}>发布</Button>
      </div>
      <MDEditor value={content} height={970} onChange={handleContentChange} />
    </div>
  );
}
// 将layout栏取消
(NewEditor as any).layout = null;


export default observer(NewEditor)