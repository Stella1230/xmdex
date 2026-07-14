# Dashboard 角色差异化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 根据用户角色渲染不同首页看板，数据自动隔离。

**Architecture:** 提取 StatCards、ChartSection、RecentTaskTable、DashboardHeader 四个共享组件，Dashboard.jsx 根据 `localStorage.getItem('roleId')` 组合渲染。

**Tech Stack:** React 17, Ant Design 4, ECharts 5, dayjs

## Global Constraints

- React 17 + Ant Design 4 + Webpack 5
- Mock 模式：`MOCK_MODE = true`，`mockApi()` 返回 `result` 直接（无 `{data: result}` 包装）
- 后端响应时间戳格式：`Thu Jul 09 15:49:59 CST 2026`，`parseTime()` 用 regex `\s+[A-Z]{2,4}\s+` 去时区
- 路由：react-router-dom 5 hash 模式
- 角色 ID 常量：`ROLE_ADMIN` / `ROLE_DEPT_MANAGER` / `ROLE_GROUP_LEADER` / `ROLE_EMPLOYEE`

---

### Task 1: Login.jsx 存储 roleId

**Files:**
- Modify: `src/routes/Login.jsx:19-20`

**Interfaces:**
- Produces: `localStorage.setItem('roleId', user.roleId)`

- [ ] **Step 1: 在 Login.jsx 的 onFinish 中添加 roleId 存储**

在 `localStorage.setItem('deptId', user.deptId)` 之后添加：

```javascript
localStorage.setItem('roleId', user.roleId)
```

完整 onFinish 函数：

```javascript
const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await login(values)
      const session = res.session || {}
      const user = res.user || {}
      const token = session.sessionId
      localStorage.setItem('token', token)
      localStorage.setItem('userId', user.id)
      localStorage.setItem('deptId', user.deptId)
      localStorage.setItem('roleId', user.roleId)
      const menuIds = user.menuIds || []
      localStorage.setItem('menus', JSON.stringify(menuIds))
      message.success('登录成功')
      window.location.hash = '#/dashboard'
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
```

- [ ] **Step 2: 验证构建**

Run: `node node_modules/webpack/bin/webpack.js --mode development --no-stats`
Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add src/routes/Login.jsx
git commit -m "feat: login stores roleId to localStorage"
```

---

### Task 2: 创建 DashboardHeader 组件

**Files:**
- Create: `src/components/dashboard/DashboardHeader.jsx`

**Interfaces:**
- Consumes: `role` (string), `onRefresh` (function), `timeRange` (string|null), `onTimeRangeChange` (function|null)
- Produces: 头部欢迎语 + 角色 Tag + 可选时间筛选 + 刷新按钮

- [ ] **Step 1: 创建目录**

Run: `mkdir -p src/components/dashboard`

- [ ] **Step 2: 创建 DashboardHeader.jsx**

```jsx
import React from 'react'
import { Tag, Button, Space, Radio } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

const roleConfig = {
  ROLE_ADMIN: { color: 'red', label: '超级管理员' },
  ROLE_DEPT_MANAGER: { color: 'blue', label: '部门负责人' },
  ROLE_GROUP_LEADER: { color: 'green', label: '小组长' },
  ROLE_EMPLOYEE: { color: 'default', label: '普通员工' }
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

const DashboardHeader = ({ role, userName, onRefresh, timeRange, onTimeRangeChange }) => {
  const cfg = roleConfig[role] || roleConfig.ROLE_EMPLOYEE

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>
        {getGreeting()}，{userName || '用户'}
        <Tag color={cfg.color} style={{ marginLeft: 8, fontSize: 12 }}>{cfg.label}</Tag>
      </div>
      <Space>
        {role === 'ROLE_ADMIN' && onTimeRangeChange && (
          <Radio.Group value={timeRange} onChange={(e) => onTimeRangeChange(e.target.value)} buttonStyle="solid" size="small">
            <Radio.Button value="week">本周</Radio.Button>
            <Radio.Button value="month">本月</Radio.Button>
          </Radio.Group>
        )}
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>刷新</Button>
      </Space>
    </div>
  )
}

