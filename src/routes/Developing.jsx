import React from 'react'
import { Result } from 'antd'
// ✅ REAP规范适配 - 组件风格：无状态函数组件（纯展示）

const Developing = () => {
  return (
    <Result
      status="info"
      title="功能待开发"
      subTitle="该模块正在开发中，敬请期待..."
    />
  )
}

export default Developing