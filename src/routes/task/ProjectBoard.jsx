import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { getTodoBoardData } from '../../services'
import ECharts from '../../components/ECharts'

const ProjectBoard = () => {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({})
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('userId')
      const deptId = localStorage.getItem('deptId')
      const res = await getTodoBoardData({ userId, deptId })
      setStats(res.stats || {})
      setChartData(res.chart || {})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const pieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      name: '任务分布',
      type: 'pie',
      radius: '60%',
      data: chartData.projects?.map((name, i) => ({ name, value: chartData.counts?.[i] || 0 })) || [],
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  }

  const barOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: chartData.projects || [] },
    yAxis: { type: 'value', name: '任务数' },
    series: [{ name: '任务数', type: 'bar', data: chartData.counts || [], itemStyle: { color: '#1890ff' } }]
  }

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="任务总数" value={stats.totalTask} /></Card></Col>
        <Col span={6}><Card><Statistic title="已完成" value={stats.completedTask} valueStyle={{ color: '#3f8600' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="进行中" value={stats.pendingTask} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已逾期" value={stats.overdueTask} valueStyle={{ color: '#cf1322' }} /></Card></Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}><Card title="项目任务分布">{chartData.projects?.length ? <ECharts option={pieOption} style={{ height: 300 }} /> : <div style={{ height: 300, lineHeight: '300px', textAlign: 'center', color: '#999' }}>暂无数据</div>}</Card></Col>
        <Col span={12}><Card title="项目任务统计">{chartData.projects?.length ? <ECharts option={barOption} style={{ height: 300 }} /> : <div style={{ height: 300, lineHeight: '300px', textAlign: 'center', color: '#999' }}>暂无数据</div>}</Card></Col>
      </Row>
    </div>
  )
}

export default ProjectBoard