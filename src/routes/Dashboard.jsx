import React from 'react'
import { Card, Row, Col, Spin, Empty, Table, Button, Tooltip } from 'antd'
import { FolderOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, RightOutlined } from '@ant-design/icons'
import ECharts from '../components/ECharts'
import { getStatusTag } from '../utils/Status'
import useDashboardModel from '../models/Dashboard'
import './Dashboard.less'

const recentColumns = [
  { title: '任务标题', dataIndex: 'taskName', key: 'taskName', ellipsis: true, render: (v) => <Tooltip title={v}>{v}</Tooltip> },
  { title: '所属项目', dataIndex: 'projectName', key: 'projectName', width: 150, ellipsis: true },
  { title: '负责人', dataIndex: 'assigneeName', key: 'assigneeName', width: 100 },
  { title: '计划时间', dataIndex: 'planFinishTime', key: 'planFinishTime', width: 150 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: v => getStatusTag(v) }
]

const statCards = [
  { key: 'projectCount', title: '项目总数', icon: FolderOutlined, color: 'blue', path: '#/project/list' },
  { key: 'totalTask', title: '任务总数量', icon: FileTextOutlined, color: 'cyan', path: '#/task/todo' },
  { key: 'inProgressTask', title: '进行中任务', icon: ClockCircleOutlined, color: 'orange', path: '#/task/todo' },
  { key: 'overdueTask', title: '已逾期任务', icon: ExclamationCircleOutlined, color: 'red', path: '#/task/todo' },
  { key: 'completedTask', title: '已完成任务', icon: CheckCircleOutlined, color: 'green', path: '#/task/todo' }
]

const Dashboard = () => {
  const {
    loading, error, stats, recentTasks, recentLoading,
    pieOption, barOption, ringOption, lineOption, hasChartData, hasTrendData,
    handleRowClick
  } = useDashboardModel()

  const renderChart = (option, hasData) => (
    !hasData && !loading ? <Empty description="暂无数据" /> : <ECharts option={option} style={{ height: 300 }} />
  )

  return (
    <div className="dashboard">
      <Spin spinning={loading}>
        {error && <Card className="error-card"><span>{error}</span></Card>}

        <div className="stat-row">
          {statCards.map(({ key, title, icon: Icon, color, path }) => (
            <div className="stat-col" key={key}>
              <Card
                className={`stat-card stat-card-${color}`}
                hoverable={!!path}
                onClick={() => path && (window.location.hash = path)}
              >
                <div className="stat-content">
                  <div className={`stat-icon stat-icon-${color}`}><Icon /></div>
                  <div className="stat-info">
                    <div className="stat-value">{stats[key]}</div>
                    <div className="stat-title">{title}</div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <Row gutter={16} className="chart-row">
          <Col span={12}>
            <Card className="chart-card" title="项目完成度分布">
              {renderChart(ringOption, hasChartData)}
            </Card>
          </Col>
          <Col span={12}>
            <Card className="chart-card" title="各项目任务数量">
              {renderChart(barOption, hasChartData)}
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="chart-row">
          <Col span={12}>
            <Card className="chart-card" title="任务状态分布">
              {renderChart(pieOption, hasChartData || stats.totalTask > 0)}
            </Card>
          </Col>
          <Col span={12}>
            <Card className="chart-card" title="近7天任务趋势">
              {renderChart(lineOption, hasTrendData)}
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="table-row">
          <Col span={24}>
            <Card
              className="recent-card"
              title="最近更新任务"
              extra={<Button type="link" onClick={() => window.location.hash = '#/task/todo'}>查看全部 <RightOutlined /></Button>}
            >
              <Spin spinning={recentLoading}>
                {recentTasks.length === 0 && !recentLoading ? (
                  <Empty description="暂无任务数据" />
                ) : (
                  <Table
                    columns={recentColumns}
                    dataSource={recentTasks}
                    pagination={false}
                    size="small"
                    onRow={(record) => ({ onClick: () => handleRowClick(record), style: { cursor: 'pointer' } })}
                  />
                )}
              </Spin>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  )
}

export default Dashboard
