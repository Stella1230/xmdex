import { useState, useEffect, useRef, useCallback } from 'react'
import { Form, message } from 'antd'
import { getTodoProjectList, getTodoProject, addTodoProject, updateTodoProject, deleteTodoProject, getDeptTree } from '../services'
import { getPageCache, setPageCache } from '../common/PageCache'

const CACHE_KEY = 'projectList'

const transformTreeData = (nodes) => {
  if (!Array.isArray(nodes)) return []
  return nodes.map(n => ({
    key: n.id, value: n.id, title: n.deptName,
    children: n.children ? transformTreeData(n.children) : []
  }))
}

const useProjectListModel = () => {
  const cached = getPageCache(CACHE_KEY)

  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [data, setData] = useState([])
  const [selectedDept, setSelectedDept] = useState(cached?.selectedDept ?? null)
  const [selectedDeptName, setSelectedDeptName] = useState(cached?.selectedDeptName ?? '')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增项目')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const paginationRef = useRef(cached?.pagination ?? { current: 1, pageSize: 10, total: 0 })
  const [pagination, setPagination] = useState(cached?.pagination ?? { current: 1, pageSize: 10, total: 0 })
  const [queryParams, setQueryParams] = useState(cached?.queryParams ?? {})
  const [deptTreeData, setDeptTreeData] = useState([])

  const isInitializedRef = useRef(!!cached)

  useEffect(() => {
    fetchDeptTreeData()
    return () => {
      setPageCache(CACHE_KEY, { selectedDept, selectedDeptName, pagination, queryParams })
    }
  }, [])

  useEffect(() => {
    if (!cached) return
    setPageCache(CACHE_KEY, { selectedDept, selectedDeptName, pagination, queryParams })
  }, [selectedDept, selectedDeptName, pagination, queryParams])

  useEffect(() => {
    if (!isInitializedRef.current) return
    paginationRef.current = { ...paginationRef.current, current: 1 }
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData()
  }, [selectedDept])

  useEffect(() => {
    if (isInitializedRef.current || cached) return
    if (deptTreeData.length > 0) {
      isInitializedRef.current = true
      setSelectedDept(deptTreeData[0].key)
      setSelectedDeptName(deptTreeData[0].title)
    }
  }, [deptTreeData])

  const fetchDeptTreeData = async () => {
    try {
      const res = await getDeptTree({})
      const tree = transformTreeData(Array.isArray(res) ? res : [])
      setDeptTreeData(tree)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const p = { ...paginationRef.current, ...params }
      const query = { pageNum: p.current, pageSize: p.pageSize, ...queryParams, deptId: selectedDept }
      const res = await getTodoProjectList(query)
      setData(res.rows || [])
      const newPag = { current: p.current, pageSize: p.pageSize, total: res.total || 0 }
      paginationRef.current = newPag
      setPagination(newPag)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleQuery = (values) => {
    setQueryParams(values)
    paginationRef.current = { ...paginationRef.current, current: 1 }
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData({ pageNum: 1 })
  }

  const findDeptName = (tree, key) => {
    for (const node of tree) {
      if (node.key === key) return node.title
      if (node.children) {
        const found = findDeptName(node.children, key)
        if (found) return found
      }
    }
    return ''
  }

  const handleDeptSelect = (keys) => {
    setSelectedDept(keys)
    setSelectedDeptName(findDeptName(deptTreeData, keys))
  }

  const handleAdd = () => {
    setModalTitle('新增项目')
    form.resetFields()
    form.setFieldsValue({ status: 'ACTIVE', completionRate: 0 })
    if (selectedDept) {
      form.setFieldsValue({ deptId: selectedDept })
    }
    setModalVisible(true)
  }

  const handleEdit = async (record) => {
    setModalTitle('编辑项目')
    try {
      const res = await getTodoProject({ id: record.projectId })
      form.setFieldsValue(res)
      setModalVisible(true)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    setDeleteLoading(id)
    try {
      await deleteTodoProject({ id })
      message.success('删除成功')
      fetchData()
    } catch (e) {
      console.error(e)
      message.error('删除失败')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)
      if (values.projectId) {
        await updateTodoProject(values)
        message.success('更新成功')
      } else {
        await addTodoProject(values)
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
    loading, deleteLoading, data, selectedDept, selectedDeptName, modalVisible, modalTitle,
    submitLoading, form, pagination, deptTreeData,
    handleQuery, handleDeptSelect, handleAdd, handleEdit, handleDelete,
    handleSubmit, handlePageChange, setSelectedDept
  }
}

export default useProjectListModel
