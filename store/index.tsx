import React, { ReactElement, createContext, useContext } from "react"
import { useLocalObservable, enableStaticRendering } from "mobx-react-lite"
import createStore, { IStore } from "./rootStore"

interface IProps {
  initialValue: Record<any, any>
  children: ReactElement
}

//  如果是浏览器环境就为false，如果为ssr环境就为false
enableStaticRendering(!process.browser)

const StoreContext = createContext({})

// 通过Context 来维护全局状态
export const StoreProvider = ({ initialValue, children }: IProps) => {
  // initialValue就是拿到的cookie，作为store的初始值
  const store: IStore = useLocalObservable(createStore(initialValue))

  return (
    <StoreContext.Provider value={store}> {children} </StoreContext.Provider>
  )
}

// 通过useStore来调用store数据
export const useStore = () => {
  const store: IStore = useContext(StoreContext) as IStore;
  if (!store) {
    throw new Error("数据不存在")
  }
  return store
}