export default DashboardHeader
```

- [ ] **Step 3: 验证构建**

Run: `node node_modules/webpack/bin/webpack.js --mode development --no-stats`
Expected: 无错误输出

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/
git commit -m "feat: add DashboardHeader component with role tag and time filter"
```

---

### Task 3: 创建 StatCards 组件

**Files:**
- Create: `src/components/dashboard/StatCards.jsx`

**Interfaces:**
- Consumes: `stats` (array of {title, value, color, icon, trend?}), `onCardClick` (function|undefined)
- Produces: 指标卡行

- [ ] **Step 1: 创建 StatCards.jsx**

```jsx
import React from 'react'
import { Row, Col, Card } from 'antd'

const StatCards = ({ stats, onCardClick }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      {stats.map((item, index) => (
        <Col span={Math.floor(24 / stats.length)} key={index}>
          <Card
            hoverable={!!onCardClick}
            onClick={() => onCardClick && onCardClick(item)}
            style={{ borderTop: `3px solid ${item.color || '#1890ff'}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 600, color: item.color || '#333' }}>{item.value}</div>
                <div style={{ color: '#666', fontSize: 14 }}>{item.title}</div>
                {item.trend !== undefined && (
                  <div style={{ color: item.trend >= 0 ? '#52c41a' : '#ff4d4f', fontSize: 12, marginTop: 4 }}>
                    较昨日 {item.trend >= 0 ? '+' : ''}{item.trend}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 32, color: item.color || '#1890ff', opacity: 0.6 }}>
                {item.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default StatCards
```

- [ ] **Step 2: 验证构建**

Run: `node node_modules/webpack/bin/webpack.js --mode development --no-stats`
Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/StatCards.jsx
git commit -m "feat: add StatCards component with trend display"
```

---

### Task 4: 创建 ChartSection 组件

**Files:**
- Create: `src/components/dashboard/ChartSection.jsx`

**Interfaces:**
- Consumes: `charts` (array of {title, type, option}), `emptyText` (string)
- Produces: 图表行

- [ ] **Step 1: 创建 ChartSection.jsx**

```jsx
import React from 'react'
import { Row, Col, Card, Empty, Spin } from 'antd'
import ECharts from '../ECharts'

const ChartSection = ({ charts, loading, emptyText }) => {
  if (!charts || charts.length === 0) {
    return loading ? <Spin /> : <Empty description={emptyText || '暂无数据'} />
  }

  const colSpan = Math.floor(24 / charts.length)

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      {charts.map((chart, index) => (
        <Col span={colSpan} key={index}>
          <Card title={chart.title}>
            {loading ? (
              <Spin style={{ display: 'block', textAlign: 'center', padding: 40 }} />
            ) : (
              <ECharts option={chart.option} style={{ height: 300 }} />
            )}
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default ChartSection
```

- [ ] **Step 2: 验证构建**

Run: `node node_modules/webpack/bin/webpack.js --mode development --no-stats`
Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/ChartSection.jsx
git commit -m "feat: add ChartSection component for role-based charts"
```

---

### Task 5: 创建 RecentTaskTable 组件

**Files:**
- Create: `src/components/dashboard/RecentTaskTable.jsx`

**Interfaces:**
- Consumes: `tasks` (array), `loading` (boolean), `role` (string), `emptyText` (string), `onView` (function), `onAction` (function)
- Produces: 待办列表 Card

- [ ] **Step 1: 创建 RecentTaskTable.jsx**

```jsx
import React from 'react'
import { Card, Table, Button, Tag, Empty, Tooltip, Space, Popconfirm } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined, SwapOutlined, CheckOutlined } from '@ant-design/icons'
import { RightOutlined } from '@ant-design/icons'

