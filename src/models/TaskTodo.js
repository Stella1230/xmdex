import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Form, message } from 'antd'
import { getTodoTaskList, getTodoTask, addTodoTask, updateTodoTask, deleteTodoTask, getTodoProjectList, getUserList, getDeptTree } from '../services'
import { useAuth } from '../common/Auth'
import { getPageCache, setPageCache } from '../common/PageCache'

const CACHE_KEY = 'taskTodo'
const ROLE_ADMIN = 'ROLE_ADMIN'
const ROLE_DEPT_MANAGER = 'ROLE_DEPT_MANAGER'
const ROLE_GROUP_LEADER = 'ROLE_GROUP_LEADER'
const ROLE_EMPLOYEE = 'ROLE_EMPLOYEE'

const useTaskTodoModel = () => {
  const { roleId, userId, deptId } = useAuth()
  const cached = getPageCache(CACHE_KEY)

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [selectedDept, setSelectedDept] = useState(cached?.selectedDept ?? null)
  const [selectedDeptName, setSelectedDeptName] = useState(cached?.selectedDeptName ?? '')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增任务')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()
  const paginationRef = useRef(cached?.pagination ?? { current: 1, pageSize: 10, total: 0 })
  const [pagination, setPagination] = useState(cached?.pagination ?? { current: 1, pageSize: 10, total: 0 })
  const [queryParams, setQueryParams] = useState(cached?.queryParams ?? {})
  const [deptTreeData, setDeptTreeData] = useState([])

  const isInitializedRef = useRef(!!cached)

  const isAdmin = roleId === ROLE_ADMIN
  const isDeptManager = roleId === ROLE_DEPT_MANAGER
  const isGroupLeader = roleId === ROLE_GROUP_LEADER
  const isEmployee = roleId === ROLE_EMPLOYEE

  const canAdd = isAdmin || isDeptManager || isGroupLeader
  const canEdit = isAdmin || isDeptManager || isGroupLeader
  const canDelete = isAdmin
  const canUpdateStatusOnly = isEmployee

  const filteredUsers = useMemo(() => {
    if (isAdmin) return users
    if (isDeptManager) return users.filter(u => u.deptId === deptId)
    if (isGroupLeader) return users.filter(u => u.deptId === deptId)
    return []
  }, [users, roleId, deptId, isAdmin, isDeptManager, isGroupLeader])

  useEffect(() => {
    fetchProjects()
    fetchUsers()
    initPage()
    return () => {
      setPageCache(CACHE_KEY, { selectedDept, selectedDeptName, pagination, queryParams })
    }
  }, [])

  useEffect(() => {
    setPageCache(CACHE_KEY, { selectedDept, selectedDeptName, pagination, queryParams })
  }, [selectedDept, selectedDeptName, pagination, queryParams])

  useEffect(() => {
    if (!selectedDept) return
    if (!isInitializedRef.current) return
    paginationRef.current = { ...paginationRef.current, current: 1 }
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData()
  }, [selectedDept])

  const fetchDeptTree = async () => {
    try {
      const deptId = localStorage.getItem('deptId')
      const res = await getDeptTree({ deptId:deptId })
      let treeData = []
      if (Array.isArray(res)) {
        treeData = res
      } else if (res && typeof res === 'object') {
        treeData = Object.values(res).filter(Boolean)
      }
      setDeptTreeData(treeData)
      return treeData
    } catch (e) {
      console.error(e)
      return []
    }
  }

  const initPage = async () => {
    const treeList = await fetchDeptTree()
    let deptIdToFetch = selectedDept
    if (!deptIdToFetch && treeList.length > 0) {
      deptIdToFetch = treeList[0].id
      setSelectedDept(deptIdToFetch)
      setSelectedDeptName(treeList[0].deptName)
    }
    isInitializedRef.current = true
    if (deptIdToFetch) {
      fetchData({ pageNum: 1, deptId: deptIdToFetch })
    }
  }

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const p = { ...paginationRef.current, ...params }
      const query = { pageNum: p.current, pageSize: p.pageSize, ...queryParams, deptId: params.deptId || selectedDept }
      const res = await getTodoTaskList(query)
      const pageData = res.resultData || res
      setData(pageData.content || pageData.rows || [])
      const newPag = { current: p.current, pageSize: p.pageSize, total: pageData.totalElements || pageData.total || 0 }
      paginationRef.current = newPag
      setPagination(newPag)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await getTodoProjectList({ pageNum: 1, pageSize: 100 })
      const pageData = res.resultData || res
      setProjects(pageData.content || pageData.rows || [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await getUserList({ pageNum: 1, pageSize: 100 })
      const pageData = res.resultData || res
      setUsers(pageData.content || pageData.rows || [])
    } catch (e) {
      console.error(e)
    }
  }

  const findDeptName = (tree, key) => {
    for (const node of tree) {
      if (node.id === key) return node.deptName
      if (node.children) {
        const found = findDeptName(node.children, key)
        if (found) return found
      }
    }
    return ''
  }

  const handleDeptSelect = useCallback((keys) => {
    setSelectedDept(keys)
    setSelectedDeptName(findDeptName(deptTreeData, keys))
  }, [deptTreeData])

  const handleQuery = (values) => {
    const formatted = { ...values }
    if (formatted.dateRange && formatted.dateRange[0]) {
      formatted.dateRange = [
        formatted.dateRange[0].format('YYYY-MM-DD'),
        formatted.dateRange[1].format('YYYY-MM-DD')
      ]
    }
    setQueryParams(formatted)
    paginationRef.current = { ...paginationRef.current, current: 1 }
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData({ pageNum: 1 })
  }

  const handleAdd = () => {
    setModalTitle('新增任务')
    setEditingRecord(null)
    form.resetFields()
    form.setFieldsValue({ status: '0' })
    if (selectedDept) {
      form.setFieldsValue({ deptId: selectedDept })
    }
    setModalVisible(true)
  }

  const handleEdit = async (record) => {
    setModalTitle('编辑任务')
    setEditingRecord(record)
    try {
      const res = await getTodoTask({ id: record.taskId })
      const dayjs = require('dayjs')
      form.setFieldsValue({ ...res, planFinishTime: res.planFinishTime ? dayjs(res.planFinishTime) : null })
      setModalVisible(true)
    } catch (e) {
      console.error(e)
    }
  }

  const handleStatusUpdate = async (record) => {
    setModalTitle('更新状态')
    setEditingRecord(record)
    form.resetFields()
    form.setFieldsValue({ taskId: record.taskId, status: record.status })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteTodoTask({ id })
      message.success('删除成功')
      fetchData()
    } catch (e) {
      console.error(e)
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)

      if (canUpdateStatusOnly && editingRecord) {
        await updateTodoTask({ taskId: values.taskId, status: values.status })
        message.success('状态更新成功')
      } else if (values.taskId) {
        const dayjs = require('dayjs')
        const params = { ...values, planFinishTime: values.planFinishTime?.format('YYYY-MM-DD') }
        await updateTodoTask(params)
        message.success('更新成功')
      } else {
        const dayjs = require('dayjs')
        const params = { ...values, planFinishTime: values.planFinishTime?.format('YYYY-MM-DD') }
        await addTodoTask(params)
        message.success('创建成功')
      }
      setModalVisible(false)
      fetchData()
    } catch (e) {
      if (e.errorFields) return
      console.error(e)
      message.error('操作失败')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handlePageChange = (page, size) => {
    paginationRef.current = { ...paginationRef.current, current: page, pageSize: size }
    fetchData({ pageNum: page, pageSize: size })
  }

  return {
    loading, data, projects, users, selectedDept, selectedDeptName, modalVisible, modalTitle,
    submitLoading, editingRecord, form, pagination, queryParams, deptTreeData,
    isAdmin, canAdd, canEdit, canDelete, canUpdateStatusOnly, filteredUsers,
    handleDeptSelect, handleQuery, handleAdd, handleEdit, handleStatusUpdate,
    handleDelete, handleSubmit, handlePageChange, setSelectedDept, setModalVisible
  }
}

export default useTaskTodoModel
