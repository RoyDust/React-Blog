import React from "react";

// 在开发环境 页面错误的兜底操作，防止白屏

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError(error: any) {
    console.log(error);

    return {
      hasError: true,
    };
  }

  componentDidCatch(error: any, info: any) {
    console.log("22222");
    console.log(error, info);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div>
          <h2>页面发生错误</h2>
          <button type="button" onClick={() => this.setState({ hasError: false })}>再试一次试试看？</button>
        </div>
      )
    }
    return this.props.children;
  }

}

export default ErrorBoundary;