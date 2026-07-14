import React from 'react'
import { Tag } from 'antd'

export const statusMap = {
  '0': { color: 'default', text: '待开始' },
  '1': { color: 'processing', text: '进行中' },
  '2': { color: 'success', text: '已完成' },
  '3': { color: 'error', text: '已取消' }
}

export const getStatusTag = (status) => {
  const s = statusMap[status] || statusMap['0']
  return <Tag color={s.color}>{s.text}</Tag>
}
