import type { NextPage } from 'next'
import { navs } from './config'
import styles from "./index.module.scss"
import { Button } from "antd"
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Login from 'components/Login'

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  // 转跳文章编辑页面
  const handleGotoEditorPage = () => {

  }
  // 登录弹窗
  const handleLogin = () => {
    setIsShowLogin(true);
  }
  // 关闭方法
  const handleClose = () => {
    setIsShowLogin(false)
  }


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
        <Button type='primary' onClick={handleLogin}>登录</Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} ></Login>
    </div >
  )
}

export default Navbar