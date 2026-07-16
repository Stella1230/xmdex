import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import 'antd/dist/antd.css'
import './index.less'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'


ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ConfigProvider>,
  document.getElementById('root')
)