const statusMap = {
  '0': { color: 'default', text: '待开始' },
  '1': { color: 'processing', text: '进行中' },
  '2': { color: 'success', text: '已完成' },
  '3': { color: 'error', text: '已取消' }
}

const getStatusTag = (status) => {
  const s = statusMap[status] || statusMap['0']
  return <Tag color={s.color}>{s.text}</Tag>
}

const RecentTaskTable = ({ tasks, loading, role, emptyText, onView, onAction, onMore }) => {
  const getActionColumn = () => {
    const actions = []
    actions.push({ key: 'view', icon: <EyeOutlined />, label: '查看' })

    if (role === 'ROLE_ADMIN' || role === 'ROLE_DEPT_MANAGER') {
      actions.push({ key: 'edit', icon: <EditOutlined />, label: '编辑' })
    }
    if (role === 'ROLE_ADMIN') {
      actions.push({ key: 'delete', icon: <DeleteOutlined />, label: '删除', danger: true })
    }
    if (role === 'ROLE_DEPT_MANAGER') {
      actions.push({ key: 'assign', icon: <SwapOutlined />, label: '调整负责人' })
    }
    if (role === 'ROLE_GROUP_LEADER') {
      actions.push({ key: 'status', icon: <CheckOutlined />, label: '标记状态' })
    }
    if (role === 'ROLE_EMPLOYEE') {
      actions.push({ key: 'complete', icon: <CheckOutlined />, label: '标记完成' })
    }

    return {
      title: '操作', key: 'action', width: 180,
      render: (_, record) => (
        <Space>
          {actions.map(a => {
            if (a.key === 'delete') {
              return (
                <Popconfirm key={a.key} title="确认删除?" onConfirm={() => onAction(a.key, record)}>
                  <Button type="link" size="small" danger icon={a.icon}>{a.label}</Button>
                </Popconfirm>
              )
            }
            return (
              <Button key={a.key} type="link" size="small" danger={a.danger} icon={a.icon} onClick={() => onAction(a.key, record)}>
                {a.label}
              </Button>
            )
          })}
        </Space>
      )
    }
  }

  const columns = [
    { title: '任务标题', dataIndex: 'taskContent', key: 'taskContent', ellipsis: true, render: (v) => <Tooltip title={v}>{v}</Tooltip> },
    { title: '所属项目', dataIndex: 'projectName', key: 'projectName', width: 150, ellipsis: true },
    { title: '负责人', dataIndex: 'ownerName', key: 'ownerName', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: v => getStatusTag(v) },
    getActionColumn()
  ]

  return (
    <Card
      title="最近更新待办"
      extra={<Button type="link" onClick={onMore}>查看全部 <RightOutlined /></Button>}
    >
      {tasks.length === 0 && !loading ? (
        <Empty description={emptyText || '暂无数据'} />
      ) : (
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="taskId"
          loading={loading}
          pagination={false}
          size="small"
        />
      )}
    </Card>
  )
}

export default RecentTaskTable
```

- [ ] **Step 2: 验证构建**

Run: `node node_modules/webpack/bin/webpack.js --mode development --no-stats`
Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/RecentTaskTable.jsx
git commit -m "feat: add RecentTaskTable with role-based actions"
```

---

### Task 6: 更新 mock 数据支持角色差异化

**Files:**
- Modify: `src/api/mock.js`

**Interfaces:**
- Consumes: `role` (from request data)
- Produces: 角色差异化的 boardData 和 taskList

- [ ] **Step 1: 更新 mockData.boardData 添加趋势数据**

在 `mock.js` 的 `boardData` 中添加 `trend` 字段：

