import React, { ChangeEvent, useState } from 'react'
import styles from "./index.module.scss"
import CountDown from '../CountDown'
import request from "@/service/fetch"
import { message } from 'antd';

interface IProps {
  isShow: Boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const { isShow = false, onClose } = props;
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)
  const [form, setForm] = useState({
    phone: "",
    verify: ""
  });


  // 关闭
  const handleClose = () => {

  }
  // 获取短信
  const handleGetVerifyCode = () => {
    // setIsShowVerifyCode(true)
    if (!form?.phone) {
      message.warning("请输入手机号")
      return;
    }

    request.post("/api/user/sendVerifyCode", {
      to: form?.phone,
      templateId: 1,
    }).then((res: any) => {
      if (res?.code === 0) {
        setIsShowVerifyCode(true)
      } else {
        message.error(res?.msg || "未知错误")
      }
      console.log(res);
    })
  }
  // 确认登录
  const handleLogin = () => {
    request.post("/api/user/login", {
      ...form,
      identity_type: "phone"
    }).then((res: any) => {
      if (res?.code === 0) {
        // 登录成功
        onClose && onClose()
      } else {
        message.error(res?.msg || "未知错误")
      }
    })
  }
  // Github登录
  const handleOAuthGithub = () => {

  }
  // 改变Form的内容
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    })
  }
  // 倒计时组件
  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
    // alert(222)
  }

  return (
    isShow && (
      <div className={styles.loginArea}>
        <div className={styles.loginBox}>
          <div className={styles.loginTitle}>
            <div>手机号登录</div>
            <div className={styles.close} onClick={handleClose}>x</div>
          </div>
          <input type="text" name='phone' placeholder='请输入手机号' value={form.phone} onChange={handleFormChange} />
          <div className={styles.verifyCodeArea}>
            <input type="text" name='verify' placeholder='请输入验证码' value={form.verify} onChange={handleFormChange} />
            <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
              {isShowVerifyCode ? <CountDown time={10} onEnd={handleCountDownEnd} /> : "获取验证码"}</span>
          </div>
          <div className={styles.loginBtn} onClick={handleLogin}>登录</div>
          <div className={styles.otherLogin} onClick={handleOAuthGithub}>使用Github登录</div>
          <div className={styles.loginPrivacy}>
            注册登录即表示同意
            <a href="#">隐私政策</a>
          </div>
        </div>
      </div>
    )
  )
}

export default Login 