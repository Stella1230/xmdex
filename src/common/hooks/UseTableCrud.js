import { useState, useRef, useCallback } from 'react'
import { Form, message } from 'antd'

const useTableCRUD = ({ fetchApi, defaultPageSize = 10 }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: defaultPageSize, total: 0 })
  const paginationRef = useRef(pagination)
  const [queryParams, setQueryParams] = useState({})

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const page = params.pageNum || paginationRef.current.current
      const size = params.pageSize || paginationRef.current.pageSize
      const res = await fetchApi({ pageNum: page, pageSize: size, ...queryParams, ...params })
      const list = res?.rows || res?.content || res?.list || []
      const total = res?.total || res?.totalElements || 0
      setData(list)
      setPagination(prev => ({ ...prev, current: page, total }))
      paginationRef.current = { ...paginationRef.current, current: page, total }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [fetchApi, queryParams])

  const handleAdd = useCallback((title = '新增') => {
    setEditingId(null)
    setModalTitle(title)
    form.resetFields()
    setModalVisible(true)
  }, [form])

  const handleEdit = useCallback((record, title = '编辑') => {
    setEditingId(record.id || record.taskId || record.projectId)
    setModalTitle(title)
    form.setFieldsValue(record)
    setModalVisible(true)
  }, [form])

  const handleDelete = useCallback(async (deleteApi, id, successMsg = '删除成功') => {
    try {
      await deleteApi({ id })
      message.success(successMsg)
      fetchData()
    } catch (e) {
      console.error(e)
      message.error('删除失败')
    }
  }, [fetchData])

  const handleSubmit = useCallback(async ({ submitApi, successMsg = '操作成功', onFinish }) => {
    setSubmitLoading(true)
    try {
      const values = await form.validateFields()
      const payload = editingId ? { ...values, id: editingId } : values
      await submitApi(payload)
      message.success(successMsg)
      setModalVisible(false)
      form.resetFields()
      setEditingId(null)
      onFinish?.()
      fetchData()
    } catch (e) {
      if (e.errorFields) return
      console.error(e)
    } finally {
      setSubmitLoading(false)
    }
  }, [form, editingId, fetchData])

  const handleQuery = useCallback((values) => {
    setQueryParams(values)
    paginationRef.current = { ...paginationRef.current, current: 1 }
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData({ pageNum: 1, ...values })
  }, [fetchData])

  const handleReset = useCallback(() => {
    setQueryParams({})
    paginationRef.current = { ...paginationRef.current, current: 1 }
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData({ pageNum: 1 })
  }, [fetchData])

  return {
    loading, data, pagination, form,
    modalVisible, setModalVisible, modalTitle, setModalTitle,
    submitLoading, editingId, setEditingId,
    handleAdd, handleEdit, handleSubmit, handleDelete,
    handleQuery, handleReset,
    paginationRef, setQueryParams, setData,
    fetchData, setPagination
  }
}

export default useTableCRUD