```javascript
boardData: {
    statusStat: { completedTask: 5, inProgressTask: 3, pendingTask: 2, overdueTask: 1 },
    projectStatList: [
      { COMPLETEDCOUNT: 3, PROJECTID: 'PROJ_001', TASKCOUNT: 8, OVERDUECOUNT: 1, PROJECTNAME: 'Xmdex待办管理系统' },
      { COMPLETEDCOUNT: 2, PROJECTID: 'PROJ_002', TASKCOUNT: 5, OVERDUECOUNT: 0, PROJECTNAME: '移动端适配项目' }
    ],
    deptStatList: [
      { DEPTID: '2026071017405400000031', DEPTNAME: '总行部门', TASKCOUNT: 8 },
      { DEPTID: '2026071017405400000032', DEPTNAME: '软件开发中心', TASKCOUNT: 5 },
      { DEPTID: '2026071018540900000041', DEPTNAME: '测试中心', TASKCOUNT: 3 }
    ],
    trend: {
      dates: ['07-07', '07-08', '07-09', '07-10', '07-11', '07-12', '07-13'],
     新增: [3, 2, 4, 1, 5, 2, 3],
      completed: [2, 3, 1, 4, 2, 3, 5]
    },
    yesterdayTrend: { totalTask: 2, completedTask: 1, pendingTask: 1, overdueTask: 0 }
  }
```

- [ ] **Step 2: 更新 mockApi 中 boardData handler 支持角色过滤**

在 `mock.js` 的 `fetchBoardData` handler 中根据 `data.roleId` 返回不同范围数据：

```javascript
} else if (url.includes('/fetchBoardData') || url.includes('/todo/board')) {
    const roleId = data.roleId
    const boardData = mockData.boardData
    if (roleId === 'ROLE_EMPLOYEE') {
      result = {
        statusStat: { completedTask: 2, inProgressTask: 1, pendingTask: 0, overdueTask: 0 },
        projectStatList: [],
        deptStatList: [],
        trend: boardData.trend,
        yesterdayTrend: { totalTask: 0, completedTask: 1, pendingTask: 0, overdueTask: 0 }
      }
    } else if (roleId === 'ROLE_GROUP_LEADER') {
      result = {
        statusStat: { completedTask: 3, inProgressTask: 2, pendingTask: 1, overdueTask: 0 },
        projectStatList: boardData.projectStatList.slice(0, 1),
        deptStatList: [],
        trend: boardData.trend,
        yesterdayTrend: { totalTask: 1, completedTask: 1, pendingTask: 0, overdueTask: 0 }
      }
    } else {
      result = boardData
    }
  }
```

- [ ] **Step 3: 验证构建**

Run: `node node_modules/webpack/bin/webpack.js --mode development --no-stats`
Expected: 无错误输出

- [ ] **Step 4: Commit**

```bash
git add src/api/mock.js
git commit -m "feat: mock data supports role-based dashboard differentiation"
```

---

### Task 7: 重构 Dashboard.jsx 为角色路由入口

**Files:**
- Modify: `src/routes/Dashboard.jsx`

**Interfaces:**
- Consumes: `localStorage.getItem('roleId')`, 所有新建组件
- Produces: 完整的角色差异化首页

- [ ] **Step 1: 重写 Dashboard.jsx**

