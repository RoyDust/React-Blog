import type { NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { navs } from './config'
import styles from "./index.module.scss"
import { Button, Avatar, Dropdown, MenuProps, message } from "antd"
import { LoginOutlined, HomeOutlined } from "@ant-design/icons"
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Login from 'components/Login'
import { useStore } from '@/store'
import request from 'service/fetch'

const Navbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  // 转跳文章编辑页面
  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new')
    } else {
      message.warning("请先登录")
    }
  }
  // 登录弹窗
  const handleLogin = () => {
    setIsShowLogin(true);
  }
  // 关闭方法
  const handleClose = () => {
    setIsShowLogin(false)
  }

  // 跳转个人页面
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
  }

  // 退出
  const handleLogout = () => {
    request.post("/api/user/logout").then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({})
      }
    })
  }

  // 渲染下拉菜单
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={handleGotoPersonalPage}><HomeOutlined /> 个人主页</div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={handleLogout} >
          <LoginOutlined /> 退出系统
        </div>
      ),
    }
  ];

  return (
    <div className={styles.navbar}>
      <section className={styles.logArea}>RoyDust</section>
      <section className={styles.linkArea}>
        {/* 渲染vars数组 */}
        {
          navs?.map(nav => (
            <Link key={nav?.label} href={nav?.value}>
              {/* 根据路由判断是否为选中页面 */}
              <p className={pathname === nav?.value ? styles.active : ""}>{nav.label}</p>
            </Link>
          ))
        }
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {
          userId ? (
            <>
              <Dropdown menu={{ items }} placement='bottomLeft' >
                <Avatar src={avatar} size={32} />
              </Dropdown>
            </>
          ) : <Button type='primary' onClick={handleLogin}>登录</Button>
        }
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} ></Login>
    </div >
  )
}

// 用mobx的observer包裹组件，实现响应式
export default observer(Navbar);