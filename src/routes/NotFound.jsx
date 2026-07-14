import React from 'react'
import { Button, Result } from 'antd'
import { useHistory } from 'react-router-dom'
// ✅ REAP规范适配 - 组件风格：无状态函数组件

const NoFound = () => {
  const history = useHistory()

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          返回首页
        </Button>
      }
    />
  )
}

export default NoFound