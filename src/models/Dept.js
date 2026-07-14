import { useState, useEffect, useRef } from 'react'
import { Form, message } from 'antd'
import { getDeptTree, getDeptList, getDeptDetail, addDept, updateDept, deleteDept } from '../services'
import { getPageCache, setPageCache } from '../common/PageCache'

const CACHE_KEY = 'dept'

const useDeptModel = () => {
  const cached = getPageCache(CACHE_KEY)

  const [loading, setLoading] = useState(false)
  const [flatData, setFlatData] = useState([])
  const [deptTree, setDeptTree] = useState([])
  const [selectedDept, setSelectedDept] = useState(cached?.selectedDept ?? null)
  const [selectedDeptName, setSelectedDeptName] = useState(cached?.selectedDeptName ?? '')
  const [deptMap, setDeptMap] = useState({})
  const [queryParams, setQueryParams] = useState(cached?.queryParams ?? {})
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增部门')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState(cached?.pagination ?? { current: 1, pageSize: 10, total: 0 })
  const paginationRef = useRef(pagination)
  paginationRef.current = pagination

  const isInitializedRef = useRef(!!cached)

  useEffect(() => {
    initPage()
    return () => {
      setPageCache(CACHE_KEY, { selectedDept, selectedDeptName, queryParams, pagination })
    }
  }, [])

  useEffect(() => {
    setPageCache(CACHE_KEY, { selectedDept, selectedDeptName, queryParams, pagination })
  }, [selectedDept, selectedDeptName, queryParams, pagination])

  useEffect(() => {
    if (!selectedDept) return
    if (!isInitializedRef.current) return
    fetchData({ pageNum: 1 })
    setPagination(prev => ({ ...prev, current: 1 }))
  }, [selectedDept])

  const initPage = async () => {
    const treeData = await fetchDeptTree()
    if (!isInitializedRef.current && treeData.length > 0) {
      const firstId = treeData[0].id
      const firstName = treeData[0].deptName
      isInitializedRef.current = true
      setSelectedDept(firstId)
      setSelectedDeptName(firstName)
      await fetchData({ pageNum: 1, rootId: firstId })
    } else if (isInitializedRef.current && selectedDept) {
      await fetchData({ pageNum: 1, rootId: selectedDept })
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

  const handleDeptSelect = (key) => {
    setSelectedDept(key)
    setSelectedDeptName(key ? findDeptName(deptTree, key) : '')
  }

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const { current, pageSize } = paginationRef.current
      const query = {
        pageNum: params.pageNum || current,
        pageSize: params.pageSize || pageSize,
        ...queryParams,
        ...params
      }
      if (selectedDept) {
        query.rootId = selectedDept
      }
      const res = await getDeptList(query)
      let list = []
      let total = 0
      if (res.resultData) {
        list = res.resultData.content || res.resultData.rows || []
        total = res.resultData.totalElements || res.resultData.total || list.length
      } else if (res.content) {
        list = res.content
        total = res.totalElements || res.total || list.length
      } else if (Array.isArray(res)) {
        list = res
        total = res.length
      } else if (res.rows) {
        list = res.rows
        total = res.total || 0
      }
      setFlatData(list)
      setPagination(prev => ({ ...prev, total, ...params }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeptTree = async () => {
    try {
      const res = await getDeptTree({})
      let treeData = []
      if (Array.isArray(res)) {
        treeData = res
      } else if (res && typeof res === 'object') {
        treeData = Object.values(res).filter(Boolean)
      }
      setDeptTree(treeData)
      const map = {}
      const buildMap = (nodes) => {
        nodes.forEach(n => { map[n.id] = n.deptName; if (n.children) buildMap(n.children) })
      }
      buildMap(treeData)
      setDeptMap(map)
      return treeData
    } catch (e) {
      console.error(e)
      return []
    }
  }

  const handleQuery = (values) => {
    setQueryParams(values)
    fetchData({ ...values, pageNum: 1 })
  }

  const handleReset = () => {
    setQueryParams({})
    setSelectedDept(null)
    setSelectedDeptName('')
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData({ pageNum: 1, rootId: null })
  }

  const handleAddTop = () => {
    setModalTitle('新增顶级部门')
    setEditingId(null)
    form.resetFields()
    form.setFieldsValue({ parentId: '0', parentName: '无（顶级部门）' })
    setModalVisible(true)
  }

  const handleAddChild = (dept) => {
    setModalTitle('新增子部门')
    setEditingId(null)
    form.resetFields()
    form.setFieldsValue({
      parentId: dept.id,
      parentName: dept.deptName
    })
    setModalVisible(true)
  }

  const handleEdit = async (dept) => {
    setModalTitle('编辑部门')
    setEditingId(dept.id)
    try {
      const res = await getDeptDetail({ id: dept.id })
      const deptDetail = res.data || res
      form.setFieldsValue({
        ...deptDetail,
        id: deptDetail.id,
        parentId: deptDetail.parentId,
        parentName: deptMap[deptDetail.parentId] || (deptDetail.parentId === '0' ? '无（顶级部门）' : '-')
      })
      setModalVisible(true)
    } catch (e) {
      console.error(e)
      message.error('获取部门详情失败')
    }
  }

  const handleDelete = async (dept) => {
    if (loading) return
    try {
      await deleteDept({ id: dept.id })
      message.success('删除成功')
      fetchData()
      fetchDeptTree()
    } catch (e) {
      console.error(e)
      message.error(e.message || '删除失败，该部门可能存在子部门或已绑定用户')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)
      try {
        if (editingId) {
          await updateDept({ id: values.id, deptName: values.deptName, remark: values.remark })
          message.success('更新成功')
        } else {
          await addDept({ deptName: values.deptName, parentId: values.parentId, remark: values.remark })
          message.success('创建成功')
        }
        setModalVisible(false)
        fetchData()
        fetchDeptTree()
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
    loading, flatData, deptTree, selectedDept, selectedDeptName, deptMap,
    queryParams, modalVisible, modalTitle, submitLoading, editingId, form, pagination,
    handleDeptSelect, handleQuery, handleReset, handleAddTop, handleAddChild,
    handleEdit, handleDelete, handleSubmit, handlePageChange,
    setSelectedDept, setSelectedDeptName, fetchData, fetchDeptTree
  }
}

export default useDeptModel
