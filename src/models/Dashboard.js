import { useState, useEffect, useMemo, useCallback } from 'react'
import { getTodoBoardData, getTodoTaskList } from '../services'
import { getPageCache, setPageCache } from '../common/PageCache'

const CACHE_KEY = 'dashboard'

const getAuthParams = () => ({
  userId: localStorage.getItem('userId'),
  deptId: localStorage.getItem('deptId')
})

const useDashboardModel = () => {
  const cached = getPageCache(CACHE_KEY)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(cached?.stats ?? {
    projectCount: 0,
    totalTask: 0,
    inProgressTask: 0,
    overdueTask: 0,
    completedTask: 0
  })
  const [chartData, setChartData] = useState(cached?.chartData ?? { projects: [], counts: [], completionData: [] })
  const [trendData, setTrendData] = useState(cached?.trendData ?? { dates: [], newTask: [], completedTask: [] })
  const [recentTasks, setRecentTasks] = useState(cached?.recentTasks ?? [])
  const [recentLoading, setRecentLoading] = useState(false)

  const hasCachedData = !!cached

  useEffect(() => {
    if (!hasCachedData) {
      fetchData()
      fetchRecentTasks()
    }
    return () => {
      setPageCache(CACHE_KEY, { stats, chartData, trendData, recentTasks })
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getTodoBoardData(getAuthParams())
      const statusStat = res?.statusStat || {}
      const projectStatList = res?.projectStatList || []
      const recent7DaysTrend = res?.recent7DaysTrend || {}

      const newStats = {
        projectCount: res?.projectCount || 0,
        totalTask: (statusStat.pendingTask || 0) + (statusStat.inProgressTask || 0) + (statusStat.completedTask || 0) + (statusStat.overdueTask || 0),
        inProgressTask: statusStat.inProgressTask || 0,
        overdueTask: statusStat.overdueTask || 0,
        completedTask: statusStat.completedTask || 0
      }

      const newChartData = {
        projects: projectStatList.map(p => p.PROJECTNAME),
        counts: projectStatList.map(p => p.TASKCOUNT),
        completionData: projectStatList.map(p => ({
          name: p.PROJECTNAME,
          completed: p.COMPLETEDCOUNT || 0,
          total: p.TASKCOUNT || 0
        }))
      }

      const newTrendData = {
        dates: recent7DaysTrend.dates || [],
        newTask: recent7DaysTrend.newTask || [],
        completedTask: recent7DaysTrend.completedTask || []
      }

      setStats(newStats)
      setChartData(newChartData)
      setTrendData(newTrendData)
      setPageCache(CACHE_KEY, { stats: newStats, chartData: newChartData, trendData: newTrendData, recentTasks })
    } catch (e) {
      console.error(e)
      setError('看板数据加载失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentTasks = async () => {
    setRecentLoading(true)
    try {
      const res = await getTodoTaskList({ ...getAuthParams(), pageNum: 1, pageSize: 10 })
      const taskList = res?.rows || res || []
      const newRecentTasks = taskList.map((task, index) => ({
        ...task,
        key: task.taskId || index
      }))
      setRecentTasks(newRecentTasks)
      setPageCache(CACHE_KEY, { stats, chartData, trendData, recentTasks: newRecentTasks })
    } catch (e) {
      console.error(e)
    } finally {
      setRecentLoading(false)
    }
  }

  const pieOption = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, left: 'center', textStyle: { fontSize: 12 } },
    series: [{
      name: '任务状态',
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: [
        { value: stats.completedTask, name: '已完成', itemStyle: { color: '#52c41a' } },
        { value: stats.inProgressTask, name: '进行中', itemStyle: { color: '#1890ff' } },
        { value: stats.overdueTask, name: '已逾期', itemStyle: { color: '#ff4d4f' } },
        { value: stats.totalTask - stats.completedTask - stats.inProgressTask - stats.overdueTask, name: '待开始', itemStyle: { color: '#d9d9d9' } }
      ]
    }]
  }), [stats])

  const barOption = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: chartData.projects, axisLabel: { interval: 0, rotate: chartData.projects.length > 4 ? 30 : 0 } },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      name: '任务数量',
      type: 'bar',
      data: chartData.counts,
      barWidth: '40%',
      itemStyle: { color: '#1890ff', borderRadius: [4, 4, 0, 0] }
    }]
  }), [chartData])

  const ringOption = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} 项 ({d}%)' },
    legend: { bottom: 0, left: 'center', textStyle: { fontSize: 12 } },
    series: [{
      name: '项目完成度',
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: chartData.completionData.map(item => ({
        name: item.name,
        value: item.completed,
        itemStyle: { color: item.completed === item.total && item.total > 0 ? '#52c41a' : '#1890ff' }
      })).concat(chartData.completionData.length > 0 ? [{
        name: '未完成',
        value: chartData.completionData.reduce((sum, item) => sum + (item.total - item.completed), 0),
        itemStyle: { color: '#f0f0f0' }
      }] : [])
    }]
  }), [chartData])

  const lineOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, data: ['新增任务', '完成任务'] },
    grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: trendData.dates },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        name: '新增任务',
        type: 'line',
        smooth: true,
        data: trendData.newTask,
        areaStyle: { opacity: 0.15 },
        itemStyle: { color: '#faad14' }
      },
      {
        name: '完成任务',
        type: 'line',
        smooth: true,
        data: trendData.completedTask,
        areaStyle: { opacity: 0.15 },
        itemStyle: { color: '#52c41a' }
      }
    ]
  }), [trendData])

  const hasChartData = useMemo(() => chartData.projects.length > 0, [chartData])
  const hasTrendData = useMemo(() => trendData.dates.length > 0, [trendData])

  const handleRowClick = useCallback((record) => {
    window.location.hash = '#/task/todo'
  }, [])

  return {
    loading, error, stats, chartData, trendData, recentTasks, recentLoading,
    pieOption, barOption, ringOption, lineOption, hasChartData, hasTrendData,
    handleRowClick
  }
}

export default useDashboardModel
