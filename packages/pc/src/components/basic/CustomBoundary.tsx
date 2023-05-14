import type { ErrorInfo } from 'react';
import React from 'react';
import { Button, Result } from 'antd';

export default class CustomBoundary extends React.Component<
  Record<string, any>,
  { hasError: boolean; errorInfo: string }
> {
  state = { hasError: false, errorInfo: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Result
          status='404'
          title='请刷新页面'
          subTitle='您好，页面功能升级，请刷新页面体验最新功能.'
          extra={
            <Button
              type='primary'
              danger
              onClick={() => {
                window.location.reload();
              }}
            >
              刷新页面
            </Button>
          }
          style={{
            height: '100%',
            background: '#fff',
          }}
        />
      );
    }
    return this.props.children;
  }
}
