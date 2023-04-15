import Layout from 'components/layout'
import '@/styles/globals.css'
import { StoreProvider } from '@/store'
import { NextPage } from 'next';

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage,
  pageProps: any
}

function MyApp({ initialValue, Component, pageProps }: IProps) {

  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps} />
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )
    }
  }

  return (
    <StoreProvider initialValue={initialValue}>
      {renderLayout()}
    </StoreProvider>
  )
}

// 将cookie当做Provider注入到App中，子组件可用
MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  console.log(ctx?.req?.cookies);

  const { id, nickname, avatar } = ctx?.req?.cookies || {};
  return {
    initialValue: {
      user: {
        userInfo: {
          userId: id, nickname, avatar
        }
      }
    }
  }
}

export default MyApp;