```jsx
import React, { useEffect, useState, useMemo } from 'react'
import { Empty } from 'antd'
import {
  FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, ProjectOutlined
} from '@ant-design/icons'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StatCards from '../components/dashboard/StatCards'
import ChartSection from '../components/dashboard/ChartSection'
import RecentTaskTable from '../components/dashboard/RecentTaskTable'
import { getTodoBoardData, getTodoTaskList } from '../api'

const ROLE_ADMIN = 'ROLE_ADMIN'
const ROLE_DEPT_MANAGER = 'ROLE_DEPT_MANAGER'
const ROLE_GROUP_LEADER = 'ROLE_GROUP_LEADER'
const ROLE_EMPLOYEE = 'ROLE_EMPLOYEE'

const emptyTextMap = {
  [ROLE_ADMIN]: '暂无待办数据，请先创建项目和任务',
  [ROLE_DEPT_MANAGER]: '暂无待办数据',
  [ROLE_GROUP_LEADER]: '暂无待办数据',
  [ROLE_EMPLOYEE]: '暂无分配给你的待办'
}

const Dashboard = () => {
  const role = localStorage.getItem('roleId') || ROLE_EMPLOYEE
  const userName = localStorage.getItem('userId') || '用户'
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({})
  const [chartData, setChartData] = useState({})
  const [recentTasks, setRecentTasks] = useState([])
  const [recentLoading, setRecentLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    fetchData()
    fetchRecentTasks()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getTodoBoardData({
        userId: localStorage.getItem('userId'),
        deptId: localStorage.getItem('deptId'),
        roleId: role
      })
      setStats(res || {})
      setChartData(res || {})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentTasks = async () => {
    setRecentLoading(true)
    try {
      const res = await getTodoTaskList({
        userId: localStorage.getItem('userId'),
        deptId: localStorage.getItem('deptId'),
        roleId: role,
        pageNum: 1,
        pageSize: 10
      })
      setRecentTasks(res?.rows || [])
    } catch (e) {
      console.error(e)
    } finally {
      setRecentLoading(false)
    }
  }

  const statItems = useMemo(() => {
    const s = stats.statusStat || {}
    const trend = stats.yesterdayTrend || {}
    const completed = s.completedTask || 0
    const inProgress = s.inProgressTask || 0
    const pending = s.pendingTask || 0
    const overdue = s.overdueTask || 0
    const total = completed + inProgress + pending + overdue

    const items = []

    if (role === ROLE_ADMIN) {
      items.push(
        { title: '项目总数', value: (stats.projectStatList || []).length, color: '#722ed1', icon: <ProjectOutlined /> },
        { title: '待办总数量', value: total, color: '#1890ff', icon: <FileTextOutlined />, trend: trend.totalTask },
        { title: '进行中', value: inProgress, color: '#faad14', icon: <ClockCircleOutlined />, trend: trend.pendingTask },
        { title: '已逾期', value: overdue, color: '#ff4d4f', icon: <ExclamationCircleOutlined />, trend: trend.overdueTask },
        { title: '已完成', value: completed, color: '#52c41a', icon: <CheckCircleOutlined />, trend: trend.completedTask }
      )
    } else if (role === ROLE_DEPT_MANAGER) {
      items.push(
        { title: '本部门项目数', value: (stats.projectStatList || []).length, color: '#722ed1', icon: <ProjectOutlined /> },
        { title: '部门待办总数', value: total, color: '#1890ff', icon: <FileTextOutlined />, trend: trend.totalTask },
        { title: '进行中', value: inProgress, color: '#faad14', icon: <ClockCircleOutlined />, trend: trend.pendingTask },
        { title: '已逾期', value: overdue, color: '#ff4d4f', icon: <ExclamationCircleOutlined />, trend: trend.overdueTask },
        { title: '部门完成率', value: total > 0 ? Math.round((completed / total) * 100) + '%' : '0%', color: '#52c41a', icon: <CheckCircleOutlined /> }
      )
    } else if (role === ROLE_GROUP_LEADER) {
      items.push(
        { title: '小组待办总数', value: total, color: '#1890ff', icon: <FileTextOutlined />, trend: trend.totalTask },
        { title: '进行中', value: inProgress, color: '#faad14', icon: <ClockCircleOutlined />, trend: trend.pendingTask },
        { title: '已逾期', value: overdue, color: '#ff4d4f', icon: <ExclamationCircleOutlined />, trend: trend.overdueTask },
        { title: '已完成', value: completed, color: '#52c41a', icon: <CheckCircleOutlined />, trend: trend.completedTask }
      )
    } else {
      items.push(
        { title: '我的待办总数', value: total, color: '#1890ff', icon: <FileTextOutlined /> },
        { title: '进行中', value: inProgress, color: '#faad14', icon: <ClockCircleOutlined /> },
        { title: '已完成', value: completed, color: '#52c41a', icon: <CheckCircleOutlined /> }
      )
    }
    return items
  }, [stats, role])

  const charts = useMemo(() => {
    const s = stats.statusStat || {}
    const projectList = stats.projectStatList || []
    const deptList = stats.deptStatList || []
    const trend = stats.trend || {}
    const result = []

    const completed = s.completedTask || 0
    const inProgress = s.inProgressTask || 0
    const pending = s.pendingTask || 0
    const overdue = s.overdueTask || 0

    const pieOption = {
      tooltip: { trigger: 'item' },
      legend: { bottom: '0%', left: 'center' },
      series: [{
        name: '任务状态', type: 'pie', radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        data: [
          { value: completed, name: '已完成', itemStyle: { color: '#52c41a' } },
          { value: inProgress, name: '进行中', itemStyle: { color: '#1890ff' } },
          { value: overdue, name: '已逾期', itemStyle: { color: '#ff4d4f' } }
        ]
      }]
    }

    if (role === ROLE_ADMIN || role === ROLE_DEPT_MANAGER) {
      result.push({ title: role === ROLE_ADMIN ? '全公司待办状态分布' : '本部门待办状态分布', option: pieOption })
    } else {
      result.push({ title: role === ROLE_GROUP_LEADER ? '小组待办状态占比' : '个人待办状态分布', option: pieOption })
    }

    if (role === ROLE_ADMIN && deptList.length > 0) {
      result.push({
        title: '各部门待办数量对比',
        option: {
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          xAxis: { type: 'category', data: deptList.map(d => d.DEPTNAME) },
          yAxis: { type: 'value' },
          series: [{ name: '任务数量', type: 'bar', data: deptList.map(d => d.TASKCOUNT), itemStyle: { color: '#1890ff' } }]
        }
      })
    }

    if ((role === ROLE_ADMIN || role === ROLE_DEPT_MANAGER) && projectList.length > 0) {
      const avgRate = projectList.length > 0
        ? Math.round(projectList.reduce((sum, p) => sum + (p.COMPLETEDCOUNT / p.TASKCOUNT * 100 || 0), 0) / projectList.length)
        : 0
      result.push({
        title: role === ROLE_ADMIN ? '所有项目平均完成度' : '本部门所属项目完成度',
        option: {
          tooltip: { trigger: 'item' },
          series: [{
            type: 'pie', radius: ['40%', '70%'],
            label: { formatter: '{b}: {c}%' },
            data: projectList.map(p => ({
              value: p.TASKCOUNT > 0 ? Math.round((p.COMPLETEDCOUNT / p.TASKCOUNT) * 100) : 0,
              name: p.PROJECTNAME
            }))
          }]
        }
      })
    }

    if (role === ROLE_ADMIN && trend.dates) {
      result.push({
        title: '全公司近7天新增/完成待办趋势',
        option: {
          tooltip: { trigger: 'axis' },
          legend: { data: ['新增', '完成'] },
          xAxis: { type: 'category', data: trend.dates },
          yAxis: { type: 'value' },
          series: [
            { name: '新增', type: 'line', data: trend['新增'] || [], smooth: true, itemStyle: { color: '#1890ff' } },
            { name: '完成', type: 'line', data: trend.completed || [], smooth: true, itemStyle: { color: '#52c41a' } }
          ]
        }
      })
    }

    if ((role === ROLE_DEPT_MANAGER || role === ROLE_GROUP_LEADER) && trend.dates) {
      result.push({
        title: role === ROLE_DEPT_MANAGER ? '本部门近7天任务完成趋势' : '小组近7天任务完成趋势',
        option: {
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: trend.dates },
          yAxis: { type: 'value' },
          series: [{ name: '完成', type: 'line', data: trend.completed || [], smooth: true, itemStyle: { color: '#52c41a' }, areaStyle: { opacity: 0.3 } }]
        }
      })
    }

    if (role === ROLE_EMPLOYEE && trend.dates) {
      result.push({
        title: '个人近7天完成趋势',
        option: {
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: trend.dates },
          yAxis: { type: 'value' },
          series: [{ name: '完成', type: 'line', data: trend.completed || [], smooth: true, itemStyle: { color: '#52c41a' }, areaStyle: { opacity: 0.3 } }]
        }
      })
    }

    if (role === ROLE_GROUP_LEADER && deptList.length > 0) {
      result.push({
        title: '组内成员待办数量对比',
        option: {
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          xAxis: { type: 'category', data: deptList.map(d => d.DEPTNAME) },
          yAxis: { type: 'value' },
          series: [{ name: '任务数量', type: 'bar', data: deptList.map(d => d.TASKCOUNT), itemStyle: { color: '#52c41a' } }]
        }
      })
    }

    return result
  }, [stats, role])

  const handleCardClick = (item) => {
    const statusMap = {
      '待办总数量': '', '部门待办总数': '', '小组待办总数': '', '我的待办总数': '',
      '进行中': '1', '已逾期': 'overdue', '已完成': '2'
    }
    const filter = statusMap[item.title]
    if (filter !== undefined) {
      window.location.hash = `#/task/todo?status=${filter}`
    }
  }

  const handleTaskAction = (action, record) => {
    if (action === 'view') {
      window.location.hash = `#/task/todo?taskId=${record.taskId}`
    } else if (action === 'edit') {
      window.location.hash = `#/task/todo?taskId=${record.taskId}&edit=true`
    }
  }

  return (
    <div style={{ padding: 0 }}>
      <DashboardHeader
        role={role}
        userName={userName}
        onRefresh={() => { fetchData(); fetchRecentTasks() }}
        timeRange={timeRange}
        onTimeRangeChange={role === ROLE_ADMIN ? setTimeRange : null}
      />
      <StatCards stats={statItems} onCardClick={handleCardClick} />
      <ChartSection charts={charts} loading={loading} emptyText={emptyTextMap[role]} />
      <RecentTaskTable
        tasks={recentTasks}
        loading={recentLoading}
        role={role}
        emptyText={emptyTextMap[role]}
        onView={(record) => handleTaskAction('view', record)}
        onAction={handleTaskAction}
        onMore={() => { window.location.hash = '#/task/todo' }}
      />
    </div>
  )
}

