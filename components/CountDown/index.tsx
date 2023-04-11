import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss"

interface IProps {
  time: number,
  onEnd: Function
}

const CountDown = (props: IProps) => {
  const { time, onEnd } = props;
  const [count, setCount] = useState(time || 60);
  const timeRef = useRef(() => { })

  const tick = () => {
    if (count > 0) {
      setCount(count - 1)
    } else {
      onEnd && onEnd()
      return count;
    }
  }
  // 每次渲染，将 tick 赋值给 ref，以保留上下文
  useEffect(() => {
    timeRef.current = tick;
  })

  // 倒计时逻辑 
  useEffect(() => {
    // 在初始化后，setInterval callback 都会获得 ref 的最新值
    const timer = setInterval(() => timeRef.current(), 1000);
    // console.log("tick", timer);

    return () => clearInterval(timer)
  }, [count])

  return (
    <div className={styles.countDown}>{count}</div>
  )
}

export default CountDown