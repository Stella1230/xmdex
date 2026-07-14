import { useState, useEffect, useRef } from 'react'
import { Form, message } from 'antd'
import { getUserList, addUser, updateUser, deleteUser, resetPwd, getDeptTree, getRoleList } from '../services'
import { getPageCache, setPageCache } from '../common/PageCache'

const CACHE_KEY = 'user'

const useUserModel = () => {
  const cached = getPageCache(CACHE_KEY)

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [selectedDept, setSelectedDept] = useState(cached?.selectedDept ?? null)
  const [selectedDeptName, setSelectedDeptName] = useState(cached?.selectedDeptName ?? '')
  const [roles, setRoles] = useState([])
  const [deptMap, setDeptMap] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增用户')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [pagination, setPagination] = useState(cached?.pagination ?? { current: 1, pageSize: 10, total: 0 })
  const paginationRef = useRef(pagination)
  paginationRef.current = pagination
  const [deptTreeData, setDeptTreeData] = useState([])

  const isInitializedRef = useRef(!!cached)

  useEffect(() => {
    initPage()
    return () => {
      setPageCache(CACHE_KEY, { selectedDept, selectedDeptName, pagination })
    }
  }, [])

  useEffect(() => {
    setPageCache(CACHE_KEY, { selectedDept, selectedDeptName, pagination })
  }, [selectedDept, selectedDeptName, pagination])

  useEffect(() => {
    if (!selectedDept) return
    if (!isInitializedRef.current) return
    fetchData({ pageNum: 1 })
    setPagination(prev => ({ ...prev, current: 1 }))
  }, [selectedDept])

  const initPage = async () => {
    await fetchDeptTreeData()
    await fetchRoles()
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
    } else if (selectedDept) {
      await fetchData({ pageNum: 1 })
    }
  }

  const fetchRoles = async () => {
    try {
      const res = await getRoleList({ pageNum: 1, pageSize: 100 })
      setRoles(res.resultData?.rows || res.rows || [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchDeptTreeData = async () => {
    try {
      const res = await getDeptTree({})
      const list = Array.isArray(res) ? res : (res && typeof res === 'object' ? Object.values(res).filter(Boolean) : [])
      const map = {}
      const buildMap = (nodes) => {
        nodes.forEach(n => { map[n.id] = n.deptName; if (n.children) buildMap(n.children) })
      }
      buildMap(list)
      setDeptMap(map)
      setDeptTreeData(list.map(n => ({
        key: n.id, value: n.id, title: n.deptName,
        children: n.children ? n.children.map(c => ({
          key: c.id, value: c.id, title: c.deptName,
          children: c.children ? c.children.map(gc => ({ key: gc.id, value: gc.id, title: gc.deptName, children: [] })) : []
        })) : []
      })))
      if (!isInitializedRef.current && list.length > 0) {
        setSelectedDept(list[0].id)
        setSelectedDeptName(list[0].deptName)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeptSelect = (key) => {
    setSelectedDept(key)
    setSelectedDeptName(key ? deptMap[key] || '' : '')
  }

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const { current, pageSize } = paginationRef.current
      const query = { pageNum: params.pageNum || current, pageSize: params.pageSize || pageSize, ...params, deptId: selectedDept }
      const res = await getUserList(query)
      setData(res.rows || [])
      setPagination(prev => ({ ...prev, total: res.total, ...params }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (values) => {
    fetchData({ ...values, pageNum: 1 })
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSelectedDept(null)
    setSelectedDeptName('')
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData({ pageNum: 1, deptId: null })
  }

  const handleAdd = () => {
    setModalTitle('新增用户')
    setEditingId(null)
    form.resetFields()
    if (selectedDept) {
      form.setFieldsValue({ deptId: selectedDept })
    }
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setModalTitle('编辑用户')
    setEditingId(record.id)
    form.setFieldsValue({ ...record, userName: record.username })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    if (loading) return
    try {
      await deleteUser({ id })
      message.success('删除成功')
      fetchData()
    } catch (e) {
      console.error(e)
      message.error(e.message || '删除失败')
    }
  }

  const handleResetPwd = async (record) => {
    if (loading) return
    try {
      await resetPwd({ id: record.id })
      message.success('密码已重置')
    } catch (e) {
      console.error(e)
      message.error(e.message || '重置失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)
      try {
        if (editingId) {
          await updateUser(values)
          message.success('更新成功')
        } else {
          await addUser(values)
          message.success('创建成功')
        }
        setModalVisible(false)
        fetchData()
      } catch (e) {
        console.error(e)
        message.error(e.message || '操作失败')
      } finally {
        setSubmitLoading(false)
      }
    } catch (e) {
      // form.validateFields 校验失败
    }
  }

  const handlePageChange = (page, size) => {
    fetchData({ pageNum: page, pageSize: size })
  }

  return {
    loading, data, selectedDept, selectedDeptName, roles, deptMap,
    modalVisible, modalTitle, submitLoading, editingId, form, searchForm,
    pagination, deptTreeData,
    handleDeptSelect, handleSearch, handleReset, handleAdd, handleEdit,
    handleDelete, handleResetPwd, handleSubmit, handlePageChange,
    setSelectedDept, setSelectedDeptName
  }
}

export default useUserModel