export default Dashboard
```

- [ ] **Step 2: 验证构建**

Run: `node node_modules/webpack/bin/webpack.js --mode development --no-stats`
Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add src/routes/Dashboard.jsx
git commit -m "feat: role-based dashboard with admin/manager/leader/employee views"
```

---

### Task 8: 移除 Dashboard.less 中的旧样式引用

**Files:**
- Modify: `src/routes/Dashboard.jsx` (确认无旧 className 引用)
- Verify: `src/routes/Dashboard.less` (确认无未使用的样式)

- [ ] **Step 1: 检查 Dashboard.jsx 是否还有 className 引用**

确认新 Dashboard.jsx 中没有 `className="dashboard"` / `className="stat-row"` 等旧 className。如有，移除或保留 less 文件中的对应样式。

- [ ] **Step 2: 验证构建**

Run: `node node_modules/webpack/bin/webpack.js --mode development --no-stats`
Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add src/routes/Dashboard.jsx src/routes/Dashboard.less
git commit -m "chore: clean up dashboard styles after refactor"
```

---

### Task 9: 更新 README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 在目录结构中添加 dashboard 组件目录**

在 `src/components/` 下添加：

```
│   ├── components/            # 公共组件
│   │   ├── ECharts.jsx        # ECharts图表组件
│   │   ├── ErrorBoundary.jsx  # 错误边界组件
│   │   └── dashboard/         # 首页看板组件
│   │       ├── DashboardHeader.jsx
│   │       ├── StatCards.jsx
│   │       ├── ChartSection.jsx
│   │       └── RecentTaskTable.jsx
```

- [ ] **Step 2: 验证构建**

Run: `node node_modules/webpack/bin/webpack.js --mode development --no-stats`
Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README with dashboard component structure"
```
